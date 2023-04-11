import { ApiCallback, ApiObject } from "@rudderstack/analytics-js/state/types";
import { IErrorHandler } from "../ErrorHandler/types";
import { ILogger } from "../Logger/types";
import { IEventsHandler } from "../StoreManager/types";

/**
 * A service to generate valid event payloads and queue them for processing
 */
class EventsHandler implements IEventsHandler {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  initialized = false;
  
  /**
   * @param errorHandler Error handler object
   * @param logger Logger object
   */
  constructor(errorHandler?: IErrorHandler, logger?: ILogger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.onError = this.onError.bind(this);
  }

  /**
   * Generate a 'track' event based on the user-input fields
   * @param event 
   * @param properties 
   * @param options 
   * @param callback 
   */
  processTrackEvent(event: string, properties: ApiObject, options: ApiObject, callback: ApiCallback): void {
    // TODO: Implement this
    this.logger?.info(event, properties, options, callback);
  }

  /**
   * 
   * @param category 
   * @param name 
   * @param properties 
   * @param options 
   * @param callback 
   */
  processPageEvent(category: string, name: string, properties: ApiObject, options: ApiObject, callback: ApiCallback): void {
    // TODO: Implement this
    this.logger?.info(category, name, properties, options, callback);
  }

  /**
   * 
   * @param userId 
   * @param traits 
   * @param options 
   * @param callback 
   */
  processIdentifyEvent(userId: string, traits: ApiObject, options: ApiObject, callback: ApiCallback): void {
    // TODO: Implement this
    this.logger?.info(userId, traits, options, callback);
  }

  /**
   * 
   * @param to 
   * @param from 
   * @param options 
   * @param callback 
   */
  processAliasEvent(to: string, from: string, options: ApiObject, callback: ApiCallback): void {
    // TODO: Implement this
    this.logger?.info(to, from, options, callback);
  }

  /**
   * 
   * @param groupId 
   * @param traits 
   * @param options 
   * @param callback 
   */
  processGroupEvent(groupId: string, traits: ApiObject, options: ApiObject, callback: ApiCallback): void {
    // TODO: Implement this
    this.logger?.info(groupId, traits, options, callback);
  }

  /**
   * Handles error
   * @param error The error object
   */
  onError(error: Error | unknown) {
    if (this.errorHandler) {
      this.errorHandler.onError(error, 'HttpClient');
    } else {
      throw error;
    }
  }
}

const defaultEventsHandler = new EventsHandler();

export { defaultEventsHandler };
