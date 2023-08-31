/* eslint-disable class-methods-use-this */
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Lemnisk/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(NAME);
class Lemnisk {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.accountId = config.accountId;
    this.sdkWriteKey = config.sdkWriteKey;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    logger.debug('===in init Lemnisk Marketing Automation===');
    loadNativeSdk(this.accountId, this.sdkWriteKey);
  }

  isLoaded() {
    logger.debug('===In isLoaded Lemnisk Marketing Automation===');
    return !!window.lmSMTObj;
  }

  isReady() {
    logger.debug('===In isReady Lemnisk Marketing Automation===');
    return !!window.lmSMTObj;
  }

  identify(rudderElement) {
    logger.debug('===In Lemnisk Marketing Automation identify===');

    const userId = rudderElement.message.userId || rudderElement.message.anonymousId;
    if (!userId) {
      logger.debug('[Lemnisk] identify:: user id is required');
      return;
    }
    const { message } = rudderElement;
    const context = message?.context || {};
    const traits = context?.traits || {};
    traits.isRudderEvents = true;
    window.lmSMTObj.identify(userId, traits);
  }

  track(rudderElement) {
    logger.debug('===In Lemnisk Marketing Automation track===');
    const { event, properties } = rudderElement.message;

    if (!event) {
      logger.error('[Lemnisk] track:: Event name is missing!');
      return;
    }
    if (properties) {
      properties.isRudderEvents = true;
      window.lmSMTObj.track(event, properties);
    } else {
      window.lmSMTObj.track(event, { isRudderEvents: true });
    }
  }

  page(rudderElement) {
    logger.debug('===In Lemnisk Marketing Automation page===');
    const { name, properties } = rudderElement.message;
    if (name && !properties) {
      window.lmSMTObj.page(name, { isRudderEvents: true });
    } else if (!name && properties) {
      properties.isRudderEvents = true;
      window.lmSMTObj.page(properties);
    } else if (name && properties) {
      properties.isRudderEvents = true;
      window.lmSMTObj.page(name, properties);
    } else {
      window.lmSMTObj.page({ isRudderEvents: true });
    }
  }
}
export default Lemnisk;
