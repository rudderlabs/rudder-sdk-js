import { state } from '@rudderstack/analytics-js/state';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { ApiCallback, ApiObject, ApiOptions } from '@rudderstack/analytics-js/state/types';
import { sessionState } from '@rudderstack/analytics-js/state/slices/session';
import { batch } from '@preact/signals-core';
import { consentsState } from '@rudderstack/analytics-js/state/slices/consents';
import { contextState } from '@rudderstack/analytics-js/state/slices/context';
import * as R from 'ramda';
import { Nullable } from '@rudderstack/analytics-js/types';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { CHANNEL } from './constants';
import { IEventManager, APIEvent, RudderEvent, RudderEventType } from './types';
import { tryStringify } from '../utilities/string';
import { getCurrentTimeFormatted } from '../utilities/timestamp';
import { generateUUID } from '../utilities/uuId';
import {
  checkForReservedElements,
  getContextPageProperties,
  getUpdatedPageProperties,
  processOptions,
} from './utilities';

/**
 * A service to generate valid event payloads and queue them for processing
 */
class EventManager implements IEventManager {
  errorHandler?: IErrorHandler;
  logger?: ILogger;

  /**
   * @param errorHandler Error handler object
   * @param logger Logger object
   */
  constructor(errorHandler?: IErrorHandler, logger?: ILogger) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.onError = this.onError.bind(this);
  }

  init() {
    // TODO: add eventManager and set status.value = 'initialized';
    //  once eventManager event repository is ready in order to start enqueueing any events
    state.lifecycle.status.value = 'initialized';
  }

  /**
   * Core method to build the events
   * @param rudderEvent Generated event object
   * @param options API options
   * @param callback Callback function
   * @param pageProps Page properties (available only for page events)
   */
  processEvent(
    rudderEvent: RudderEvent,
    options?: Nullable<ApiOptions>,
    callback?: Nullable<ApiCallback>,
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
      page: getContextPageProperties(pageProps),
    };
    rudderEvent.originalTimestamp = getCurrentTimeFormatted();
    rudderEvent.integrations = { All: true };
    rudderEvent.messageId = generateUUID();
    rudderEvent.userId = sessionState.rl_user_id.value;
    rudderEvent.groupId = sessionState.rl_group_id.value;
    rudderEvent.traits = { ...sessionState.rl_group_trait.value };

    processOptions(rudderEvent, options);
    checkForReservedElements(rudderEvent, this.logger);

    // TODO: Push the generated track event and callback to the event repository
    // TODO: Handle if device mode integrations are not loaded
    // TODO: Handle the case when SDK is not loaded
  }

  /**
   * Generate a 'page' event based on the user-input fields
   * @param category Page's category
   * @param name Page name
   * @param properties Page properties
   * @param options API options
   * @param callback Callback function
   */
  private processPageEvent(
    category?: Nullable<string>,
    name?: Nullable<string>,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: Nullable<ApiCallback>,
  ): void {
    // TODO: Handle adblocker request

    let props = R.clone(properties) || {};
    const opts = R.clone(options);

    if (props) {
      props.name = name;
      props.category = category;
    }

    props = getUpdatedPageProperties(props, opts);

    const pageEvent: RudderEvent = {
      properties: props,
      name,
      category,
      type: RudderEventType.PAGE,
    } as RudderEvent;

    this.processEvent(pageEvent, opts, callback, props);
  }

  /**
   * Generate a 'track' event based on the user-input fields
   * @param event The event name
   * @param properties Event properties
   * @param options API options
   * @param callback Callback function
   */
  private processTrackEvent(
    event: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: Nullable<ApiCallback>,
  ): void {
    const props = R.clone(properties);
    const opts = R.clone(options);
    const trackEvent: RudderEvent = {
      properties: props,
      event,
      type: RudderEventType.TRACK,
    } as RudderEvent;

    this.processEvent(trackEvent, opts, callback);
  }

  /**
   * Generate an 'identify' event based on the user-input fields
   * @param userId New user ID
   * @param traits User traits
   * @param options API options
   * @param callback Callback function
   */
  private processIdentifyEvent(
    userId?: Nullable<string>,
    traits?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: Nullable<ApiCallback>,
  ): void {
    const cTraits = R.clone(traits);
    const opts = R.clone(options);

    batch(() => {
      sessionState.rl_user_id.value = tryStringify(userId);
      sessionState.rl_trait.value = { ...sessionState.rl_trait.value, ...cTraits };
    });

    const identifyEvent: RudderEvent = {
      type: RudderEventType.IDENTIFY,
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
  private processAliasEvent(
    to: string,
    from?: Nullable<string>,
    options?: Nullable<ApiOptions>,
    callback?: Nullable<ApiCallback>,
  ): void {
    const opts = R.clone(options);

    sessionState.rl_user_id.value = tryStringify(to);

    const aliasEvent: RudderEvent = {
      previousId:
        tryStringify(from) || sessionState.rl_user_id.value || sessionState.rl_anonymous_id.value,
      type: RudderEventType.ALIAS,
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
  private processGroupEvent(
    groupId?: Nullable<string>,
    traits?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: Nullable<ApiCallback>,
  ): void {
    const cTraits = R.clone(traits);
    const opts = R.clone(options);

    batch(() => {
      sessionState.rl_group_id.value = tryStringify(groupId);
      sessionState.rl_group_trait.value = { ...sessionState.rl_group_trait.value, ...cTraits };
    });

    const groupEvent: RudderEvent = {
      type: RudderEventType.GROUP,
    } as RudderEvent;

    this.processEvent(groupEvent, opts, callback);
  }

  /**
   * Consumes a new incoming event
   * @param event Incoming event data
   */
  addEvent(event: APIEvent) {
    switch (event.type) {
      case RudderEventType.PAGE:
        this.processPageEvent(
          event.category,
          event.name,
          event.properties,
          event.options,
          event.callback,
        );
        break;
      case RudderEventType.TRACK:
        this.processTrackEvent(
          event.name as string,
          event.properties,
          event.options,
          event.callback,
        );
        break;
      case RudderEventType.IDENTIFY:
        this.processIdentifyEvent(event.userId, event.traits, event.options, event.callback);
        break;
      case RudderEventType.ALIAS:
        this.processAliasEvent(event.to as string, event.from, event.options, event.callback);
        break;
      case RudderEventType.GROUP:
        this.processGroupEvent(event.groupId, event.traits, event.options, event.callback);
        break;
      default:
        // Do nothing
        break;
    }
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

const defaultEventManager = new EventManager(defaultErrorHandler, defaultLogger);

export { EventManager, defaultEventManager };
