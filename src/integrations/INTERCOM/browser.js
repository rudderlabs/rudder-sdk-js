/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import { NAME } from './constants';
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
    this.API_KEY = config.apiKey;
    this.APP_ID = config.appId;
    this.MOBILE_APP_ID = config.mobileAppId;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    loadNativeSdk(this.APP_ID);
  }

  isLoaded() {
    return !!window.intercom_code;
  }

  isReady() {
    return !!window.intercom_code;
  }

  identify(rudderElement) {
    const { context, userId } = rudderElement.message;
    const identityVerificationProps = context.Intercom || null;
    const rawPayload = processIdentityVerificationProps(identityVerificationProps);
    context.traits.name = processNameField(context.traits);

    // map rudderPayload to desired
    Object.keys(context.traits).forEach((field) => {
      if (context.traits[field]) {
        const value = context.traits[field];
        switch (field) {
          case 'createdAt':
            rawPayload.created_at = value;
            rawPayload[field] = context.traits[field];
            break;
          case 'anonymousId':
            rawPayload.user_id = value;
            rawPayload[field] = context.traits[field];
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
            rawPayload[field] = context.traits[field];
            break;
        }
      }
    });
    rawPayload.user_id = userId;
    window.Intercom('update', rawPayload);
  }

  track(rudderElement) {
    const rawPayload = {};
    const { event, userId, anonymousId, properties, originalTimestamp } = rudderElement.message;

    if (event) {
      rawPayload.event_name = event;
    }

    rawPayload.user_id = userId || anonymousId;

    Object.keys(properties).forEach((property) => {
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
