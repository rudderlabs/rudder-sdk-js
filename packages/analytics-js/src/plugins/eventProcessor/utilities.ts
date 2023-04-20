import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import { state } from '@rudderstack/analytics-js/state';
import {
  RudderContext,
  RudderEvent,
} from '@rudderstack/analytics-js/components/eventManager/types';
import { isObject, mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { Nullable } from '@rudderstack/analytics-js/types';
import { CONTEXT_RESERVED_ELEMENTS, RESERVED_ELEMENTS, TOP_LEVEL_ELEMENTS } from './constants';

/**
 * Utility to check for reserved keys in the input object
 * @param obj Generic object
 * @param eventType Rudder event type
 * @param parentKeyPath Object's parent key path
 */
export const checkForReservedElementsInObject = (
  obj: Nullable<ApiObject> | RudderContext | undefined,
  eventType: string,
  parentKeyPath: string,
  logger?: ILogger,
): void => {
  if (isObject(obj)) {
    Object.keys(obj as object).forEach(property => {
      if (RESERVED_ELEMENTS.includes(property.toLowerCase())) {
        logger?.warn(
          `Reserved keyword used in ${parentKeyPath} --> "${property}" for ${eventType} event`,
        );
      }
    });
  }
};

/**
 * Checks for reserved keys in traits, properties, and contextual traits
 * @param rudderEvent Generated rudder event
 */
export const checkForReservedElements = (rudderEvent: RudderEvent, logger?: ILogger): void => {
  //  properties, traits, contextualTraits are either undefined or object
  const { properties, traits, context } = rudderEvent;
  const { traits: contextualTraits } = context;

  checkForReservedElementsInObject(properties, rudderEvent.type, 'properties', logger);
  checkForReservedElementsInObject(traits, rudderEvent.type, 'traits', logger);
  checkForReservedElementsInObject(contextualTraits, rudderEvent.type, 'context.traits', logger);
};

/**
 * To get the page properties for context object
 * @param pageProps Page properties
 * @returns page properties object for context
 */
export const getContextPageProperties = (pageProps?: ApiObject): ApiObject => {
  const ctxPageProps: ApiObject = {};
  Object.keys(state.page).forEach((key: string) => {
    ctxPageProps[key] = pageProps?.[key] || state.page[key].value;
  });
  return ctxPageProps;
};

/**
 * Overrides the top-level event properties with data from API options
 * @param rudderEvent Generated rudder event
 * @param options API options
 */
export const updateTopLevelEventElements = (
  rudderEvent: RudderEvent,
  options: ApiOptions,
): void => {
  if (options.anonymousId && typeof options.anonymousId === 'string')
    rudderEvent.anonymousId = options.anonymousId;
  if (options.integrations && isObject(options.integrations))
    rudderEvent.integrations = options.integrations;
  if (options.originalTimestamp && typeof options.originalTimestamp === 'string')
    rudderEvent.originalTimestamp = options.originalTimestamp;
};

/**
 * To merge the contextual information in API options with existing data
 * @param rudderEvent Generated rudder event
 * @param options API options
 */
export const getMergedContext = (
  rudderContext: RudderContext,
  options: ApiOptions,
  logger?: ILogger,
): RudderContext => {
  let context = rudderContext;
  Object.keys(options).forEach(key => {
    if (!TOP_LEVEL_ELEMENTS.includes(key) && !CONTEXT_RESERVED_ELEMENTS.includes(key)) {
      if (key !== 'context') {
        context = mergeDeepRight(context, {
          [key]: options[key],
        });
      } else if (options[key] && typeof options[key] === 'object' && options[key] !== null) {
        const tempContext: Record<string, any> = {};
        Object.keys(options[key] as Record<string, any>).forEach(e => {
          if (!CONTEXT_RESERVED_ELEMENTS.includes(e)) {
            tempContext[e] = (options[key] as Record<string, any>)[e];
          }
        });
        context = mergeDeepRight(context, {
          ...tempContext,
        });
      } else {
        logger?.warn('The "context" element passed in the options is not a valid object');
      }
    }
  });
  return context;
};

/**
 * Updates rudder event object with data from the API options
 * @param rudderEvent Generated rudder event
 * @param options API options
 */
export const processOptions = (rudderEvent: RudderEvent, options?: Nullable<ApiOptions>): void => {
  // Only allow object type for options
  if (options && isObject(options)) {
    updateTopLevelEventElements(rudderEvent, options);
    rudderEvent.context = getMergedContext(rudderEvent.context, options);
  }
};
