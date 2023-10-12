import { clone } from 'ramda';
import {
  isString,
  isUndefined,
  isNullOrUndefined,
} from '@rudderstack/analytics-js-common/utilities/checks';
import {
  isObjectLiteralAndNotNull,
  mergeDeepRight,
} from '@rudderstack/analytics-js-common/utilities/object';
import { EVENT_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { generateUUID } from '@rudderstack/analytics-js-common/utilities/uuId';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js-common/utilities/timestamp';
import { NO_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { DEFAULT_INTEGRATIONS_CONFIG } from '@rudderstack/analytics-js-common/constants/integrationsConfig';
import { state } from '../../state';
import {
  INVALID_CONTEXT_OBJECT_WARNING,
  RESERVED_KEYWORD_WARNING,
} from '../../constants/logMessages';
import {
  CHANNEL,
  CONTEXT_RESERVED_ELEMENTS,
  RESERVED_ELEMENTS,
  TOP_LEVEL_ELEMENTS,
} from './constants';
import { getDefaultPageProperties } from '../utilities/page';
import { extractUTMParameters } from '../utilities/url';
/**
 * To get the page properties for context object
 * @param pageProps Page properties
 * @returns page properties object for context
 */
const getContextPageProperties = pageProps => {
  // Need to get updated page details on each event as an event to notify on SPA url changes does not seem to exist
  const curPageProps = getDefaultPageProperties();
  const ctxPageProps = {};
  Object.keys(curPageProps).forEach(key => {
    ctxPageProps[key] =
      (pageProps === null || pageProps === void 0 ? void 0 : pageProps[key]) || curPageProps[key];
  });
  ctxPageProps.initial_referrer =
    (pageProps === null || pageProps === void 0 ? void 0 : pageProps.initial_referrer) ||
    state.session.initialReferrer.value;
  ctxPageProps.initial_referring_domain =
    (pageProps === null || pageProps === void 0 ? void 0 : pageProps.initial_referring_domain) ||
    state.session.initialReferringDomain.value;
  return ctxPageProps;
};
/**
 * Add any missing default page properties using values from options and defaults
 * @param properties Input page properties
 * @param options API options
 */
const getUpdatedPageProperties = (properties, options) => {
  const optionsPageProps = (options === null || options === void 0 ? void 0 : options.page) || {};
  const pageProps = properties;
  // Need to get updated page details on each event as an event to notify on SPA url changes does not seem to exist
  const curPageProps = getDefaultPageProperties();
  Object.keys(curPageProps).forEach(key => {
    if (isUndefined(pageProps[key])) {
      pageProps[key] = optionsPageProps[key] || curPageProps[key];
    }
  });
  if (isUndefined(pageProps.initial_referrer)) {
    pageProps.initial_referrer =
      optionsPageProps.initial_referrer || state.session.initialReferrer.value;
  }
  if (isUndefined(pageProps.initial_referring_domain)) {
    pageProps.initial_referring_domain =
      optionsPageProps.initial_referring_domain || state.session.initialReferringDomain.value;
  }
  return pageProps;
};
/**
 * Utility to check for reserved keys in the input object
 * @param obj Generic object
 * @param parentKeyPath Object's parent key path
 * @param logger Logger instance
 */
const checkForReservedElementsInObject = (obj, parentKeyPath, logger) => {
  if (isObjectLiteralAndNotNull(obj)) {
    Object.keys(obj).forEach(property => {
      if (
        RESERVED_ELEMENTS.includes(property) ||
        RESERVED_ELEMENTS.includes(property.toLowerCase())
      ) {
        logger === null || logger === void 0
          ? void 0
          : logger.warn(
              RESERVED_KEYWORD_WARNING(EVENT_MANAGER, property, parentKeyPath, RESERVED_ELEMENTS),
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
const checkForReservedElements = (rudderEvent, logger) => {
  //  properties, traits, contextualTraits are either undefined or object
  const { properties, traits, context } = rudderEvent;
  const { traits: contextualTraits } = context;
  checkForReservedElementsInObject(properties, 'properties', logger);
  checkForReservedElementsInObject(traits, 'traits', logger);
  checkForReservedElementsInObject(contextualTraits, 'context.traits', logger);
};
/**
 * Overrides the top-level event properties with data from API options
 * @param rudderEvent Generated rudder event
 * @param options API options
 */
const updateTopLevelEventElements = (rudderEvent, options) => {
  if (options.anonymousId && isString(options.anonymousId)) {
    // eslint-disable-next-line no-param-reassign
    rudderEvent.anonymousId = options.anonymousId;
  }
  if (options.integrations && isObjectLiteralAndNotNull(options.integrations)) {
    // eslint-disable-next-line no-param-reassign
    rudderEvent.integrations = options.integrations;
  }
  if (options.originalTimestamp && isString(options.originalTimestamp)) {
    // eslint-disable-next-line no-param-reassign
    rudderEvent.originalTimestamp = options.originalTimestamp;
  }
};
/**
 * To merge the contextual information in API options with existing data
 * @param rudderContext Generated rudder event
 * @param options API options
 * @param logger Logger instance
 */
const getMergedContext = (rudderContext, options, logger) => {
  let context = rudderContext;
  Object.keys(options).forEach(key => {
    if (!TOP_LEVEL_ELEMENTS.includes(key) && !CONTEXT_RESERVED_ELEMENTS.includes(key)) {
      if (key !== 'context') {
        context = mergeDeepRight(context, {
          [key]: options[key],
        });
      } else if (!isUndefined(options[key]) && isObjectLiteralAndNotNull(options[key])) {
        const tempContext = {};
        Object.keys(options[key]).forEach(e => {
          if (!CONTEXT_RESERVED_ELEMENTS.includes(e)) {
            tempContext[e] = options[key][e];
          }
        });
        context = mergeDeepRight(context, {
          ...tempContext,
        });
      } else {
        logger === null || logger === void 0
          ? void 0
          : logger.warn(INVALID_CONTEXT_OBJECT_WARNING(EVENT_MANAGER));
      }
    }
  });
  return context;
};
/**
 * A function to determine whether SDK should use the integration option provided in load call
 * @returns boolean
 */
const shouldUseGlobalIntegrationsConfigInEvents = () =>
  state.loadOptions.value.useGlobalIntegrationsConfigInEvents &&
  isObjectLiteralAndNotNull(state.nativeDestinations.loadOnlyIntegrations.value);
/**
 * Updates rudder event object with data from the API options
 * @param rudderEvent Generated rudder event
 * @param options API options
 */
const processOptions = (rudderEvent, options) => {
  // Only allow object type for options
  if (!isNullOrUndefined(options) && isObjectLiteralAndNotNull(options)) {
    updateTopLevelEventElements(rudderEvent, options);
    // eslint-disable-next-line no-param-reassign
    rudderEvent.context = getMergedContext(rudderEvent.context, options);
  }
};
/**
 * Returns the final integrations config for the event based on the global config and event's config
 * @param integrationsConfig Event's integrations config
 * @returns Final integrations config
 */
const getEventIntegrationsConfig = integrationsConfig => {
  let finalIntgConfig;
  if (shouldUseGlobalIntegrationsConfigInEvents()) {
    finalIntgConfig = state.nativeDestinations.loadOnlyIntegrations.value;
  } else if (isObjectLiteralAndNotNull(integrationsConfig)) {
    finalIntgConfig = integrationsConfig;
  } else {
    finalIntgConfig = DEFAULT_INTEGRATIONS_CONFIG;
  }
  return finalIntgConfig;
};
/**
 * Enrich the base event object with data from state and the API options
 * @param rudderEvent RudderEvent object
 * @param options API options
 * @param pageProps Page properties
 * @param logger logger
 * @returns Enriched RudderEvent object
 */
const getEnrichedEvent = (rudderEvent, options, pageProps, logger) => {
  var _a, _b, _c;
  const commonEventData = {
    channel: CHANNEL,
    context: {
      traits: clone(state.session.userTraits.value),
      sessionId: state.session.sessionInfo.value.id || undefined,
      sessionStart: state.session.sessionInfo.value.sessionStart || undefined,
      consentManagement: {
        deniedConsentIds: clone(state.consents.data.value.deniedConsentIds),
      },
      'ua-ch': state.context['ua-ch'].value,
      app: state.context.app.value,
      library: state.context.library.value,
      userAgent: state.context.userAgent.value,
      os: state.context.os.value,
      locale: state.context.locale.value,
      screen: state.context.screen.value,
      campaign: extractUTMParameters(globalThis.location.href),
      page: getContextPageProperties(pageProps),
    },
    originalTimestamp: getCurrentTimeFormatted(),
    integrations: DEFAULT_INTEGRATIONS_CONFIG,
    messageId: generateUUID(),
    userId: rudderEvent.userId || state.session.userId.value,
  };
  if (
    ((_a = state.storage.entries.value.anonymousId) === null || _a === void 0
      ? void 0
      : _a.type) === NO_STORAGE
  ) {
    // Generate new anonymous id for each request
    commonEventData.anonymousId = generateUUID();
  } else {
    // Type casting to string as the user session manager will take care of initializing the value
    commonEventData.anonymousId = state.session.anonymousId.value;
  }
  // set truly anonymous tracking flag
  if (state.storage.trulyAnonymousTracking.value) {
    commonEventData.context.trulyAnonymousTracking = true;
  }
  if (rudderEvent.type === 'identify') {
    commonEventData.context.traits =
      ((_b = state.storage.entries.value.userTraits) === null || _b === void 0
        ? void 0
        : _b.type) !== NO_STORAGE
        ? clone(state.session.userTraits.value)
        : rudderEvent.context.traits;
  }
  if (rudderEvent.type === 'group') {
    if (rudderEvent.groupId || state.session.groupId.value) {
      commonEventData.groupId = rudderEvent.groupId || state.session.groupId.value;
    }
    if (rudderEvent.traits || state.session.groupTraits.value) {
      commonEventData.traits =
        ((_c = state.storage.entries.value.groupTraits) === null || _c === void 0
          ? void 0
          : _c.type) !== NO_STORAGE
          ? clone(state.session.groupTraits.value)
          : rudderEvent.traits;
    }
  }
  const processedEvent = mergeDeepRight(rudderEvent, commonEventData);
  // Set the default values for the event properties
  // matching with v1.1 payload
  if (processedEvent.event === undefined) {
    processedEvent.event = null;
  }
  if (processedEvent.properties === undefined) {
    processedEvent.properties = null;
  }
  processOptions(processedEvent, options);
  checkForReservedElements(processedEvent, logger);
  // Update the integrations config for the event
  processedEvent.integrations = getEventIntegrationsConfig(processedEvent.integrations);
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
