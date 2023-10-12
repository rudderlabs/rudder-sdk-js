import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { APIEvent } from '@rudderstack/analytics-js-common/types/EventApi';
import { IEventManager } from './types';
import { RudderEventFactory } from './RudderEventFactory';
import { IEventRepository } from '../eventRepository/types';
import { IUserSessionManager } from '../userSessionManager/types';
/**
 * A service to generate valid event payloads and queue them for processing
 */
declare class EventManager implements IEventManager {
  eventRepository: IEventRepository;
  userSessionManager: IUserSessionManager;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  eventFactory: RudderEventFactory;
  /**
   *
   * @param eventRepository Event repository instance
   * @param userSessionManager UserSession Manager instance
   * @param errorHandler Error handler object
   * @param logger Logger object
   */
  constructor(
    eventRepository: IEventRepository,
    userSessionManager: IUserSessionManager,
    errorHandler?: IErrorHandler,
    logger?: ILogger,
  );
  /**
   * Initializes the event manager
   */
  init(): void;
  /**
   * Consumes a new incoming event
   * @param event Incoming event data
   */
  addEvent(event: APIEvent): void;
  /**
   * Handles error
   * @param error The error object
   */
  onError(error: unknown, customMessage?: string, shouldAlwaysThrow?: boolean): void;
}
export { EventManager };
