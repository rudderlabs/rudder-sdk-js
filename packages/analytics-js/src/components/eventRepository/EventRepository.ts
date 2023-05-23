import { ApiCallback } from '@rudderstack/analytics-js/state/types';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { state } from '@rudderstack/analytics-js/state';
import { clone } from 'ramda';
import { IEventRepository } from './types';
import { IPluginsManager } from '../pluginsManager/types';
import { RudderEvent } from '../eventManager/types';
import { defaultPluginsManager } from '../pluginsManager';
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
    this.onError = this.onError.bind(this);

    this.dataplaneEventsQueue = this.pluginsManager.invokeSingle(
      `${DATA_PLANE_QUEUE_EXT_POINT_PREFIX}.init`,
      state,
      errorHandler,
      logger,
    );

    this.destinationsEventsQueue = this.pluginsManager.invokeSingle(
      `${DESTINATIONS_QUEUE_EXT_POINT_PREFIX}.init`,
      state,
      errorHandler,
      logger,
    );
  }

  /**
   * Initializes the event repository
   */
  init(): void {
    this.pluginsManager.invokeSingle(
      `${DATA_PLANE_QUEUE_EXT_POINT_PREFIX}.start`,
      this.dataplaneEventsQueue,
      this.errorHandler,
      this.logger,
    );
    this.pluginsManager.invokeSingle(
      `${DESTINATIONS_QUEUE_EXT_POINT_PREFIX}.start`,
      this.destinationsEventsQueue,
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
      callback?.(event);
    } catch (error) {
      this.onError(error, 'API Callback Invocation Failed');
    }
  }

  /**
   * Handles error
   * @param error The error object
   */
  onError(error: unknown, customMessage?: string, shouldAlwaysThrow?: boolean): void {
    if (this.errorHandler) {
      this.errorHandler.onError(error, 'Event Repository', customMessage, shouldAlwaysThrow);
    } else {
      throw error;
    }
  }
}

const defaultEventRepository = new EventRepository(
  defaultPluginsManager,
  defaultErrorHandler,
  defaultLogger,
);

export { defaultEventRepository, EventRepository };
