import {
  ApiCallback,
  ApiObject,
  RudderEvent,
  RudderTrackEvent,
} from '@rudderstack/analytics-js/state/types';
import * as R from 'ramda';
import { sessionState } from '@rudderstack/analytics-js/state/slices/session';
import { getCurrentTimeFormatted } from '@rudderstack/analytics-js/components/utilities/timestamp';
import { consentsState } from '@rudderstack/analytics-js/state/slices/consents';
import { contextState } from '@rudderstack/analytics-js/state/slices/context';
import { pageParametersState } from '@rudderstack/analytics-js/state/slices/page';
import { IErrorHandler } from '../ErrorHandler/types';
import { ILogger } from '../Logger/types';
import { IEventsHandler } from './types';
import { CHANNEL, TRACK } from './constants';

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

  static processOptionsData(options: ApiObject, rudderEvent: RudderEvent) {
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
    options: ApiObject,
    callback: ApiCallback,
  ): void {
    const props = R.clone(properties);
    const opts = R.clone(options);
    const trackEvent: RudderTrackEvent = {
      properties: props,
      event,
      // TODO: Generate anonymous ID if it's already not present
      anonymousId: sessionState.rl_anonymous_id.value,
      type: TRACK,
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
        campaign: contextState.campaign.value
      },
      originalTimestamp: getCurrentTimeFormatted(),
      integrations: {},
      messageId: '',
      userId: sessionState.rl_user_id.value,
    };

    this.processOptionsData(opts, trackEvent);

    // Push the generated track event and callback to the event repository
  }

  /**
   *
   * @param category
   * @param name
   * @param properties
   * @param options
   * @param callback
   */
  processPageEvent(
    category: string,
    name: string,
    properties: ApiObject,
    options: ApiObject,
    callback: ApiCallback,
  ): void {
    // TODO: Implement this
    this.logger?.info(category, name, properties, options, callback);
  }

  /**
   *
   * @param userId
   * @param traits
   * @param options
   * @param callback
   */
  processIdentifyEvent(
    userId: string,
    traits: ApiObject,
    options: ApiObject,
    callback: ApiCallback,
  ): void {
    // TODO: Implement this
    this.logger?.info(userId, traits, options, callback);
  }

  /**
   *
   * @param to
   * @param from
   * @param options
   * @param callback
   */
  processAliasEvent(to: string, from: string, options: ApiObject, callback: ApiCallback): void {
    // TODO: Implement this
    this.logger?.info(to, from, options, callback);
  }

  /**
   *
   * @param groupId
   * @param traits
   * @param options
   * @param callback
   */
  processGroupEvent(
    groupId: string,
    traits: ApiObject,
    options: ApiObject,
    callback: ApiCallback,
  ): void {
    // TODO: Implement this
    this.logger?.info(groupId, traits, options, callback);
  }

  /**
   * Handles error
   * @param error The error object
   */
  onError(error: Error | unknown) {
    if (this.errorHandler) {
      this.errorHandler.onError(error, 'HttpClient');
    } else {
      throw error;
    }
  }
}

const defaultEventsHandler = new EventsHandler();

export { defaultEventsHandler };
