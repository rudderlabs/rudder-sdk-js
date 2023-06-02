import { state } from '@rudderstack/analytics-js/state';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { LifecycleStatus } from '@rudderstack/analytics-js/state/types';
import { IEventManager, APIEvent } from './types';
import { RudderEventFactory } from './RudderEventFactory';
import { IEventRepository } from '../eventRepository/types';
import { IUserSessionManager } from '../userSessionManager/types';

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
    state.lifecycle.status.value = LifecycleStatus.Initialized;
    this.logger?.info('Event manager initialized');
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
      this.onError('Unable to generate RudderStack event object');
    }
  }

  /**
   * Handles error
   * @param error The error object
   */
  onError(error: unknown, customMessage?: string, shouldAlwaysThrow?: boolean): void {
    if (this.errorHandler) {
      this.errorHandler.onError(error, 'Event Manager', customMessage, shouldAlwaysThrow);
    } else {
      throw error;
    }
  }
}

export { EventManager };
