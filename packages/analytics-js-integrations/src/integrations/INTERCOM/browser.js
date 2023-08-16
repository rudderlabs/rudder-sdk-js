/* eslint-disable class-methods-use-this */
import md5 from 'md5';
import { logger } from '@rudderstack/analytics-js-common/utilsV1/logUtil';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/utilsV1/constants';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/INTERCOM/constants';
import { flattenJsonPayload } from '../../utils/utils';

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
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    window.intercomSettings = {
      app_id: this.APP_ID,
    };

    (function () {
      const w = window;
      const ic = w.Intercom;
      if (typeof ic === 'function') {
        ic('reattach_activator');
        ic('update', w.intercomSettings);
      } else {
        const d = document;
        var i = function () {
          i.c(arguments);
        };
        i.q = [];
        i.c = function (args) {
          i.q.push(args);
        };
        w.Intercom = i;
        const l = function () {
          const s = d.createElement('script');
          s.setAttribute('data-loader', LOAD_ORIGIN);
          s.type = 'text/javascript';
          s.async = true;
          s.src = `https://widget.intercom.io/widget/${window.intercomSettings.app_id}`;
          const x = d.getElementsByTagName('script')[0];
          x.parentNode.insertBefore(s, x);
        };
        if (document.readyState === 'complete') {
          l();
          window.intercom_code = true;
        } else if (w.attachEvent) {
          w.attachEvent('onload', l);
          window.intercom_code = true;
        } else {
          w.addEventListener('load', l, false);
          window.intercom_code = true;
        }
      }
    })();
  }

  page() {
    // Get new messages of the current user
    window.Intercom('update');
  }

  identify(rudderElement) {
    const rawPayload = {};
    const { context } = rudderElement.message;

    const identityVerificationProps = context.Intercom ? context.Intercom : null;
    if (identityVerificationProps != null) {
      // user hash
      const userHash = context.Intercom.user_hash ? context.Intercom.user_hash : null;

      if (userHash != null) {
        rawPayload.user_hash = userHash;
      }

      // hide default launcher
      const hideDefaultLauncher = context.Intercom.hideDefaultLauncher
        ? context.Intercom.hideDefaultLauncher
        : null;

      if (hideDefaultLauncher != null) {
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
    Object.keys(context.traits).forEach(field => {
      if (context.traits.hasOwnProperty(field)) {
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
              companyFields.forEach(key => {
                if (companyFields.includes(key)) {
                  if (key != 'id') {
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
            {
              rawPayload.avatar = {};
              rawPayload.avatar.type = 'avatar';
              rawPayload.avatar.image_url = value;
            }
            break;
          default:
            rawPayload[field] = context.traits[field];
            break;
        }
      }
    });
    rawPayload.user_id = rudderElement.message.userId;
    window.Intercom('update', rawPayload);
  }

  track(rudderElement) {
    const rawPayload = {};
    const { message } = rudderElement;

    const properties = message.properties ? Object.keys(message.properties) : null;
    properties.forEach(property => {
      const value = message.properties[property];
      if (value && typeof value !== 'object' && !Array.isArray(value)) {
        rawPayload[property] = value;
      } else if (value && typeof value === 'object') {
        Object.assign(rawPayload, flattenJsonPayload(value, property));
      }
    });

    if (message.event) {
      rawPayload.event_name = message.event;
    }
    rawPayload.user_id = message.userId ? message.userId : message.anonymousId;
    rawPayload.created_at = Math.floor(new Date(message.originalTimestamp).getTime() / 1000);
    window.Intercom('trackEvent', rawPayload.event_name, rawPayload);
  }

  isLoaded() {
    return !!window.intercom_code;
  }

  isReady() {
    return !!window.intercom_code;
  }
}

export { INTERCOM };
