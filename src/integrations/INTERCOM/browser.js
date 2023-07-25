/* eslint-disable prefer-rest-params */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable class-methods-use-this */
import md5 from 'md5';
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { flattenJsonPayload } from '../../utils/utils';
import { loadNativeSdk } from './nativeSdkLoader';

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
    const rawPayload = {};
    const { context, userId } = rudderElement.message;

    const identityVerificationProps = context.Intercom || null;

    if (identityVerificationProps) {
      // user hash
      const userHash = context.Intercom.user_hash || null;

      if (userHash) {
        rawPayload.user_hash = userHash;
      }

      // hide default launcher
      const hideDefaultLauncher = context.Intercom.hideDefaultLauncher || null;

      if (hideDefaultLauncher) {
        rawPayload.hide_default_launcher = hideDefaultLauncher;
      }
    }

    // populate name if firstname and lastname is populated
    // if name is not set
    const { firstName, lastName, name } = context.traits;
    if (!name && (firstName || lastName)) {
      context.traits.name = `${firstName} ${lastName}`.trim();
    }

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
            {
              const companies = [];
              const company = {};
              // special handling string
              if (typeof context.traits[field] === 'string') {
                company.company_id = md5(context.traits[field]);
              }
              const companyFields =
                (typeof context.traits[field] === 'object' && Object.keys(context.traits[field])) ||
                [];
              companyFields.forEach((key) => {
                if (companyFields.includes(key)) {
                  if (key !== 'id') {
                    company[key] = context.traits[field][key];
                  } else {
                    company.company_id = context.traits[field][key];
                  }
                }
              });

              if (typeof context.traits[field] === 'object' && !companyFields.includes('id')) {
                company.company_id = md5(company.name);
              }

              companies.push(company);
              rawPayload.companies = companies;
            }
            break;
          case 'avatar':
            rawPayload.avatar = {};
            rawPayload.avatar.type = 'avatar';
            rawPayload.avatar.image_url = value;
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
