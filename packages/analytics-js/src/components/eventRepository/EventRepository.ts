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
import { EVENT_REPOSITORY } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import {
  API_CALLBACK_INVOKE_ERROR,
  DATAPLANE_EVENTS_ENQUEUE_ERROR,
  DMT_PLUGIN_INITIALIZE_ERROR,
  NATIVE_DEST_PLUGIN_ENQUEUE_ERROR,
  NATIVE_DEST_PLUGIN_INITIALIZE_ERROR,
} from '../../constants/logMessages';
import { state } from '../../state';
import type { IEventRepository } from './types';
import { DESTINATIONS_QUEUE_EXT_POINT_PREFIX, DMT_EXT_POINT_PREFIX } from './constants';
import { getFinalEvent, shouldBufferEventsForPreConsent } from './utils';
import type { IDataPlaneEventsQueue } from '../dataPlaneEventsQueue/types';
import { DataPlaneEventsQueue } from '../dataPlaneEventsQueue/DataPlaneEventsQueue';

/**
 * Event repository class responsible for queuing events for further processing and delivery
 */
class EventRepository implements IEventRepository {
  private_errorHandler?: IErrorHandler;
  private_logger?: ILogger;
  private_pluginsManager: IPluginsManager;
  private_httpClient: IHttpClient;
  private_storeManager: IStoreManager;
  private_dataplaneEventsQueue: IDataPlaneEventsQueue;
  private_destinationsEventsQueue: any;
  private_dmtEventsQueue: any;

  /**
   * Constructor for EventRepository
   * @param httpClient HTTP client instance
   * @param pluginsManager Plugins manager instance
   * @param storeManager Store Manager instance
   * @param errorHandler Error handler object
   * @param logger Logger object
   */
  constructor(
    httpClient: IHttpClient,
    pluginsManager: IPluginsManager,
    storeManager: IStoreManager,
    errorHandler?: IErrorHandler,
    logger?: ILogger,
  ) {
    this.private_pluginsManager = pluginsManager;
    this.private_errorHandler = errorHandler;
    this.private_logger = logger;
    this.private_httpClient = httpClient;
    this.private_storeManager = storeManager;
    this.private_onError = this.private_onError.bind(this);
    this.private_dataplaneEventsQueue = new DataPlaneEventsQueue(
      this.private_httpClient,
      this.private_storeManager,
      this.private_logger,
    );
  }

  /**
   * Initializes the event repository
   */
  init(): void {
    try {
      this.private_dmtEventsQueue = this.private_pluginsManager.invokeSingle(
        `${DMT_EXT_POINT_PREFIX}.init`,
        state,
        this.private_pluginsManager,
        this.private_httpClient,
        this.private_storeManager,
        this.private_errorHandler,
        this.private_logger,
      );
    } catch (e) {
      this.private_onError(e, DMT_PLUGIN_INITIALIZE_ERROR);
    }

    try {
      this.private_destinationsEventsQueue = this.private_pluginsManager.invokeSingle(
        `${DESTINATIONS_QUEUE_EXT_POINT_PREFIX}.init`,
        state,
        this.private_pluginsManager,
        this.private_storeManager,
        this.private_dmtEventsQueue,
        this.private_errorHandler,
        this.private_logger,
      );
    } catch (e) {
      this.private_onError(e, NATIVE_DEST_PLUGIN_INITIALIZE_ERROR);
    }

    // Start the queue once the client destinations are ready
    effect(() => {
      if (state.nativeDestinations.clientDestinationsReady.value === true) {
        this.private_destinationsEventsQueue?.start();
        this.private_dmtEventsQueue?.start();
      }
    });

    const bufferEventsBeforeConsent = shouldBufferEventsForPreConsent(state);

    // Start the queue processing only when the destinations are ready or hybrid mode destinations exist
    // However, events will be enqueued for now.
    // At the time of processing the events, the integrations config data from destinations
    // is merged into the event object
    let timeoutId: number;
    effect(() => {
      const shouldBufferDpEvents =
        state.loadOptions.value.bufferDataPlaneEventsUntilReady === true &&
        state.nativeDestinations.clientDestinationsReady.value === false;

      const hybridDestExist = state.nativeDestinations.activeDestinations.value.some(
        (dest: Destination) => isHybridModeDestination(dest),
      );

      if (
        (hybridDestExist === false || shouldBufferDpEvents === false) &&
        !bufferEventsBeforeConsent
      ) {
        (globalThis as typeof window).clearTimeout(timeoutId);
        this.private_dataplaneEventsQueue.start();
      }
    });

    // Force start the data plane events queue processing after a timeout
    if (state.loadOptions.value.bufferDataPlaneEventsUntilReady === true) {
      timeoutId = (globalThis as typeof window).setTimeout(() => {
        this.private_dataplaneEventsQueue.start();
      }, state.loadOptions.value.dataPlaneEventsBufferTimeout);
    }
  }

  resume() {
    if (this.private_dataplaneEventsQueue.isRunning() !== true) {
      if (state.consents.postConsent.value.discardPreConsentEvents) {
        this.private_dataplaneEventsQueue.clear();
        this.private_destinationsEventsQueue?.clear();
      }

      this.private_dataplaneEventsQueue.start();
    }
  }

  /**
   * Enqueues the event for processing
   * @param event RudderEvent object
   * @param callback API callback function
   */
  enqueue(event: RudderEvent, callback?: ApiCallback): void {
    const finalEvent = getFinalEvent(event, state);
    try {
      this.private_dataplaneEventsQueue.enqueue(finalEvent);
    } catch (e) {
      this.private_onError(e, DATAPLANE_EVENTS_ENQUEUE_ERROR);
    }

    try {
      const dQEvent = clone(finalEvent);
      this.private_pluginsManager.invokeSingle(
        `${DESTINATIONS_QUEUE_EXT_POINT_PREFIX}.enqueue`,
        state,
        this.private_destinationsEventsQueue,
        dQEvent,
        this.private_errorHandler,
        this.private_logger,
      );
    } catch (e) {
      this.private_onError(e, NATIVE_DEST_PLUGIN_ENQUEUE_ERROR);
    }

    // Invoke the callback if it exists
    try {
      // Using the event sent to the data plane queue here
      // to ensure the mutated (if any) event is sent to the callback
      callback?.(finalEvent);
    } catch (error) {
      this.private_onError(error, API_CALLBACK_INVOKE_ERROR);
    }
  }

  /**
   * Handles error
   * @param error The error object
   * @param customMessage a message
   * @param shouldAlwaysThrow if it should throw or use logger
   */
  private_onError(error: any, customMessage?: string, shouldAlwaysThrow?: boolean): void {
    if (this.private_errorHandler) {
      this.private_errorHandler.onError(error, EVENT_REPOSITORY, customMessage, shouldAlwaysThrow);
    } else {
      throw error;
    }
  }
}

export { EventRepository };
