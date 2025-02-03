import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { APIEvent } from '@rudderstack/analytics-js-common/types/EventApi';
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
  errorHandler: IErrorHandler;
  logger: ILogger;
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
    errorHandler: IErrorHandler,
    logger: ILogger,
  ) {
    this.eventRepository = eventRepository;
    this.userSessionManager = userSessionManager;
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.eventFactory = new RudderEventFactory(this.logger);
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
    this.eventRepository.enqueue(rudderEvent, event.callback);
  }
}

export { EventManager };
