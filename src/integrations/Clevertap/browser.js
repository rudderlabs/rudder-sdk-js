/* eslint-disable class-methods-use-this */
import get from 'get-value';
import logger from '../../utils/logUtil';
import ScriptLoader from '../../utils/ScriptLoader';
import { extractCustomFields, getDefinedTraits, isArray, isObject } from '../../utils/utils';
import { NAME } from './constants';

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
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init Clevertap===');
    // START-NO-SONAR-SCAN
    // disabled sonar scan here as http endpoint is discouraged by sonar
    const sourceUrl =
      document.location.protocol === 'https:'
        ? 'https://d2r1yp2w7bby2u.cloudfront.net/js/clevertap.min.js'
        : 'http://static.clevertap.com/js/clevertap.min.js';
    // END-NO-SONAR-SCAN

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
    const { CLEVERTAP } = this.analytics.loadOnlyIntegrations;
    if (CLEVERTAP) {
      this.optOut = CLEVERTAP.optOut;
      this.useIP = CLEVERTAP.useIP;
    }
    window.clevertap.enablePersonalization = true;
    window.clevertap.privacy.push({ optOut: this.optOut || false });
    window.clevertap.privacy.push({ useIP: this.useIP || false });
    window.clevertap.account.push({ id: this.accountId });
    if (this.region && this.region !== 'none') {
      window.clevertap.region.push(this.region);
    }

    ScriptLoader('clevertap-integration', sourceUrl);
  }

  isLoaded() {
    logger.debug('in clevertap isLoaded');
    return !!window.clevertap && window.clevertap.logout !== undefined;
  }

  isReady() {
    logger.debug('in clevertap isReady');
    return !!window.clevertap && window.clevertap.logout !== undefined;
  }

  identify(rudderElement) {
    logger.debug('in clevertap identify');

    const { message } = rudderElement;
    if (!(message.context && message.context.traits)) {
      logger.error('user traits not present');
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
      logger.debug(`Error occured at extractCustomFields ${err}`);
    }
    Object.keys(payload).forEach((key) => {
      if (isObject(payload[key])) {
        logger.debug('cannot process, unsupported traits');
      }
    });
    window.clevertap.onUserLogin.push({
      Site: payload,
    });
  }

  track(rudderElement) {
    logger.debug('in clevertap track');
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
          logger.debug(`Error occured at extractCustomFields ${err}`);
        }
        window.clevertap.event.push('Charged', ecomProperties);
      } else {
        Object.keys(properties).forEach((key) => {
          if (isObject(properties[key]) || isArray(properties[key])) {
            logger.debug('cannot process, unsupported event');
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
    logger.debug('in clevertap page');
    const { name, properties } = rudderElement.message;
    let eventName;
    if (properties && properties.category && name) {
      eventName = `WebPage Viewed ${name} ${properties.category}`;
    } else if (name) {
      eventName = `WebPage Viewed ${name}`;
    } else {
      eventName = 'WebPage Viewed';
    }
    if (properties) {
      Object.keys(properties).forEach((key) => {
        if (isObject(properties[key]) || isArray(properties[key])) {
          logger.debug('cannot process, unsupported event');
        }
      });
      window.clevertap.event.push(eventName, properties);
    } else {
      window.clevertap.event.push(eventName);
    }
  }
}

export default Clevertap;
