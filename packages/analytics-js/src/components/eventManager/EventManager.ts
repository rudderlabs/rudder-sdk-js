import { state } from '@rudderstack/analytics-js/state';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { IEventManager, APIEvent } from './types';
import {
  checkForReservedElements,
  processOptions,
} from './utilities';
import { RudderEventFactory } from './RudderEventFactory';

/**
 * A service to generate valid event payloads and queue them for processing
 */
class EventManager implements IEventManager {
  errorHandler?: IErrorHandler;
  logger?: ILogger;

  /**
   * @param errorHandler Error handler object
   * @param logger Logger object
   */
  constructor(errorHandler?: IErrorHandler, logger?: ILogger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.onError = this.onError.bind(this);
  }

  init() {
    // TODO: status.value = 'initialized';
    //  once eventManager event repository is ready in order to start enqueueing any events
    state.lifecycle.status.value = 'initialized';
    this.logger?.info("Event manager initialized");
  }

  /**
   * Consumes a new incoming event
   * @param event Incoming event data
   */
  addEvent(event: APIEvent) {
    const rudderEvent = RudderEventFactory.create(event);
    if (rudderEvent) {
      processOptions(rudderEvent, event.options);
      checkForReservedElements(rudderEvent, this.logger);

      // TODO: Add the event and callback to the event repository
    } else {
      this.onError("Unable to generate RudderStack event object");
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

const defaultEventManager = new EventManager(defaultErrorHandler, defaultLogger);

export { EventManager, defaultEventManager };
