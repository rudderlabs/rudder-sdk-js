import { clone } from 'ramda';
import { effect } from '@preact/signals-core';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import type { ApiCallback } from '@rudderstack/analytics-js-common/types/EventApi';
import { isHybridModeDestination } from '@rudderstack/analytics-js-common/utilities/destinations';
import { API_SUFFIX } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { state } from '../../state';
import type { IEventRepository } from './types';
import {
  DATA_PLANE_QUEUE_EXT_POINT_PREFIX,
  DESTINATIONS_QUEUE_EXT_POINT_PREFIX,
  DMT_EXT_POINT_PREFIX,
} from './constants';
import { getFinalEvent, shouldBufferEventsForPreConsent } from './utils';
import { safelyInvokeCallback } from '../utilities/callbacks';

/**
 * Event repository class responsible for queuing events for further processing and delivery
 */
class EventRepository implements IEventRepository {
  errorHandler: IErrorHandler;
  logger: ILogger;
  pluginsManager: IPluginsManager;
  httpClient: IHttpClient;
  storeManager: IStoreManager;
  dataplaneEventsQueue: any;
  destinationsEventsQueue: any;
  dmtEventsQueue: any;

  /**
   *
   * @param pluginsManager Plugins manager instance
   * @param storeManager Store Manager instance
   * @param errorHandler Error handler object
   * @param logger Logger object
   */
  constructor(
    pluginsManager: IPluginsManager,
    storeManager: IStoreManager,
    httpClient: IHttpClient,
    errorHandler: IErrorHandler,
    logger: ILogger,
  ) {
    this.pluginsManager = pluginsManager;
    this.errorHandler = errorHandler;
    this.httpClient = httpClient;
    this.logger = logger;
    this.storeManager = storeManager;
  }

  /**
   * Initializes the event repository
   */
  init(): void {
    this.dataplaneEventsQueue = this.pluginsManager.invokeSingle(
      `${DATA_PLANE_QUEUE_EXT_POINT_PREFIX}.init`,
      state,
      this.httpClient,
      this.storeManager,
      this.errorHandler,
      this.logger,
    );

    this.dmtEventsQueue = this.pluginsManager.invokeSingle(
      `${DMT_EXT_POINT_PREFIX}.init`,
      state,
      this.pluginsManager,
      this.httpClient,
      this.storeManager,
      this.errorHandler,
      this.logger,
    );

    this.destinationsEventsQueue = this.pluginsManager.invokeSingle(
      `${DESTINATIONS_QUEUE_EXT_POINT_PREFIX}.init`,
      state,
      this.pluginsManager,
      this.storeManager,
      this.dmtEventsQueue,
      this.errorHandler,
      this.logger,
    );

    // Start the queue once the client destinations are ready
    effect(() => {
      if (state.nativeDestinations.clientDestinationsReady.value === true) {
        this.destinationsEventsQueue?.start();
        this.dmtEventsQueue?.start();
      }
    });

    const bufferEventsBeforeConsent = shouldBufferEventsForPreConsent(state);
    if (!bufferEventsBeforeConsent) {
      this.startDpEventsQueue();
    }
  }

  private startDpEventsQueue() {
    const bufferEventsUntilReady = state.loadOptions.value
      .bufferDataPlaneEventsUntilReady as boolean;
    const hybridDestExist = state.nativeDestinations.activeDestinations.value.some(
      (dest: Destination) => isHybridModeDestination(dest),
    );
    const shouldBufferDpEvents = bufferEventsUntilReady && hybridDestExist;

    let timeoutId: number;
    // Start the queue when no event buffering is required
    // or when the client destinations are ready
    effect(() => {
      if (
        (!shouldBufferDpEvents || state.nativeDestinations.clientDestinationsReady.value) &&
        this.dataplaneEventsQueue?.scheduleTimeoutActive !== true
      ) {
        (globalThis as typeof window).clearTimeout(timeoutId);
        this.dataplaneEventsQueue?.start();
      }
    });

    // Force start the data plane events queue processing after a timeout
    if (shouldBufferDpEvents) {
      timeoutId = (globalThis as typeof window).setTimeout(() => {
        if (this.dataplaneEventsQueue?.scheduleTimeoutActive !== true) {
          this.dataplaneEventsQueue?.start();
        }
      }, state.loadOptions.value.dataPlaneEventsBufferTimeout);
    }
  }

  resume() {
    if (
      this.dataplaneEventsQueue?.scheduleTimeoutActive !== true &&
      state.consents.postConsent.value.discardPreConsentEvents
    ) {
      this.dataplaneEventsQueue?.clear();
      this.destinationsEventsQueue?.clear();
    }

    this.startDpEventsQueue();
  }

  /**
   * Enqueues the event for processing
   * @param event RudderEvent object
   * @param callback API callback function
   */
  enqueue(event: RudderEvent, callback?: ApiCallback): void {
    const dpQEvent = getFinalEvent(event, state);
    this.pluginsManager.invokeSingle(
      `${DATA_PLANE_QUEUE_EXT_POINT_PREFIX}.enqueue`,
      state,
      this.dataplaneEventsQueue,
      dpQEvent,
      this.errorHandler,
      this.logger,
    );

    const dQEvent = clone(event);
    this.pluginsManager.invokeSingle(
      `${DESTINATIONS_QUEUE_EXT_POINT_PREFIX}.enqueue`,
      state,
      this.destinationsEventsQueue,
      dQEvent,
      this.errorHandler,
      this.logger,
    );

    // Invoke the callback if it exists
    const apiName = `${event.type.charAt(0).toUpperCase()}${event.type.slice(1)}${API_SUFFIX}`;
    safelyInvokeCallback(callback, [dpQEvent], apiName, this.logger);
  }
}

export { EventRepository };
