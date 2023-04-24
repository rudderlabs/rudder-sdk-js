import { Nullable } from '@rudderstack/analytics-js/types';
import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import { APIEvent, RudderEvent, RudderEventType } from './types';
import { getEnrichedEvent, getUpdatedPageProperties } from './utilities';
import { tryStringify } from '../utilities/string';
import { defaultUserSessionManager } from '../userSessionManager';

class RudderEventFactory {
  /**
   * Generate a 'page' event based on the user-input fields
   * @param category Page's category
   * @param name Page name
   * @param properties Page properties
   * @param options API options
   */
  private static generatePageEvent(
    category?: Nullable<string>,
    name?: Nullable<string>,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
  ): RudderEvent {
    let props = properties || {};

    props.name = name;
    props.category = category;

    props = getUpdatedPageProperties(props, options);

    const pageEvent: Partial<RudderEvent> = {
      properties: props,
      name,
      category,
      type: RudderEventType.Page,
    };

    return getEnrichedEvent(pageEvent, options, props);
  }

  /**
   * Generate a 'track' event based on the user-input fields
   * @param event The event name
   * @param properties Event properties
   * @param options API options
   */
  private static generateTrackEvent(
    event: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
  ): RudderEvent {
    const trackEvent: Partial<RudderEvent> = {
      properties,
      event,
      type: RudderEventType.Track,
    };

    return getEnrichedEvent(trackEvent, options);
  }

  /**
   * Generate an 'identify' event based on the user-input fields
   * @param options API options
   */
  private static generateIdentifyEvent(options?: Nullable<ApiOptions>): RudderEvent {
    const identifyEvent: Partial<RudderEvent> = {
      type: RudderEventType.Identify,
    };

    return getEnrichedEvent(identifyEvent, options);
  }

  /**
   * Generate an 'alias' event based on the user-input fields
   * @param to New user ID
   * @param from Old user ID
   * @param options API options
   */
  private static generateAliasEvent(
    to: string,
    from?: Nullable<string>,
    options?: Nullable<ApiOptions>,
  ): RudderEvent {
    const previousId =
      tryStringify(from) ||
      defaultUserSessionManager.getUserId() ||
      defaultUserSessionManager.getAnonymousId();

    // Set the new user ID only after determining the previous ID
    defaultUserSessionManager.setUserId(tryStringify(to));

    const aliasEvent: Partial<RudderEvent> = {
      previousId,
      type: RudderEventType.Alias,
    };

    return getEnrichedEvent(aliasEvent, options);
  }

  /**
   * Generate a 'group' event based on the user-input fields
   * @param options API options
   */
  private static generateGroupEvent(options?: Nullable<ApiOptions>): RudderEvent {
    const groupEvent: Partial<RudderEvent> = {
      type: RudderEventType.Group,
    };

    return getEnrichedEvent(groupEvent, options);
  }

  /**
   * Generates a new RudderEvent object based on the user-input fields
   * @param event API event parameters object
   * @returns A RudderEvent object
   */
  static create(event: APIEvent): RudderEvent | undefined {
    let eventObj: RudderEvent | undefined;
    switch (event.type) {
      case RudderEventType.Page:
        eventObj = RudderEventFactory.generatePageEvent(
          event.category,
          event.name,
          event.properties,
          event.options,
        );
        break;
      case RudderEventType.Track:
        eventObj = RudderEventFactory.generateTrackEvent(
          event.name as string,
          event.properties,
          event.options,
        );
        break;
      case RudderEventType.Identify:
        eventObj = RudderEventFactory.generateIdentifyEvent(event.options);
        break;
      case RudderEventType.Alias:
        eventObj = RudderEventFactory.generateAliasEvent(
          event.to as string,
          event.from,
          event.options,
        );
        break;
      case RudderEventType.Group:
        eventObj = RudderEventFactory.generateGroupEvent(event.options);
        break;
      default:
        // Do nothing
        break;
    }
    return eventObj;
  }
}

export { RudderEventFactory };
