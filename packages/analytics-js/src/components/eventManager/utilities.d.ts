import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
import { RudderContext, RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
/**
 * To get the page properties for context object
 * @param pageProps Page properties
 * @returns page properties object for context
 */
declare const getContextPageProperties: (pageProps?: ApiObject) => ApiObject;
/**
 * Add any missing default page properties using values from options and defaults
 * @param properties Input page properties
 * @param options API options
 */
declare const getUpdatedPageProperties: (
  properties: ApiObject,
  options?: Nullable<ApiOptions>,
) => ApiObject;
/**
 * Utility to check for reserved keys in the input object
 * @param obj Generic object
 * @param parentKeyPath Object's parent key path
 * @param logger Logger instance
 */
declare const checkForReservedElementsInObject: (
  obj: Nullable<ApiObject> | RudderContext | undefined,
  parentKeyPath: string,
  logger?: ILogger,
) => void;
/**
 * Checks for reserved keys in traits, properties, and contextual traits
 * @param rudderEvent Generated rudder event
 * @param logger Logger instance
 */
declare const checkForReservedElements: (rudderEvent: RudderEvent, logger?: ILogger) => void;
/**
 * Overrides the top-level event properties with data from API options
 * @param rudderEvent Generated rudder event
 * @param options API options
 */
declare const updateTopLevelEventElements: (rudderEvent: RudderEvent, options: ApiOptions) => void;
/**
 * To merge the contextual information in API options with existing data
 * @param rudderContext Generated rudder event
 * @param options API options
 * @param logger Logger instance
 */
declare const getMergedContext: (
  rudderContext: RudderContext,
  options: ApiOptions,
  logger?: ILogger,
) => RudderContext;
/**
 * Updates rudder event object with data from the API options
 * @param rudderEvent Generated rudder event
 * @param options API options
 */
declare const processOptions: (rudderEvent: RudderEvent, options?: Nullable<ApiOptions>) => void;
/**
 * Enrich the base event object with data from state and the API options
 * @param rudderEvent RudderEvent object
 * @param options API options
 * @param pageProps Page properties
 * @param logger logger
 * @returns Enriched RudderEvent object
 */
declare const getEnrichedEvent: (
  rudderEvent: Partial<RudderEvent>,
  options?: Nullable<ApiOptions>,
  pageProps?: ApiObject,
  logger?: ILogger,
) => RudderEvent;
export {
  getUpdatedPageProperties,
  getEnrichedEvent,
  checkForReservedElements,
  checkForReservedElementsInObject,
  updateTopLevelEventElements,
  getContextPageProperties,
  getMergedContext,
  processOptions,
};
