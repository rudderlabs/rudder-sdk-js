/* eslint-disable class-methods-use-this */
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/INTERCOM/constants';
import { loadNativeSdk } from './nativeSdkLoader';
import { flattenJsonPayload } from '../../utils/utils';
import { processNameField, processCompanyField, processIdentityVerificationProps } from './utils';

class INTERCOM {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.appId = config.appId;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.appId);
  }

  isLoaded() {
    return !!window.intercom_code;
  }

  isReady() {
    return !!window.intercom_code;
  }

  identify(rudderElement) {
    const { context, userId } = rudderElement.message;
    const { traits, Intercom } = context;

    const identityVerificationProps = Intercom || null;
    const rawPayload = processIdentityVerificationProps(identityVerificationProps);
    traits.name = processNameField(traits);

    // map rudderPayload to desired
    Object.keys(traits).forEach(field => {
      if (Object.prototype.hasOwnProperty.call(traits, field)) {
        const value = traits[field];
        switch (field) {
          case 'createdAt':
            rawPayload.created_at = value;
            rawPayload[field] = value;
            break;
          case 'anonymousId':
            rawPayload.user_id = value;
            rawPayload[field] = value;
            break;
          case 'company':
            rawPayload.companies = [processCompanyField(value)];
            break;
          case 'avatar':
            rawPayload.avatar = {
              type: 'avatar',
              image_url: value,
            };
            break;
          default:
            rawPayload[field] = value;
            break;
        }
      }
    });
    rawPayload.user_id = userId;
    window.Intercom('update', rawPayload);
  }

  track(rudderElement) {
    const rawPayload = {};
    const { message } = rudderElement;
    const { event, userId, anonymousId, originalTimestamp } = message;
    const properties = message?.properties || {};

    if (event) {
      rawPayload.event_name = event;
    }

    rawPayload.user_id = userId || anonymousId;

    Object.keys(properties).forEach(property => {
      const value = properties[property];
      if (value && typeof value !== 'object' && !Array.isArray(value)) {
        rawPayload[property] = value;
      } else if (value && typeof value === 'object') {
        Object.assign(rawPayload, flattenJsonPayload(value, property));
      }
    });

    rawPayload.created_at = Math.floor(new Date(originalTimestamp).getTime() / 1000);

    window.Intercom('trackEvent', rawPayload.event_name, rawPayload);
  }

  page() {
    // Get new messages of the current user
    window.Intercom('update');
  }
}

export { INTERCOM };
