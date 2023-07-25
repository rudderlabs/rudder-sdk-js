/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '../../utils/logUtil';
import { NAME } from './constants';

import { recordingLiveChatEvents } from './util';
import { getHashFromArray } from '../../utils/commonUtils';
import { isObject } from '../../utils/utils';
import { loadNativeSdk } from './nativeSdkLoader';

class SnapEngage {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.widgetId = config.widgetId;
    this.recordLiveChatEvents = config.recordLiveChatEvents;
    this.eventsToStandard = config.eventsToStandard;
    this.updateEventNames = config.updateEventNames;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  loadScript() {
    loadNativeSdk(this.widgetId);
  }

  init() {
    logger.debug('===In init SnapEngage===');
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded SnapEngage===');
    return !!(window.SnapEngage && isObject(window.SnapEngage));
  }

  isReady() {
    logger.debug('===In isReady SnapEngage===');

    // Dashboard Other Settings
    if (this.recordLiveChatEvents) {
      const standardEventsMap = getHashFromArray(this.eventsToStandard);

      recordingLiveChatEvents(this.updateEventNames, standardEventsMap, this.analytics);
    }
    return !!window.SnapEngage;
  }

  identify(rudderElement) {
    logger.debug('===In SnapEngage Identify===');
    const { message } = rudderElement;
    const email = get(message, 'context.traits.email') || get(message, 'traits.email');

    if (!email) {
      logger.error('User parameter (email) is required for identify call');
      return;
    }
    window.SnapEngage.setUserEmail(email);

    const name = get(message, 'context.traits.name') || get(message, 'traits.name');

    if (name) {
      window.SnapEngage.setUserName(name);
    }
  }
}

export default SnapEngage;
