/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { refinePayload, getDestinationExternalID } from './utils';
import { getDefinedTraits } from '../../utils/utils';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';
import { loadNativeSdk } from './nativeSdkLoader';

class Engage {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.api_key = config.publicKey;
    this.api_secret = config.privateKey;
    this.name = NAME;
    this.listsIds = config.listsIds;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    logger.debug('===In init Engage===');

    loadNativeSdk();

    window.Engage.init({
      key: this.api_key,
      secret: this.api_secret,
    });
  }

  isLoaded() {
    logger.debug('===In isLoaded Engage===');

    return !!window.Engage;
  }

  isReady() {
    logger.debug('===In isReady Engage===');
    return !!window.Engage;
  }

  identify(rudderElement) {
    logger.debug('===In Engage identify');

    const { message } = rudderElement;
    const engageId = getDestinationExternalID(message, 'engageId');
    const { userIdOnly, firstName, phone, lastName } = getDefinedTraits(message);
    if (!engageId && !userIdOnly) {
      logger.error('externalId or userId is required for Identify call.');
      return;
    }
    const { originalTimestamp, context } = message;

    const { traits } = context;
    let payload = refinePayload(traits, true);

    payload.number = phone;
    payload.last_name = lastName;
    payload.first_name = firstName;
    payload.created_at = originalTimestamp;
    payload = removeUndefinedAndNullValues(payload);
    payload.id = engageId || userIdOnly;
    window.Engage.identify(payload);
  }

  track(rudderElement) {
    logger.debug('===In Engage track===');
    const { message } = rudderElement;
    const { event, properties, originalTimestamp } = message;
    let engageId = getDestinationExternalID(message, 'engageId');
    if (!engageId) {
      const { userIdOnly } = getDefinedTraits(message);
      engageId = userIdOnly || null;
    }
    if (!engageId) {
      logger.error('externalId or userId is required for track call.');
      return;
    }
    if (!event) {
      logger.error('[ Engage ]:: Event name not present');
      return;
    }
    let payload = refinePayload(properties);
    payload = removeUndefinedAndNullValues(payload);
    window.Engage.track(engageId, {
      event,
      timestamp: originalTimestamp,
      properties: payload,
    });
  }

  page(rudderElement) {
    logger.debug('===In Engage page===');
    const { message } = rudderElement;
    const { name, properties, originalTimestamp, category } = message;
    let engageId = getDestinationExternalID(message, 'engageId');
    if (!engageId) {
      const { userIdOnly } = getDefinedTraits(message);
      engageId = userIdOnly || null;
    }
    if (!engageId) {
      logger.error('externalId or userId is required for track call.');
      return;
    }
    let payload = refinePayload(properties);
    payload = removeUndefinedAndNullValues(payload);
    const pageCat = category ? `${category} ` : '';
    const pageName = name ? `${name} ` : '';
    const eventName = `Viewed ${pageCat}${pageName}Page`;
    window.Engage.track(engageId, {
      event: eventName,
      timestamp: originalTimestamp,
      properties: payload,
    });
  }
}

export default Engage;
