/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/ConvertFlow/constants';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import Logger from '../../utils/logger';
import { trigger } from './utils';

const logger = new Logger(DISPLAY_NAME);

class ConvertFlow {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.websiteId = config.websiteId;
    this.toggleToSendData = config.toggleToSendData;
    this.eventsList = config.eventsList;
    this.eventsMappping = config.eventsMappping;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    ScriptLoader(
      'convertflow-integration',
      `https://js.convertflow.co/production/websites/${this.websiteId}.js`,
    );
  }

  isLoaded() {
    if (this.toggleToSendData) {
      trigger(this.eventsMappping, this.eventsList, this.analytics);
    }
    return !!window.convertflow && typeof window.convertflow === 'object';
  }

  isReady() {
    return !!window.convertflow;
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const email = message.context.traits?.email || message.traits?.email;
    if (!email) {
      logger.error('email is required for identify call');
    }
    const payload = { email, override: true };
    window.convertflow.identify(payload);
  }
}

export default ConvertFlow;
