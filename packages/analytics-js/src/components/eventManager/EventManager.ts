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
  private_eventRepository: IEventRepository;
  private_userSessionManager: IUserSessionManager;
  private_errorHandler?: IErrorHandler;
  private_logger?: ILogger;
  private_eventFactory: RudderEventFactory;

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
    this.private_eventRepository = eventRepository;
    this.private_userSessionManager = userSessionManager;
    this.private_errorHandler = errorHandler;
    this.private_logger = logger;
    this.private_eventFactory = new RudderEventFactory(this.private_logger);
    this.private_onError = this.private_onError.bind(this);
  }

  /**
   * Initializes the event manager
   */
  init() {
    this.private_eventRepository.init();
  }

  resume() {
    this.private_eventRepository.resume();
  }

  /**
   * Consumes a new incoming event
   * @param event Incoming event data
   */
  addEvent(event: APIEvent) {
    this.private_userSessionManager.refreshSession();
    const rudderEvent = this.private_eventFactory.create(event);
    if (rudderEvent) {
      this.private_eventRepository.enqueue(rudderEvent, event.callback);
    } else {
      this.private_onError(new Error(EVENT_OBJECT_GENERATION_ERROR));
    }
  }

  /**
   * Handles error
   * @param error The error object
   */
  private_onError(error: any, customMessage?: string, shouldAlwaysThrow?: boolean): void {
    if (this.private_errorHandler) {
      this.private_errorHandler.onError(error, EVENT_MANAGER, customMessage, shouldAlwaysThrow);
    } else {
      throw error;
    }
  }
}

export { EventManager };
