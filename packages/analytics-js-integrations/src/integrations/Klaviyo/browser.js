/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import get from 'get-value';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Klaviyo/constants';
import Logger from '../../utils/logger';
import { extractCustomFields, getDefinedTraits } from '../../utils/utils';
import ecommEventPayload from './util';
import { isNotEmpty } from '../../utils/commonUtils';

const logger = new Logger(DISPLAY_NAME);

class Klaviyo {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.publicApiKey = config.publicApiKey;
    this.sendPageAsTrack = config.sendPageAsTrack;
    this.additionalPageInfo = config.additionalPageInfo;
    this.enforceEmailAsPrimary = config.enforceEmailAsPrimary;
    this.name = NAME;
    this.keysToExtract = ['context.traits'];
    this.exclusionKeys = [
      'email',
      'E-mail',
      'Email',
      'firstName',
      'firstname',
      'first_name',
      'lastName',
      'lastname',
      'last_name',
      'phone',
      'Phone',
      'title',
      'organization',
      'city',
      'City',
      'region',
      'country',
      'Country',
      'zip',
      'image',
      'timezone',
      'anonymousId',
      'userId',
      'properties',
    ];
    this.ecomExclusionKeys = [
      'name',
      'product_id',
      'sku',
      'image_url',
      'url',
      'brand',
      'price',
      'compare_at_price',
      'quantity',
      'categories',
      'products',
      'product_names',
      'order_id',
      'value',
      'checkout_url',
      'item_names',
      'items',
      'checkout_url',
    ];
    this.ecomEvents = ['product viewed', 'product clicked', 'product added', 'checkout started'];
    this.eventNameMapping = {
      'product viewed': 'Viewed Product',
      'product clicked': 'Viewed Product',
      'product added': 'Added to Cart',
      'checkout started': 'Started Checkout',
    };
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    ScriptLoader(
      'klaviyo-integration',
      `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${this.publicApiKey}`,
    );
  }

  isLoaded() {
    return !!(window._learnq && window._learnq.push !== Array.prototype.push);
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    if (!(message.context && message.context.traits)) {
      logger.error('user traits not present');
      return;
    }

    const { userId, email, phone, firstName, lastName, city, country, state } =
      getDefinedTraits(message);

    let payload = {
      $id: userId,
      $email: email,
      $phone_number: phone,
      $first_name: firstName,
      $last_name: lastName,
      $city: city,
      $country: country,
      $organization: get(message, 'context.traits.organization'),
      $title: get(message, 'context.traits.title'),
      $region: get(message, 'context.traits.region') || state,
      $zip: get(message, 'context.traits.zip') || get(message, 'context.traits.address.postalCode'),
      $address1: get(message, 'context.traits.address.street'),
    };
    if (!payload.$email && !payload.$phone_number && !payload.$id) {
      logger.error('user id, phone or email not present');
      return;
    }
    if (this.enforceEmailAsPrimary) {
      delete payload.$id;
      payload._id = userId;
    }
    // Extract other K-V property from traits about user custom properties
    try {
      payload = extractCustomFields(message, payload, this.keysToExtract, this.exclusionKeys);
    } catch (err) {
      logger.error(`Error occured at extractCustomFields ${err}`);
    }
    window._learnq.push(['identify', payload]);
  }

  track(rudderElement) {
    const { message } = rudderElement;
    const properties = message?.properties || {};

    const event = message.event ? message.event.trim().toLowerCase() : message.event;
    if (this.ecomEvents.includes(event)) {
      let payload = ecommEventPayload(this.eventNameMapping[event], message);
      const eventName = this.eventNameMapping[event];
      const customProperties = extractCustomFields(
        message,
        {},
        ['properties'],
        this.ecomExclusionKeys,
      );
      if (isNotEmpty(customProperties)) {
        payload = { ...payload, ...customProperties };
      }
      if (isNotEmpty(payload)) {
        window._learnq.push(['track', eventName, payload]);
      }
    } else {
      const propsPayload = properties;
      if (propsPayload.revenue) {
        propsPayload.$value = propsPayload.revenue;
        delete propsPayload.revenue;
      }
      window._learnq.push(['track', event, propsPayload]);
    }
  }

  page(rudderElement) {
    const { message } = rudderElement;
    const properties = message?.properties || {};
    if (this.sendPageAsTrack) {
      let eventName;
      if (properties?.category && message.name) {
        eventName = `Viewed ${properties.category} ${message.name} page`;
      } else if (message.name) {
        eventName = `Viewed ${message.name} page`;
      } else {
        eventName = 'Viewed a Page';
      }
      if (this.additionalPageInfo && message.properties) {
        window._learnq.push(['track', `${eventName}`, message.properties]);
      } else {
        window._learnq.push(['track', `${eventName}`]);
      }
    } else {
      window._learnq.push(['track']);
    }
  }
}

export default Klaviyo;
