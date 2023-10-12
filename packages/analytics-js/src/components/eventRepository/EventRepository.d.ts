import { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ApiCallback } from '@rudderstack/analytics-js-common/types/EventApi';
import { IEventRepository } from './types';
/**
 * Event repository class responsible for queuing events for further processing and delivery
 */
declare class EventRepository implements IEventRepository {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
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
    errorHandler?: IErrorHandler,
    logger?: ILogger,
  );
  /**
   * Initializes the event repository
   */
  init(): void;
  /**
   * Enqueues the event for processing
   * @param event RudderEvent object
   * @param callback API callback function
   */
  enqueue(event: RudderEvent, callback?: ApiCallback): void;
  /**
   * Handles error
   * @param error The error object
   * @param customMessage a message
   * @param shouldAlwaysThrow if it should throw or use logger
   */
  onError(error: unknown, customMessage?: string, shouldAlwaysThrow?: boolean): void;
}
export { EventRepository };
