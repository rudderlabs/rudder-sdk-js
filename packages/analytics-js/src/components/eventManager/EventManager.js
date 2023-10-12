import { EVENT_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { EVENT_OBJECT_GENERATION_ERROR } from '../../constants/logMessages';
import { RudderEventFactory } from './RudderEventFactory';
/**
 * A service to generate valid event payloads and queue them for processing
 */
class EventManager {
  /**
   *
   * @param eventRepository Event repository instance
   * @param userSessionManager UserSession Manager instance
   * @param errorHandler Error handler object
   * @param logger Logger object
   */
  constructor(eventRepository, userSessionManager, errorHandler, logger) {
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
  /**
   * Consumes a new incoming event
   * @param event Incoming event data
   */
  addEvent(event) {
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
  onError(error, customMessage, shouldAlwaysThrow) {
    if (this.errorHandler) {
      this.errorHandler.onError(error, EVENT_MANAGER, customMessage, shouldAlwaysThrow);
    } else {
      throw error;
    }
  }
}
export { EventManager };
