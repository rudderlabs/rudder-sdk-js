/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Axeptio/constants';
import Logger from '../../utils/logger';
import makeACall from './utils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class Axeptio {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.clientId = config.clientId;
    this.toggleToActivateCallback = config.toggleToActivateCallback;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.clientId);
  }

  isLoaded() {
    return !!window.__axeptioSDK && typeof window.__axeptioSDK === 'object';
  }

  isReady() {
    if (this.toggleToActivateCallback) {
      this.recordAxeptioEvents();
    }
    return !!window.__axeptioSDK;
  }

  // this function is used to record the triggered axeptio events through callback
  recordAxeptioEvents() {
    window._axcb = window._axcb || [];
    window._axcb.push(() => {
      window.__axeptioSDK.on(
        'cookies:*',
        function (payload, event) {
          makeACall(event, payload, this.analytics);
        },
        // set to true to record the past events too that have been dispatched before the event handler is set
        { replay: true },
      );
    });
  }
}

export default Axeptio;
