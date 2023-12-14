/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/LiveChat/constants';
import Logger from '../../utils/logger';
import { recordingLiveChatEvents } from './util';
import { isObject } from '../../utils/utils';
import { flattenJson } from '../../utils/commonUtils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class LiveChat {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.licenseId = config.licenseId;
    this.recordLiveChatEvents = config.recordLiveChatEvents;
    this.eventsToStandard = config.eventsToStandard;
    this.updateEventNames = config.updateEventNames;
    this.eventsList = config.eventsList;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.licenseId);
  }

  isLoaded() {
    return !!(window.LiveChatWidget && isObject(window.LiveChatWidget));
  }

  isReady() {
    // Dashboard Other Settings
    if (this.recordLiveChatEvents) {
      recordingLiveChatEvents(
        this.updateEventNames,
        this.eventsList,
        this.eventsToStandard,
        this.analytics,
      );
    }
    return !!window.LiveChatWidget;
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { userId, context } = message;
    const { traits } = context;
    const email = get(message, 'context.traits.email');

    if (email) {
      window.LiveChatWidget.call('set_customer_email', email);
    } else {
      logger.error('User parameter (email) ,required for identify call, not found');
    }

    const name = get(message, 'context.traits.name');

    if (name) {
      window.LiveChatWidget.call('set_customer_name', name);
    }
    if (traits) {
      const flattenTraits = flattenJson(traits);
      if (userId) flattenTraits.userId = userId;
      window.LiveChatWidget.call('set_session_variables', flattenTraits);
    }
  }
}

export default LiveChat;
