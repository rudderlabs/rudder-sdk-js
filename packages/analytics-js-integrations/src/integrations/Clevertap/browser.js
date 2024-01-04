/* eslint-disable class-methods-use-this */
import get from 'get-value';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Clevertap/constants';
import Logger from '../../utils/logger';
import { getDestinationOptions } from './utils';
import { extractCustomFields, getDefinedTraits, isArray, isObject } from '../../utils/utils';

const logger = new Logger(DISPLAY_NAME);

class Clevertap {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.accountId = config.accountId;
    this.apiKey = config.passcode;
    this.name = NAME;
    this.region = config.region;
    this.keysToExtract = ['context.traits'];
    this.exclusionKeys = [
      'email',
      'E-mail',
      'Email',
      'phone',
      'Phone',
      'name',
      'Name',
      'gender',
      'Gender',
      'birthday',
      'Birthday',
      'anonymousId',
      'userId',
      'lastName',
      'lastname',
      'last_name',
      'firstName',
      'firstname',
      'first_name',
      'employed',
      'education',
      'married',
      'customerType',
    ];
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    const sourceUrl =
      document.location.protocol === 'https:'
        ? 'https://d2r1yp2w7bby2u.cloudfront.net/js/clevertap.min.js'
        : 'http://static.clevertap.com/js/clevertap.min.js';

    window.clevertap = {
      event: [],
      profile: [],
      account: [],
      onUserLogin: [],
      notifications: [],
      privacy: [],
    };
    /*
      Clevertap documentation: https://developer.clevertap.com/docs/web-quickstart-guide#integrate-sdk
    */
    const clevertapIntgConfig = getDestinationOptions(this.analytics.loadOnlyIntegrations);
    if (clevertapIntgConfig) {
      this.optOut = clevertapIntgConfig.optOut;
      this.useIP = clevertapIntgConfig.useIP;
    }
    window.clevertap.enablePersonalization = true;
    window.clevertap.privacy.push({ optOut: this.optOut || false });
    window.clevertap.privacy.push({ useIP: this.useIP || false });
    window.clevertap.account.push({ id: this.accountId });
    if (this.region && this.region !== 'none') {
      window.clevertap.region = this.region;
    }

    ScriptLoader('clevertap-integration', sourceUrl);
  }

  isLoaded() {
    return !!window.clevertap && window.clevertap.logout !== undefined;
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { context } = message;
    if (!context?.traits) {
      logger.error('user traits is not present');
      return;
    }
    const { userId, email, phone, name } = getDefinedTraits(message);
    let payload = {
      Name: name,
      Identity: userId,
      Email: email,
      Phone: phone,
      Gender: get(message, 'context.traits.gender'),
      DOB: get(message, 'context.traits.birthday'),
      Photo: get(message, 'context.traits.avatar'),
      Employed: get(message, 'context.traits.employed'),
      Education: get(message, 'context.traits.education'),
      Married: get(message, 'context.traits.married'),
      'Customer Type': get(message, 'context.traits.customerType'),
    };

    // with the exception of one of Identity, Email, or FBID (in Identity)
    // other fields are optional
    if (!userId && !email) {
      logger.error('Either out of userId or email is required');
      return;
    }

    // Extract other K-V property from traits about user custom properties
    try {
      payload = extractCustomFields(message, payload, this.keysToExtract, this.exclusionKeys);
    } catch (err) {
      logger.error(`Error occured at extractCustomFields ${err}`);
    }
    Object.keys(payload).forEach(key => {
      if (isObject(payload[key])) {
        logger.info(`cannot process, unsupported traits - ${payload[key]}`);
      }
    });
    window.clevertap.onUserLogin.push({
      Site: payload,
    });
  }

  track(rudderElement) {
    const { event, properties } = rudderElement.message;
    if (properties) {
      if (event === 'Order Completed') {
        let ecomProperties = {
          'Charged ID': properties.checkout_id,
          Amount: properties.revenue,
          Items: properties.products,
        };
        // Extract other K-V property from traits about user custom properties
        try {
          ecomProperties = extractCustomFields(
            rudderElement.message,
            ecomProperties,
            ['properties'],
            ['checkout_id', 'revenue', 'products'],
          );
        } catch (err) {
          logger.error(`Error occured at extractCustomFields ${err}`);
        }
        window.clevertap.event.push('Charged', ecomProperties);
      } else {
        Object.keys(properties).forEach(key => {
          if (isObject(properties[key]) || isArray(properties[key])) {
            logger.info(`cannot process, unsupported event - ${properties[key]}`);
          }
        });
        window.clevertap.event.push(event, properties);
      }
    } else if (event === 'Order Completed') {
      window.clevertap.event.push('Charged');
    } else {
      window.clevertap.event.push(event);
    }
  }

  page(rudderElement) {
    const { name, properties } = rudderElement.message;
    let eventName;
    if (properties?.category && name) {
      eventName = `WebPage Viewed ${name} ${properties.category}`;
    } else if (name) {
      eventName = `WebPage Viewed ${name}`;
    } else {
      eventName = 'WebPage Viewed';
    }
    if (properties) {
      Object.keys(properties).forEach(key => {
        if (isObject(properties[key]) || isArray(properties[key])) {
          logger.info(`cannot process, unsupported event - ${properties[key]}`);
        }
      });
      window.clevertap.event.push(eventName, properties);
    } else {
      window.clevertap.event.push(eventName);
    }
  }
}

export default Clevertap;
