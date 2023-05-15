import { state } from '@rudderstack/analytics-js/state';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { LifecycleStatus } from '@rudderstack/analytics-js/state/types';
import { IEventManager, APIEvent } from './types';
import { RudderEventFactory } from './RudderEventFactory';
import { IEventRepository } from '../eventRepository/types';
import { defaultEventRepository } from '../eventRepository';

/**
 * A service to generate valid event payloads and queue them for processing
 */
class EventManager implements IEventManager {
  eventRepository: IEventRepository;
  errorHandler?: IErrorHandler;
  logger?: ILogger;

  /**
   * 
   * @param eventRepository Event repository instance
   * @param errorHandler Error handler object
   * @param logger Logger object
   */
  constructor(eventRepository: IEventRepository, errorHandler?: IErrorHandler, logger?: ILogger) {
    this.eventRepository = eventRepository;
    this.errorHandler = errorHandler;
    this.logger = logger;
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
    const rudderEvent = RudderEventFactory.create(event);
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
  onError(error: Error | unknown): void {
    if (this.errorHandler) {
      this.errorHandler.onError(error, 'EventManager');
    } else {
      throw error;
    }
  }
}

const defaultEventManager = new EventManager(
  defaultEventRepository,
  defaultErrorHandler,
  defaultLogger,
);

export { EventManager, defaultEventManager };
