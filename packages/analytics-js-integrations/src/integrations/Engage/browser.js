/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Engage/constants';
import Logger from '../../utils/logger';
import { refinePayload, getDestinationExternalID } from './utils';
import { getDefinedTraits } from '../../utils/utils';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(NAME);

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
    loadNativeSdk();
    window.Engage.init({
      key: this.api_key,
      secret: this.api_secret,
    });
  }

  isLoaded() {
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!window.Engage;
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return !!window.Engage;
  }

  identify(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} identify`);

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
    logger.debug(`In ${DISPLAY_NAME} track`);
    const { message } = rudderElement;
    const { event, properties, originalTimestamp } = message;
    let engageId = getDestinationExternalID(message, 'engageId');
    if (!engageId) {
      const { userIdOnly } = getDefinedTraits(message);
      engageId = userIdOnly || null;
    }
    if (!engageId) {
      logger.error(`${DISPLAY_NAME} : externalId or userId is required for track call`);
      return;
    }
    if (!event) {
      logger.error(`${DISPLAY_NAME} : Event name is not present`);
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
    logger.debug(`In ${DISPLAY_NAME} page`);
    const { message } = rudderElement;
    const { name, properties, originalTimestamp, category } = message;
    let engageId = getDestinationExternalID(message, 'engageId');
    if (!engageId) {
      const { userIdOnly } = getDefinedTraits(message);
      engageId = userIdOnly || null;
    }
    if (!engageId) {
      logger.error(`${DISPLAY_NAME} : externalId or userId is required for page call`);
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
