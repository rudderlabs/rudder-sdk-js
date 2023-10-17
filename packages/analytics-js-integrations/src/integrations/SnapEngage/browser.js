/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/SnapEngage/constants';
import Logger from '../../utils/logger';
import { recordingLiveChatEvents } from './util';
import { getHashFromArray } from '../../utils/commonUtils';
import { isObject } from '../../utils/utils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

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
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadScript() {
    loadNativeSdk(this.widgetId);
  }

  init() {
    this.loadScript();
  }

  isLoaded() {
    return !!(window.SnapEngage && isObject(window.SnapEngage));
  }

  isReady() {
    // Dashboard Other Settings
    if (this.recordLiveChatEvents) {
      const standardEventsMap = getHashFromArray(this.eventsToStandard);

      recordingLiveChatEvents(this.updateEventNames, standardEventsMap, this.analytics);
    }
    return !!window.SnapEngage;
  }

  identify(rudderElement) {
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
