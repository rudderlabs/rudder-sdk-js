import { clone } from 'ramda';
import { effect } from '@preact/signals-core';
import { isHybridModeDestination } from '@rudderstack/analytics-js-common/utilities/destinations';
import { EVENT_REPOSITORY } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { API_CALLBACK_INVOKE_ERROR } from '../../constants/logMessages';
import { HttpClient } from '../../services/HttpClient';
import { state } from '../../state';
import {
  DATA_PLANE_QUEUE_EXT_POINT_PREFIX,
  DESTINATIONS_QUEUE_EXT_POINT_PREFIX,
  DMT_EXT_POINT_PREFIX,
} from './constants';
import { getFinalEvent } from './utils';
/**
 * Event repository class responsible for queuing events for further processing and delivery
 */
class EventRepository {
  /**
   *
   * @param pluginsManager Plugins manager instance
   * @param storeManager Store Manager instance
   * @param errorHandler Error handler object
   * @param logger Logger object
   */
  constructor(pluginsManager, storeManager, errorHandler, logger) {
    this.pluginsManager = pluginsManager;
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.httpClient = new HttpClient(errorHandler, logger);
    this.storeManager = storeManager;
    this.onError = this.onError.bind(this);
  }
  /**
   * Initializes the event repository
   */
  init() {
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
      var _a, _b;
      if (state.nativeDestinations.clientDestinationsReady.value === true) {
        (_a = this.destinationsEventsQueue) === null || _a === void 0 ? void 0 : _a.start();
        (_b = this.dmtEventsQueue) === null || _b === void 0 ? void 0 : _b.start();
      }
    });
    // Start the queue processing only when the destinations are ready or hybrid mode destinations exist
    // However, events will be enqueued for now.
    // At the time of processing the events, the integrations config data from destinations
    // is merged into the event object
    let timeoutId;
    effect(() => {
      var _a, _b;
      const shouldBufferDpEvents =
        state.loadOptions.value.bufferDataPlaneEventsUntilReady === true &&
        state.nativeDestinations.clientDestinationsReady.value === false;
      const hybridDestExist = state.nativeDestinations.activeDestinations.value.some(dest =>
        isHybridModeDestination(dest),
      );
      if (
        (hybridDestExist === false || shouldBufferDpEvents === false) &&
        ((_a = this.dataplaneEventsQueue) === null || _a === void 0
          ? void 0
          : _a.scheduleTimeoutActive) !== true
      ) {
        globalThis.clearTimeout(timeoutId);
        (_b = this.dataplaneEventsQueue) === null || _b === void 0 ? void 0 : _b.start();
      }
    });
    // Force start the data plane events queue processing after a timeout
    if (state.loadOptions.value.bufferDataPlaneEventsUntilReady === true) {
      timeoutId = globalThis.setTimeout(() => {
        var _a, _b;
        if (
          ((_a = this.dataplaneEventsQueue) === null || _a === void 0
            ? void 0
            : _a.scheduleTimeoutActive) !== true
        ) {
          (_b = this.dataplaneEventsQueue) === null || _b === void 0 ? void 0 : _b.start();
        }
      }, state.loadOptions.value.dataPlaneEventsBufferTimeout);
    }
  }
  /**
   * Enqueues the event for processing
   * @param event RudderEvent object
   * @param callback API callback function
   */
  enqueue(event, callback) {
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
    try {
      // Using the event sent to the data plane queue here
      // to ensure the mutated (if any) event is sent to the callback
      callback === null || callback === void 0 ? void 0 : callback(dpQEvent);
    } catch (error) {
      this.onError(error, API_CALLBACK_INVOKE_ERROR);
    }
  }
  /**
   * Handles error
   * @param error The error object
   * @param customMessage a message
   * @param shouldAlwaysThrow if it should throw or use logger
   */
  onError(error, customMessage, shouldAlwaysThrow) {
    if (this.errorHandler) {
      this.errorHandler.onError(error, EVENT_REPOSITORY, customMessage, shouldAlwaysThrow);
    } else {
      throw error;
    }
  }
}
export { EventRepository };
