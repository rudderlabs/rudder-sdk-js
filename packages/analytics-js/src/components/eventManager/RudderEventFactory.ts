import { Nullable } from '@rudderstack/analytics-js/types';
import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { APIEvent, RudderEvent, RudderEventType } from './types';
import { getEnrichedEvent, getUpdatedPageProperties } from './utilities';

class RudderEventFactory {
  logger?: ILogger;

  constructor(logger?: ILogger) {
    this.logger = logger;
  }

  /**
   * Generate a 'page' event based on the user-input fields
   * @param category Page's category
   * @param name Page name
   * @param properties Page properties
   * @param options API options
   */
  generatePageEvent(
    category?: Nullable<string>,
    name?: Nullable<string>,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
  ): RudderEvent {
    let props = properties ?? {};

    props.name = name;
    props.category = category;

    props = getUpdatedPageProperties(props, options);

    const pageEvent: Partial<RudderEvent> = {
      properties: props,
      name,
      category,
      type: RudderEventType.Page,
    };

    return getEnrichedEvent(pageEvent, options, props, this.logger);
  }

  /**
   * Generate a 'track' event based on the user-input fields
   * @param event The event name
   * @param properties Event properties
   * @param options API options
   */
  generateTrackEvent(
    event: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
  ): RudderEvent {
    const trackEvent: Partial<RudderEvent> = {
      properties,
      event,
      type: RudderEventType.Track,
    };

    return getEnrichedEvent(trackEvent, options, undefined, this.logger);
  }

  /**
   * Generate an 'identify' event based on the user-input fields
   * @param options API options
   */
  generateIdentifyEvent(options?: Nullable<ApiOptions>): RudderEvent {
    const identifyEvent: Partial<RudderEvent> = {
      type: RudderEventType.Identify,
    };

    return getEnrichedEvent(identifyEvent, options, undefined, this.logger);
  }

  /**
   * Generate an 'alias' event based on the user-input fields
   * @param to New user ID
   * @param from Old user ID
   * @param options API options
   */
  generateAliasEvent(
    to: Nullable<string>,
    from?: string,
    options?: Nullable<ApiOptions>,
  ): RudderEvent {
    const aliasEvent: Partial<RudderEvent> = {
      previousId: from,
      type: RudderEventType.Alias,
    };

    const enrichedEvent = getEnrichedEvent(aliasEvent, options, undefined, this.logger);
    // override the User ID from the API inputs
    enrichedEvent.userId = to ?? enrichedEvent.userId;
    return enrichedEvent;
  }

  /**
   * Generate a 'group' event based on the user-input fields
   * @param options API options
   */
  generateGroupEvent(options?: Nullable<ApiOptions>): RudderEvent {
    const groupEvent: Partial<RudderEvent> = {
      type: RudderEventType.Group,
    };

    return getEnrichedEvent(groupEvent, options, undefined, this.logger);
  }

  /**
   * Generates a new RudderEvent object based on the user-input fields
   * @param event API event parameters object
   * @returns A RudderEvent object
   */
  create(event: APIEvent): RudderEvent | undefined {
    let eventObj: RudderEvent | undefined;
    switch (event.type) {
      case RudderEventType.Page:
        eventObj = this.generatePageEvent(
          event.category,
          event.name,
          event.properties,
          event.options,
        );
        break;
      case RudderEventType.Track:
        eventObj = this.generateTrackEvent(event.name as string, event.properties, event.options);
        break;
      case RudderEventType.Identify:
        eventObj = this.generateIdentifyEvent(event.options);
        break;
      case RudderEventType.Alias:
        eventObj = this.generateAliasEvent(event.to as Nullable<string>, event.from, event.options);
        break;
      case RudderEventType.Group:
        eventObj = this.generateGroupEvent(event.options);
        break;
      default:
        // Do nothing
        break;
    }
    return eventObj;
  }
}

export { RudderEventFactory };
