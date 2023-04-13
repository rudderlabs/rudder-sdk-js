import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { Nullable } from '@rudderstack/analytics-js/types';
import { pagePropertiesState } from '@rudderstack/analytics-js/state/slices/page';
import { consentsState } from '@rudderstack/analytics-js/state/slices/consents';
import { contextState } from '@rudderstack/analytics-js/state/slices/context';
import { sessionState } from '@rudderstack/analytics-js/state/slices/session';
import { RudderContext, RudderEvent } from './types';
import {
  RESERVED_ELEMENTS,
  CONTEXT_RESERVED_ELEMENTS,
  TOP_LEVEL_ELEMENTS,
  CHANNEL,
} from './constants';
import { isObject, mergeDeepRight } from '../utilities/object';
import { getCurrentTimeFormatted } from '../utilities/timestamp';
import { generateUUID } from '../utilities/uuId';

/**
 * Overrides the top-level event properties with data from API options
 * @param rudderEvent Generated rudder event
 * @param options API options
 */
export const updateTopLevelEventElements = (
  rudderEvent: RudderEvent,
  options: ApiOptions,
): void => {
  if (options.anonymousId) rudderEvent.anonymousId = options.anonymousId;
  if (options.integrations) rudderEvent.integrations = options.integrations;
  if (options.originalTimestamp) rudderEvent.originalTimestamp = options.originalTimestamp;
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
      } else if (typeof options[key] === 'object' && options[key] !== null) {
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
 * Add any missing default page properties using values from options and defaults
 * @param properties Input page properties
 * @param options API options
 */
export const getUpdatedPageProperties = (
  properties: ApiObject,
  options?: Nullable<ApiOptions>,
): ApiObject => {
  if (!options?.page || !isObject(options.page)) {
    return properties;
  }

  const optionsPageProps = options.page as ApiObject;
  const pageProps = properties;

  Object.keys(pagePropertiesState).forEach((key: string) => {
    if (pageProps[key] === undefined) {
      pageProps[key] = optionsPageProps[key] || pagePropertiesState[key].value;
    }
  });
  return pageProps;
};

/**
 * To get the page properties for context object
 * @param pageProps Page properties
 * @returns page properties object for context
 */
export const getContextPageProperties = (pageProps?: ApiObject): ApiObject => {
  const ctxPageProps: ApiObject = {};
  Object.keys(pagePropertiesState).forEach((key: string) => {
    ctxPageProps[key] = pageProps?.[key] || pagePropertiesState[key].value;
  });
  return ctxPageProps;
};

export const getCommonEventData = (pageProps?: ApiObject): Partial<RudderEvent> =>
  // TODO: Generate anonymous ID if it's already not present and remove '|| '''
  ({
    anonymousId: sessionState.rl_anonymous_id.value || '',
    channel: CHANNEL,
    context: {
      traits: { ...sessionState.rl_trait.value },
      sessionId: sessionState.rl_session.value.id,
      sessionStart: sessionState.rl_session.value.sessionStart,
      consentManagement: {
        // TODO: Consent manager to populate this data always
        deniedConsentIds: consentsState.deniedConsentIds.value,
      },
      'ua-ch': contextState['ua-ch'].value,
      app: contextState.app.value,
      library: contextState.library.value,
      userAgent: contextState.userAgent.value,
      os: contextState.os.value,
      locale: contextState.locale.value,
      screen: contextState.screen.value,
      campaign: contextState.campaign.value,
      page: getContextPageProperties(pageProps),
    },
    originalTimestamp: getCurrentTimeFormatted(),
    integrations: { All: true },
    messageId: generateUUID(),
    userId: sessionState.rl_user_id.value,
    groupId: sessionState.rl_group_id.value,
    traits: { ...sessionState.rl_group_trait.value },
  });
