import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { APIEvent } from '@rudderstack/analytics-js-common/types/EventApi';
import { EVENT_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { EVENT_OBJECT_GENERATION_ERROR } from '../../constants/logMessages';
import type { IEventManager } from './types';
import { RudderEventFactory } from './RudderEventFactory';
import type { IEventRepository } from '../eventRepository/types';
import type { IUserSessionManager } from '../userSessionManager/types';

/**
 * A service to generate valid event payloads and queue them for processing
 */
class EventManager implements IEventManager {
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
  ) {
    this.eventRepository = eventRepository;
    this.userSessionManager = userSessionManager;
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.eventFactory = new RudderEventFactory(this.logger);
    this.onError = this.onError.bind(this);
  }

  /**
   * Initializes the event manager
   */
  init() {
    this.eventRepository.init();
  }

  resume() {
    this.eventRepository.resume();
  }

  /**
   * Consumes a new incoming event
   * @param event Incoming event data
   */
  addEvent(event: APIEvent) {
    this.userSessionManager.refreshSession();
    const rudderEvent = this.eventFactory.create(event);
    if (rudderEvent) {
      this.eventRepository.enqueue(rudderEvent, event.callback);
    } else {
      this.onError(new Error(EVENT_OBJECT_GENERATION_ERROR));
    }
  }

  /**
   * Handles error
   * @param error The error object
   */
  onError(error: unknown, customMessage?: string, shouldAlwaysThrow?: boolean): void {
    if (this.errorHandler) {
      this.errorHandler.onError(error, EVENT_MANAGER, customMessage, shouldAlwaysThrow);
    } else {
      throw error;
    }
  }
}

export { EventManager };
