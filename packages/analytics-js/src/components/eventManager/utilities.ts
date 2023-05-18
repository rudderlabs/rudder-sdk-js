import { ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';
import { state } from '@rudderstack/analytics-js/state';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { clone } from 'ramda';
import { RudderContext, RudderEvent, RudderEventType } from './types';
import { isObjectAndNotNull, mergeDeepRight } from '../utilities/object';
import { getCurrentTimeFormatted } from '../utilities/timestamp';
import { generateUUID } from '../utilities/uuId';
import {
  CHANNEL,
  CONTEXT_RESERVED_ELEMENTS,
  RESERVED_ELEMENTS,
  TOP_LEVEL_ELEMENTS,
} from './constants';

/**
 * Add any missing default page properties using values from options and defaults
 * @param properties Input page properties
 * @param options API options
 */
const getUpdatedPageProperties = (
  properties: ApiObject,
  options?: Nullable<ApiOptions>,
): ApiObject => {
  if (!options?.page || !isObjectAndNotNull(options.page)) {
    return properties;
  }

  const optionsPageProps = options.page as ApiObject;
  const pageProps = properties;

  Object.keys(state.page).forEach((key: string) => {
    if (pageProps[key] === undefined) {
      pageProps[key] = optionsPageProps[key] || state.page[key].value;
    }
  });

  if (pageProps.initial_referrer === undefined) {
    pageProps.initial_referrer =
      optionsPageProps.initial_referrer || state.session.initialReferrer.value;
  }

  if (pageProps.initial_referring_domain === undefined) {
    pageProps.initial_referring_domain =
      optionsPageProps.initial_referring_domain || state.session.initialReferringDomain.value;
  }

  return pageProps;
};

/**
 * Utility to check for reserved keys in the input object
 * @param obj Generic object
 * @param eventType Rudder event type
 * @param parentKeyPath Object's parent key path
 * @param logger Logger instance
 */
const checkForReservedElementsInObject = (
  obj: Nullable<ApiObject> | RudderContext | undefined,
  eventType: string,
  parentKeyPath: string,
  logger?: ILogger,
): void => {
  if (isObjectAndNotNull(obj)) {
    Object.keys(obj as object).forEach(property => {
      if (
        RESERVED_ELEMENTS.includes(property) ||
        RESERVED_ELEMENTS.includes(property.toLowerCase())
      ) {
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
 * @param logger Logger instance
 */
const checkForReservedElements = (rudderEvent: RudderEvent, logger?: ILogger): void => {
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
const getContextPageProperties = (pageProps?: ApiObject): ApiObject => {
  const ctxPageProps: ApiObject = {};
  Object.keys(state.page).forEach((key: string) => {
    ctxPageProps[key] = pageProps?.[key] || state.page[key].value;
  });

  ctxPageProps.initial_referrer =
    pageProps?.initial_referrer || state.session.initialReferrer.value;

  ctxPageProps.initial_referring_domain =
    pageProps?.initial_referring_domain || state.session.initialReferringDomain.value;
  return ctxPageProps;
};

/**
 * Overrides the top-level event properties with data from API options
 * @param rudderEvent Generated rudder event
 * @param options API options
 */
const updateTopLevelEventElements = (rudderEvent: RudderEvent, options: ApiOptions): void => {
  if (options.anonymousId && typeof options.anonymousId === 'string') {
    // eslint-disable-next-line no-param-reassign
    rudderEvent.anonymousId = options.anonymousId;
  }

  if (options.integrations && isObjectAndNotNull(options.integrations)) {
    // eslint-disable-next-line no-param-reassign
    rudderEvent.integrations = options.integrations;
  }

  if (options.originalTimestamp && typeof options.originalTimestamp === 'string') {
    // eslint-disable-next-line no-param-reassign
    rudderEvent.originalTimestamp = options.originalTimestamp;
  }
};

/**
 * To merge the contextual information in API options with existing data
 * @param rudderEvent Generated rudder event
 * @param options API options
 * @param logger Logger instance
 */
const getMergedContext = (
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
const processOptions = (rudderEvent: RudderEvent, options?: Nullable<ApiOptions>): void => {
  // Only allow object type for options
  if (options && isObjectAndNotNull(options)) {
    updateTopLevelEventElements(rudderEvent, options);
    // eslint-disable-next-line no-param-reassign
    rudderEvent.context = getMergedContext(rudderEvent.context, options);
  }
};

/**
 * Enrich the base event object with data from state and the API options
 * @param rudderEvent RudderEvent object
 * @param options API options
 * @param pageProps Page properties
 * @returns Enriched RudderEvent object
 */
const getEnrichedEvent = (
  rudderEvent: Partial<RudderEvent>,
  options?: Nullable<ApiOptions>,
  pageProps?: ApiObject,
): RudderEvent => {
  const commonEventData = {
    // Type casting to string as the user session manager will take care of initializing the value
    anonymousId: state.session.anonymousUserId.value as string,
    channel: CHANNEL,
    context: {
      traits: clone(state.session.userTraits.value),
      sessionId: state.session.sessionInfo.value.id,
      sessionStart: state.session.sessionInfo.value.sessionStart,
      consentManagement: {
        deniedConsentIds: clone(state.consents.deniedConsentIds.value),
      },
      'ua-ch': state.context['ua-ch'].value,
      app: state.context.app.value,
      library: state.context.library.value,
      userAgent: state.context.userAgent.value,
      os: state.context.os.value,
      locale: state.context.locale.value,
      screen: state.context.screen.value,
      campaign: clone(state.context.campaign.value),
      page: getContextPageProperties(pageProps),
    },
    originalTimestamp: getCurrentTimeFormatted(),
    integrations: { All: true },
    messageId: generateUUID(),
    userId: state.session.userId.value,
  } as Partial<RudderEvent>;

  if (rudderEvent.type === RudderEventType.Group) {
    commonEventData.groupId = state.session.groupId.value;
    commonEventData.traits = clone(state.session.groupTraits.value);
  }

  const processedEvent = mergeDeepRight(rudderEvent, commonEventData) as RudderEvent;

  processOptions(processedEvent, options);
  // TODO: We might not need this check altogether
  checkForReservedElements(processedEvent, defaultLogger);

  return processedEvent;
};

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
