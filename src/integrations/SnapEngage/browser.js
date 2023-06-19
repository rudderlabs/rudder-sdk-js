/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '../../utils/logUtil';
import { NAME } from './constants';

import { recordingLiveChatEvents } from './util';
import { getHashFromArray } from '../../utils/commonUtils';
import { isObject } from '../../utils/utils';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

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
    this.enableTransformationForDeviceMode =
      destinationInfo && destinationInfo.enableTransformationForDeviceMode;
    this.propagateEventsUntransformedOnError =
      destinationInfo && destinationInfo.propagateEventsUntransformedOnError;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  loadScript() {
    (function (widgetId) {
      const se = document.createElement('script');
      se.type = 'text/javascript';
      se.async = true;
      se.src = `https://storage.googleapis.com/code.snapengage.com/js/${widgetId}.js`;
      se.setAttribute('data-loader', LOAD_ORIGIN);
      let done = false;
      se.onload = se.onreadystatechange = function () {
        if (
          !done &&
          (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')
        ) {
          done = true;
        }
      };
      const s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(se, s);
    })(this.widgetId);
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
