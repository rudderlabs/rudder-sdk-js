import { ApiCallback } from '@rudderstack/analytics-js/state/types';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { state } from '@rudderstack/analytics-js/state';
import { clone } from 'ramda';
import { HttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { IHttpClient } from '@rudderstack/analytics-js/services/HttpClient/types';
import { IEventRepository } from './types';
import { IPluginsManager } from '../pluginsManager/types';
import { RudderEvent } from '../eventManager/types';
import {
  DATA_PLANE_QUEUE_EXT_POINT_PREFIX,
  DESTINATIONS_QUEUE_EXT_POINT_PREFIX,
} from './constants';

/**
 * Event repository class responsible for queuing events for further processing and delivery
 */
class EventRepository implements IEventRepository {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  pluginsManager: IPluginsManager;
  httpClient: IHttpClient;
  dataplaneEventsQueue: any;
  destinationsEventsQueue: any;

  /**
   *
   * @param pluginsManager Plugins manager instance
   * @param errorHandler Error handler object
   * @param logger Logger object
   */
  constructor(pluginsManager: IPluginsManager, errorHandler?: IErrorHandler, logger?: ILogger) {
    this.pluginsManager = pluginsManager;
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.httpClient = new HttpClient(errorHandler, logger);
    this.onError = this.onError.bind(this);
  }

  /**
   * Initializes the event repository
   */
  init(): void {
    this.dataplaneEventsQueue = this.pluginsManager.invokeSingle(
      `${DATA_PLANE_QUEUE_EXT_POINT_PREFIX}.init`,
      state,
      this.httpClient,
      this.errorHandler,
      this.logger,
    );

    this.destinationsEventsQueue = this.pluginsManager.invokeSingle(
      `${DESTINATIONS_QUEUE_EXT_POINT_PREFIX}.init`,
      state,
      this.errorHandler,
      this.logger,
    );
  }

  /**
   * Enqueues the event for processing
   * @param event RudderEvent object
   * @param callback API callback function
   */
  enqueue(event: RudderEvent, callback?: ApiCallback): void {
    const dpQEvent = clone(event);
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
      callback?.(dpQEvent);
    } catch (error) {
      this.onError(error, 'API Callback Invocation Failed');
    }
  }

  /**
   * Handles error
   * @param error The error object
   * @param customMessage a message
   * @param shouldAlwaysThrow if it should throw or use logger
   */
  onError(error: unknown, customMessage?: string, shouldAlwaysThrow?: boolean): void {
    if (this.errorHandler) {
      this.errorHandler.onError(error, 'Event Repository', customMessage, shouldAlwaysThrow);
    } else {
      throw error;
    }
  }
}

export { EventRepository };
