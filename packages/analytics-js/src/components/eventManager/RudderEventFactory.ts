import { Nullable } from '@rudderstack/analytics-js/types';
import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import * as R from 'ramda';
import { APIEvent, RudderEvent, RudderEventType } from './types';
import { getCommonEventData, getUpdatedPageProperties } from './utilities';
import { tryStringify } from '../utilities/string';
import { defaultUserSessionManager } from '../userSessionManager';

class RudderEventFactory {
  /**
   * Generate a 'page' event based on the user-input fields
   * @param category Page's category
   * @param name Page name
   * @param properties Page properties
   * @param options API options
   * @param callback Callback function
   */
  private static generatePageEvent(
    category?: Nullable<string>,
    name?: Nullable<string>,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
  ): RudderEvent {
    let props = R.clone(properties) || {};
    const opts = R.clone(options);

    props.name = name;
    props.category = category;

    props = getUpdatedPageProperties(props, opts);

    const pageEvent: Partial<RudderEvent> = {
      properties: props,
      name,
      category,
      type: RudderEventType.PAGE,
      ...getCommonEventData(props),
    };
    return pageEvent as RudderEvent;
  }

  /**
   * Generate a 'track' event based on the user-input fields
   * @param event The event name
   * @param properties Event properties
   * @param options API options
   */
  private static generateTrackEvent(event: string, properties?: Nullable<ApiObject>): RudderEvent {
    const props = R.clone(properties);
    const trackEvent: Partial<RudderEvent> = {
      properties: props,
      event,
      type: RudderEventType.TRACK,
      ...getCommonEventData(),
    };
    return trackEvent as RudderEvent;
  }

  /**
   * Generate an 'identify' event based on the user-input fields
   * @param userId New user ID
   * @param traits User traits
   */
  private static generateIdentifyEvent(): RudderEvent {
    const identifyEvent: Partial<RudderEvent> = {
      type: RudderEventType.IDENTIFY,
      ...getCommonEventData(),
    };
    return identifyEvent as RudderEvent;
  }

  /**
   * Generate an 'alias' event based on the user-input fields
   * @param to New user ID
   * @param from Old user ID
   */
  private static generateAliasEvent(to: string, from?: Nullable<string>): RudderEvent {
    const previousId =
      tryStringify(from) ||
      defaultUserSessionManager.getUserId() ||
      defaultUserSessionManager.getAnonymousId();

    // Set the new user ID only after determining the previous ID
    defaultUserSessionManager.setUserId(tryStringify(to));

    const aliasEvent: Partial<RudderEvent> = {
      previousId,
      type: RudderEventType.ALIAS,
      ...getCommonEventData(),
    };
    return aliasEvent as RudderEvent;
  }

  /**
   * Generate a 'group' event based on the user-input fields
   * @param groupId Group ID
   * @param traits Group traits
   * @param options API options
   * @param callback Callback function
   */
  private static generateGroupEvent(): RudderEvent {
    const groupEvent: Partial<RudderEvent> = {
      type: RudderEventType.GROUP,
      ...getCommonEventData(),
    };
    return groupEvent as RudderEvent;
  }

  static create(event: APIEvent): RudderEvent | undefined {
    let eventObj: RudderEvent | undefined;
    switch (event.type) {
      case RudderEventType.PAGE:
        eventObj = RudderEventFactory.generatePageEvent(
          event.category,
          event.name,
          event.properties,
          event.options,
        );
        break;
      case RudderEventType.TRACK:
        eventObj = RudderEventFactory.generateTrackEvent(event.name as string, event.properties);
        break;
      case RudderEventType.IDENTIFY:
        eventObj = RudderEventFactory.generateIdentifyEvent();
        break;
      case RudderEventType.ALIAS:
        eventObj = RudderEventFactory.generateAliasEvent(event.to as string, event.from);
        break;
      case RudderEventType.GROUP:
        eventObj = RudderEventFactory.generateGroupEvent();
        break;
      default:
        // Do nothing
        break;
    }
    return eventObj;
  }
}

export { RudderEventFactory };
