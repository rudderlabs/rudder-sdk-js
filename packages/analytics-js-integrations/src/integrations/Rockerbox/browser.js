/* eslint-disable prefer-destructuring */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Rockerbox/constants';
import Logger from '../../utils/logger';
import { getHashFromArray } from '../../utils/commonUtils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class Rockerbox {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.clientAuthId = config.clientAuthId;
    this.name = NAME;
    this.customDomain = config.customDomain;
    this.enableCookieSync = config.enableCookieSync;
    this.eventsMap = config.eventsMap || [];
    this.connectionMode = config.connectionMode;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.customDomain, this.enableCookieSync, this.clientAuthId);
  }

  isLoaded() {
    logger.debug('In isLoaded');
    return !!window.RB && !!window.RB.loaded;
  }

  isReady() {
    logger.debug('In isReady');
    return !!window.RB;
  }

  identify(rudderElement) {
    logger.debug('In identify');
    const { message } = rudderElement;
    const { userId, anonymousId, traits, context } = message;
    if (!userId) {
      logger.debug('userId is needed. A primary identifier is expected');
    }
    const email = traits?.email || context?.traits?.email;
    window.RB.track('identify', {
      external_id: userId,
      anonymousId,
      email,
      phone_number: traits?.phone || context?.traits?.phone,
    });
  }

  track(rudderElement) {
    if (this.connectionMode === 'hybrid') {
      logger.info(
        'The connectionMode is set to hybrid. Track call will not be sent via device mode',
      );
      return;
    }
    logger.debug('In track');

    const { message } = rudderElement;
    const { event, anonymousId, properties } = message;
    if (!event) {
      logger.error('Event name not present');
      return;
    }
    const eventsHashmap = getHashFromArray(this.eventsMap);
    const rbEvent = eventsHashmap[event.toLowerCase()];
    if (rbEvent) {
      window.RB.track(rbEvent, { ...properties, anonymousId });
    } else {
      logger.error(`The event ${event} is not mapped to any Rockerbox Event. Aborting!`);
    }
  }

  page(rudderElement) {
    logger.debug('In page');
    const { message } = rudderElement;
    const { anonymousId, properties } = message;
    window.RB.track('view', { ...properties, anonymousId });
  }
}

export default Rockerbox;
