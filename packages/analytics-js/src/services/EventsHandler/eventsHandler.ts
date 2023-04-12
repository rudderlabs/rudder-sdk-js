import {
  ApiCallback,
  ApiObject,
  IntegrationOpts,
  RudderEvent,
  ApiOptions,
  RudderContext,
} from '@rudderstack/analytics-js/state/types';
import * as R from 'ramda';
import { sessionState } from '@rudderstack/analytics-js/state/slices/session';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js/components/utilities/timestamp';
import { isObject, mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { consentsState } from '@rudderstack/analytics-js/state/slices/consents';
import { contextState } from '@rudderstack/analytics-js/state/slices/context';
import { generateUUID } from '@rudderstack/analytics-js/components/utilities/uuId';
import { pageParametersState } from '@rudderstack/analytics-js/state/slices/page';
import { batch } from '@preact/signals-core';
import { tryStringify } from '@rudderstack/analytics-js/components/utilities/string';
import { IErrorHandler } from '../ErrorHandler/types';
import { ILogger } from '../Logger/types';
import { IEventsHandler } from './types';
import {
  ALIAS,
  CHANNEL,
  GROUP,
  IDENTIFY,
  PAGE,
  RESERVED_ELEMENTS,
  SYSTEM_KEYWORDS,
  TOP_LEVEL_ELEMENTS,
  TRACK,
} from './constants';

/**
 * A service to generate valid event payloads and queue them for processing
 */
class EventsHandler implements IEventsHandler {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  initialized = false;

  /**
   * @param errorHandler Error handler object
   * @param logger Logger object
   */
  constructor(errorHandler?: IErrorHandler, logger?: ILogger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.onError = this.onError.bind(this);
  }

  /**
   * Overrides the top-level event properties with data from API options
   * @param rudderEvent Generated rudder event
   * @param options API options
   */
  mergeTopLevelElements(rudderEvent: RudderEvent, options: ApiOptions) {
    rudderEvent.anonymousId = options.anonymousId as string;
    rudderEvent.integrations = options.integrations as IntegrationOpts;
    rudderEvent.originalTimestamp = options.originalTimestamp as string;
  }

  /**
   * To merge the contextual information in API options with existing data
   * @param rudderEvent Generated rudder event
   * @param options API options
   */
  mergeContext(rudderEvent: RudderEvent, options: ApiOptions) {
    let { context } = rudderEvent;
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
          this.logger?.error(
            `[Analytics: processOptionsParam] context passed in options "${key}" is not an object`,
          );
        }
      }
    });
    rudderEvent.context = context;
  }

  /**
   * Updates rudder event object with data from the API options
   * @param rudderEvent Generated rudder event
   * @param options API options
   */
  processOptions(rudderEvent: RudderEvent, options: ApiOptions) {
    // Only allow object type for options
    if (isObject(options)) {
      this.mergeTopLevelElements(rudderEvent, options);
      this.mergeContext(rudderEvent, options);
    }
  }

  /**
   * To get the page properties for context object
   * @param pageProps Page properties
   * @returns page properties object for context
   */
  getContextPageProperties(pageProps?: ApiObject): ApiObject {
    return {
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
    };
  }

  /**
   * Utility to check for reserved keys in the input object
   * @param obj Generic object
   * @param eventType Rudder event type
   * @param parentKeyPath Object's parent key path
   */
  checkForReservedElementsInObject(
    obj: ApiObject | RudderContext | undefined,
    eventType: string,
    parentKeyPath: string,
  ): void {
    if (isObject(obj)) {
      Object.keys(obj as object).forEach(property => {
        if (RESERVED_ELEMENTS.includes(property.toLowerCase())) {
          this.logger?.error(
            `Warning: Reserved keyword used in ${parentKeyPath} --> "${property}" for ${eventType} event`,
          );
        }
      });
    }
  }

  /**
   * Checks for reserved keys in traits, properties, and contextual traits
   * @param rudderEvent Generated rudder event
   */
  checkForReservedElements(rudderEvent: RudderEvent): void {
    //  properties, traits, contextualTraits are either undefined or object
    const { properties, traits, context } = rudderEvent;
    const { traits: contextualTraits } = context;

    this.checkForReservedElementsInObject(properties, rudderEvent.type, 'properties');
    this.checkForReservedElementsInObject(traits, rudderEvent.type, 'traits');
    this.checkForReservedElementsInObject(contextualTraits, rudderEvent.type, 'context.traits');
  }

  /**
   * Core method to build the events
   * @param rudderEvent Generated event object
   * @param opts API options
   * @param callback Callback function
   * @param pageProps Page properties (available only for page events)
   */
  processEvent(
    rudderEvent: RudderEvent,
    opts: ApiOptions,
    callback: ApiCallback,
    pageProps?: ApiObject,
  ): void {
    // TODO: Generate anonymous ID if it's already not present and remove '|| '''
    rudderEvent.anonymousId = sessionState.rl_anonymous_id.value || '';
    rudderEvent.channel = CHANNEL;
    rudderEvent.context = {
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
      page: this.getContextPageProperties(pageProps),
    };
    rudderEvent.originalTimestamp = getCurrentTimeFormatted();
    rudderEvent.integrations = { All: true };
    rudderEvent.messageId = generateUUID();
    rudderEvent.userId = sessionState.rl_user_id.value;
    rudderEvent.groupId = sessionState.rl_group_id.value;
    rudderEvent.traits = { ...sessionState.rl_group_trait.value };

    this.processOptions(rudderEvent, opts);
    this.checkForReservedElements(rudderEvent);

    // TODO: Push the generated track event and callback to the event repository
    // TODO: Handle if device mode integrations are not loaded
    // TODO: Handle the case when SDK is not loaded 
  }

  /**
   * Generate a 'track' event based on the user-input fields
   * @param event The event name
   * @param properties Event properties
   * @param options API options
   * @param callback Callback function
   */
  processTrackEvent(
    event: string,
    properties: ApiObject,
    options: ApiOptions,
    callback: ApiCallback,
  ): void {
    const props = R.clone(properties);
    const opts = R.clone(options);
    const trackEvent: RudderEvent = {
      properties: props,
      event,
      type: TRACK,
    } as RudderEvent;

    this.processEvent(trackEvent, opts, callback);
  }

  /**
   * Add any missing default page properties using values from options and defaults
   * @param properties Input page properties
   * @param options API options
   */
  updatePageProperties(properties: ApiObject, options: ApiOptions): void {
    const optionsPageProps = (options?.page as ApiObject) || {};
    if (properties.path === undefined) {
      properties.path = optionsPageProps.path || pageParametersState.path.value;
    }

    if (properties.referrer === undefined) {
      properties.referrer = optionsPageProps.referrer || pageParametersState.referrer.value;
    }

    if (properties.referring_domain === undefined) {
      properties.referring_domain =
        optionsPageProps.referring_domain || pageParametersState.referring_domain.value;
    }

    if (properties.search === undefined) {
      properties.search = optionsPageProps.search || pageParametersState.search.value;
    }

    if (properties.search === undefined) {
      properties.search = optionsPageProps.search || pageParametersState.search.value;
    }

    if (properties.title === undefined) {
      properties.title = optionsPageProps.title || pageParametersState.title.value;
    }

    if (properties.url === undefined) {
      properties.url = optionsPageProps.url || pageParametersState.url.value;
    }

    if (properties.tab_url === undefined) {
      properties.tab_url = optionsPageProps.tab_url || pageParametersState.tab_url.value;
    }

    if (properties.initial_referrer === undefined) {
      properties.initial_referrer =
        optionsPageProps.initial_referrer || sessionState.rl_page_init_referrer.value;
    }

    if (properties.initial_referring_domain === undefined) {
      properties.initial_referring_domain =
        optionsPageProps.initial_referring_domain ||
        sessionState.rl_page_init_referring_domain.value;
    }
  }

  /**
   * Generate a 'page' event based on the user-input fields
   * @param category Page's category
   * @param name Page name
   * @param properties Page properties
   * @param options API options
   * @param callback Callback function
   */
  processPageEvent(
    category: string,
    name: string,
    properties: ApiObject,
    options: ApiOptions,
    callback: ApiCallback,
  ): void {
    // TODO: Handle adblocker request

    const props = R.clone(properties);
    const opts = R.clone(options);

    props.name = name;
    props.category = category;

    this.updatePageProperties(props, opts);

    const pageEvent: RudderEvent = {
      properties: props,
      name,
      category,
      type: PAGE,
    } as RudderEvent;

    this.processEvent(pageEvent, opts, callback, props);
  }

  /**
   * Generate an 'identify' event based on the user-input fields
   * @param userId New user ID
   * @param traits User traits
   * @param options API options
   * @param callback Callback function
   */
  processIdentifyEvent(
    userId: string,
    traits: ApiObject,
    options: ApiOptions,
    callback: ApiCallback,
  ): void {
    const cTraits = R.clone(traits);
    const opts = R.clone(options);

    // TODO: Invoke the reset API if the user ID changes

    batch(() => {
      sessionState.rl_user_id.value = tryStringify(userId);
      sessionState.rl_trait.value = { ...sessionState.rl_trait.value, ...cTraits };
    });

    const identifyEvent: RudderEvent = {
      type: IDENTIFY,
    } as RudderEvent;

    this.processEvent(identifyEvent, opts, callback);
  }

  /**
   * Generate an 'alias' event based on the user-input fields
   * @param to New user ID
   * @param from Old user ID
   * @param options API options
   * @param callback Callback function
   */
  processAliasEvent(to: string, from: string, options: ApiOptions, callback: ApiCallback): void {
    const opts = R.clone(options);

    sessionState.rl_user_id.value = tryStringify(to);

    const aliasEvent: RudderEvent = {
      previousId:
        tryStringify(from) || sessionState.rl_user_id.value || sessionState.rl_anonymous_id.value,
      type: ALIAS,
    } as RudderEvent;

    this.processEvent(aliasEvent, opts, callback);
  }

  /**
   * Generate a 'group' event based on the user-input fields
   * @param groupId Group ID
   * @param traits Group traits
   * @param options API options
   * @param callback Callback function
   */
  processGroupEvent(
    groupId: string,
    traits: ApiObject,
    options: ApiOptions,
    callback: ApiCallback,
  ): void {
    const cTraits = R.clone(traits);
    const opts = R.clone(options);

    batch(() => {
      sessionState.rl_group_id.value = tryStringify(groupId);
      sessionState.rl_group_trait.value = { ...sessionState.rl_group_trait.value, ...cTraits };
    });

    const groupEvent: RudderEvent = {
      type: GROUP,
    } as RudderEvent;

    this.processEvent(groupEvent, opts, callback);
  }

  /**
   * Handles error
   * @param error The error object
   */
  onError(error: Error | unknown): void {
    if (this.errorHandler) {
      this.errorHandler.onError(error, 'HttpClient');
    } else {
      throw error;
    }
  }
}

const defaultEventsHandler = new EventsHandler();

export { defaultEventsHandler };
