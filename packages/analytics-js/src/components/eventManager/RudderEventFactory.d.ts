import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { APIEvent, ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
declare class RudderEventFactory {
  logger?: ILogger;
  constructor(logger?: ILogger);
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
  ): RudderEvent;
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
  ): RudderEvent;
  /**
   * Generate an 'identify' event based on the user-input fields
   * @param userId New user ID
   * @param traits new traits
   * @param options API options
   */
  generateIdentifyEvent(
    userId?: Nullable<string>,
    traits?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
  ): RudderEvent;
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
  ): RudderEvent;
  /**
   * Generate a 'group' event based on the user-input fields
   * @param groupId New group ID
   * @param traits new group traits
   * @param options API options
   */
  generateGroupEvent(
    groupId?: Nullable<string>,
    traits?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
  ): RudderEvent;
  /**
   * Generates a new RudderEvent object based on the user-input fields
   * @param event API event parameters object
   * @returns A RudderEvent object
   */
  create(event: APIEvent): RudderEvent | undefined;
}
export { RudderEventFactory };
