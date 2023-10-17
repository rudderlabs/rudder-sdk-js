/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Sendinblue/constants';
import Logger from '../../utils/logger';
import { prepareUserTraits, prepareTrackEventData, preparePagePayload } from './utils';
import { validateEmail, validatePhoneWithCountryCode } from '../../utils/commonUtils';

import { getDefinedTraits } from '../../utils/utils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class Sendinblue {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.clientKey = config.clientKey;
    this.contactAttributeMapping = config.contactAttributeMapping;
    this.sendTraitsInTrack = config.sendTraitsInTrack;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadScript() {
    const { clientKey } = this;
    loadNativeSdk(clientKey);
  }

  init() {
    this.loadScript();
  }

  isLoaded() {
    return !!window.sendinblue;
  }

  isReady() {

    return this.isLoaded();
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { email, phone } = getDefinedTraits(message);

    if (!email) {
      logger.error('email is missing');
      return;
    }

    if (!validateEmail(email)) {
      logger.error('provided email is invalid');
      return;
    }

    if (phone && !validatePhoneWithCountryCode(phone)) {
      logger.error(
        'provided phone number is invalid. Please provide valid phone number with country code',
      );
      return;
    }

    const userTraits = prepareUserTraits(message, this.contactAttributeMapping);
    window.sendinblue.identify(email, {
      ...userTraits,
    });
  }

  track(rudderElement) {
    const { message } = rudderElement;
    const { event } = message;
    if (!event) {
      logger.error('event is required for track call');
      return;
    }

    let userTraits = {};
    if (this.sendTraitsInTrack) {
      const { phone } = getDefinedTraits(message);
      if (phone && !validatePhoneWithCountryCode(phone)) {
        logger.error(
          'provided phone number is invalid. Please provide valid phone number with country code',
        );
        return;
      }
      userTraits = this.sendTraitsInTrack
        ? prepareUserTraits(message, this.contactAttributeMapping)
        : {};
    }

    const eventData = prepareTrackEventData(message);
    window.sendinblue.track(event, userTraits, eventData);
  }

  page(rudderElement) {
    const { message } = rudderElement;
    const { name } = message;
    const payload = preparePagePayload(message);
    window.sendinblue.page(name, payload);
  }
}

export default Sendinblue;
