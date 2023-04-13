import { ApiObject, ApiOptions } from "@rudderstack/analytics-js/state/types";
import { ILogger } from "@rudderstack/analytics-js/services/Logger/types";
import { Nullable } from "@rudderstack/analytics-js/types";
import { pageParametersState } from "@rudderstack/analytics-js/state/slices/page";
import { sessionState } from "@rudderstack/analytics-js/state/slices/session";
import { RudderContext, RudderEvent } from "./types";
import { RESERVED_ELEMENTS, SYSTEM_KEYWORDS, TOP_LEVEL_ELEMENTS } from "./constants";
import { isObject, mergeDeepRight } from '../utilities/object';


/**
 * Overrides the top-level event properties with data from API options
 * @param rudderEvent Generated rudder event
 * @param options API options
 */
export const updateTopLevelEventElements = (rudderEvent: RudderEvent, options: ApiOptions): void => {
  if (options.anonymousId)
    rudderEvent.anonymousId = options.anonymousId;
  if (options.integrations)
    rudderEvent.integrations = options.integrations;
  if (options.originalTimestamp)
    rudderEvent.originalTimestamp = options.originalTimestamp;
};

/**
 * To merge the contextual information in API options with existing data
 * @param rudderEvent Generated rudder event
 * @param options API options
 */
export const getMergedContext = (rudderContext: RudderContext, options: ApiOptions, logger?: ILogger): RudderContext => {
  let context = rudderContext;
  Object.keys(options).forEach(key => {
    if (!TOP_LEVEL_ELEMENTS.includes(key) && !SYSTEM_KEYWORDS.includes(key)) {
      if (key !== 'context') {
        context = mergeDeepRight(context, {
          [key]: options[key],
        });
      } else if (typeof options[key] === 'object' && options[key] !== null) {
        const tempContext: Record<string, any> = {};
        Object.keys(options[key] as Record<string, any>).forEach(e => {
          if (!SYSTEM_KEYWORDS.includes(e)) {
            tempContext[e] = (options[key] as Record<string, any>)[e];
          }
        });
        context = mergeDeepRight(context, {
          ...tempContext,
        });
      } else {
        logger?.error(
          `[Analytics: processOptionsParam] context passed in options "${key}" is not an object`,
        );
      }
    }
  });
  return rudderContext;
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


/**
 * Utility to check for reserved keys in the input object
 * @param obj Generic object
 * @param eventType Rudder event type
 * @param parentKeyPath Object's parent key path
 */
export const checkForReservedElementsInObject = (
  obj: ApiObject | RudderContext | undefined,
  eventType: string,
  parentKeyPath: string,
  logger?: ILogger
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
 * Add any missing default page properties using values from options and defaults
 * @param properties Input page properties
 * @param options API options
 */
export const getUpdatedPageProperties = (properties: ApiObject, options?: Nullable<ApiOptions>): ApiObject => {
  if (!options?.page || !isObject(options.page))
    return properties;

  const optionsPageProps = options.page as ApiObject;
  const pageProps = properties;
  if (pageProps.path === undefined) {
    pageProps.path = optionsPageProps.path || pageParametersState.path.value;
  }

  if (pageProps.referrer === undefined) {
    pageProps.referrer = optionsPageProps.referrer || pageParametersState.referrer.value;
  }

  if (pageProps.referring_domain === undefined) {
    pageProps.referring_domain =
      optionsPageProps.referring_domain || pageParametersState.referring_domain.value;
  }

  if (pageProps.search === undefined) {
    pageProps.search = optionsPageProps.search || pageParametersState.search.value;
  }

  if (pageProps.search === undefined) {
    pageProps.search = optionsPageProps.search || pageParametersState.search.value;
  }

  if (pageProps.title === undefined) {
    pageProps.title = optionsPageProps.title || pageParametersState.title.value;
  }

  if (pageProps.url === undefined) {
    pageProps.url = optionsPageProps.url || pageParametersState.url.value;
  }

  if (pageProps.tab_url === undefined) {
    pageProps.tab_url = optionsPageProps.tab_url || pageParametersState.tab_url.value;
  }

  if (pageProps.initial_referrer === undefined) {
    pageProps.initial_referrer =
      optionsPageProps.initial_referrer || sessionState.rl_page_init_referrer.value;
  }

  if (pageProps.initial_referring_domain === undefined) {
    pageProps.initial_referring_domain =
      optionsPageProps.initial_referring_domain ||
      sessionState.rl_page_init_referring_domain.value;
  }
  return pageProps;
};

/**
 * To get the page properties for context object
 * @param pageProps Page properties
 * @returns page properties object for context
 */
export const getContextPageProperties = (pageProps?: ApiObject): ApiObject => ({
    path: pageProps?.path || pageParametersState.path.value,
    referrer: pageProps?.referrer || pageParametersState.referrer.value,
    referring_domain: pageProps?.referring_domain || pageParametersState.referring_domain.value,
    search: pageProps?.search || pageParametersState.search.value,
    title: pageProps?.title || pageParametersState.title.value,
    url: pageProps?.url || pageParametersState.url.value,
    tab_url: pageProps?.tab_url || pageParametersState.tab_url.value,
    initial_referrer: pageProps?.initial_referrer || sessionState.rl_page_init_referrer.value,
    initial_referring_domain:
      pageProps?.initial_referring_domain || sessionState.rl_page_init_referring_domain.value,
  });
