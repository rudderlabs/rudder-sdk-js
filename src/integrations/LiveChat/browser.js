/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '../../utils/logUtil';

import { recordingLiveChatEvents } from './util';
import { isObject } from '../../utils/utils';
import { flattenJson } from '../../utils/commonUtils';
import { NAME } from './constants';
import { loadNativeSdk } from './nativeSdkLoader';

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
    logger.debug('===in init Livechat===');
    loadNativeSdk(this.licenseId);
  }

  isLoaded() {
    logger.debug('===In isLoaded LiveChat===');
    return !!(window.LiveChatWidget && isObject(window.LiveChatWidget));
  }

  isReady() {
    logger.debug('===In isReady LiveChat===');

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
    logger.debug('===In LiveChat Identify===');
    const { message } = rudderElement;
    const { userId, context } = message;
    const { traits } = context;
    const email = get(message, 'context.traits.email');

    if (email) {
      window.LiveChatWidget.call('set_customer_email', email);
    } else {
      logger.error('User parameter (email) ,required for identify call, not found.');
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
