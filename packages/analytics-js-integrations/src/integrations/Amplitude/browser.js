/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Amplitude/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';
import {
  getTraitsToSetOnce,
  getTraitsToIncrement,
  getDestinationOptions,
  getFieldsToUnset,
} from './utils';

const logger = new Logger(DISPLAY_NAME);

class Amplitude {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.analytics = analytics;
    this.apiKey = config.apiKey;
    this.residencyServer = config.residencyServer;
    this.trackAllPages = config.trackAllPages || false;
    this.trackNamedPages = config.trackNamedPages || false;
    this.trackCategorizedPages = config.trackCategorizedPages || false;
    this.attribution = config.attribution || false;
    this.flushQueueSize = config.eventUploadThreshold || 30;
    this.flushIntervalMillis = +config.eventUploadPeriodMillis || 1000;
    this.trackNewCampaigns = config.trackNewCampaigns || true;
    this.trackRevenuePerProduct = config.trackRevenuePerProduct || false;
    this.preferAnonymousIdForDeviceId = config.preferAnonymousIdForDeviceId || false;
    this.traitsToSetOnce = getTraitsToSetOnce(config);
    this.traitsToIncrement = getTraitsToIncrement(config);
    this.appendFieldsToEventProps = config.appendFieldsToEventProps || false;
    this.unsetParamsReferrerOnNewSession = config.unsetParamsReferrerOnNewSession || false;
    this.trackProductsOnce = config.trackProductsOnce || false;
    this.versionName = config.versionName;
    this.groupTypeTrait = config.groupTypeTrait;
    this.groupValueTrait = config.groupValueTrait;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    if (this.analytics.loadIntegration) {
      loadNativeSdk(window, document);
    }

    const initOptions = {
      attribution: { disabled: this.attribution, trackNewCampaigns: !this.trackNewCampaigns },
      flushQueueSize: this.flushQueueSize,
      flushIntervalMillis: this.flushIntervalMillis,
      appVersion: this.versionName,
    };

    // EU data residency
    // Relevant doc: https://www.docs.developers.amplitude.com/data/sdks/typescript-browser/#eu-data-residency
    if (this.residencyServer === 'EU') {
      initOptions.serverZone = 'EU';
    }

    if (
      navigator.userAgent.indexOf('MSIE') !== -1 ||
      navigator.appVersion.indexOf('Trident/') > -1
    ) {
      initOptions.transport = 'xhr';
    }
    if (this.preferAnonymousIdForDeviceId && this.analytics)
      initOptions.deviceId = this.analytics.getAnonymousId();
    window.amplitude.init(this.apiKey, null, initOptions);
  }

  isLoaded() {
    return Boolean(window.amplitude && window.amplitude.getDeviceId());
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    this.setDeviceId(rudderElement);

    // rudderElement.message.context will always be present as part of identify event payload.
    const { traits } = rudderElement.message.context;
    const { userId, integrations } = rudderElement.message;
    const fieldsToUnset = getFieldsToUnset(integrations);
    const amplitudeIdentify = new window.amplitude.Identify();
    let sendIdentifyCall = false;
    if (fieldsToUnset) {
      sendIdentifyCall = true;
      // AM Docs: https://amplitude.github.io/Amplitude-JavaScript/Identify/#identifyunset
      fieldsToUnset.forEach(fieldToUnset => {
        amplitudeIdentify.unset(fieldToUnset);
      });
    }
    if (userId) {
      window.amplitude.setUserId(userId);
    }

    if (traits) {
      sendIdentifyCall = true;
      Object.keys(traits).forEach(trait => {
        const shouldIncrement = this.traitsToIncrement.includes(trait);
        const shouldSetOnce = this.traitsToSetOnce.includes(trait);
        if (shouldIncrement) {
          amplitudeIdentify.add(trait, traits[trait]);
        }

        if (shouldSetOnce) {
          amplitudeIdentify.setOnce(trait, traits[trait]);
        }

        if (!shouldIncrement && !shouldSetOnce) {
          amplitudeIdentify.set(trait, traits[trait]);
        }
      });
    }
    if (sendIdentifyCall) {
      window.amplitude.identify(amplitudeIdentify);
    }
  }

  track(rudderElement) {
    this.setDeviceId(rudderElement);

    const { properties } = rudderElement.message;

    // message.properties will always be present as part of track event.
    const { products } = properties;

    const clonedTrackEvent = {};
    Object.assign(clonedTrackEvent, rudderElement.message);

    // For track products once, we will send the products in a single call.
    if (this.trackProductsOnce) {
      if (products && Array.isArray(products)) {
        // track all the products in a single event.
        const allProducts = [];

        const productKeys = Object.keys(products);
        for (let index = 0; index < productKeys.length; index += 1) {
          let product = {};
          product = this.getProductAttributes(products[index]);
          allProducts.push(product);
        }

        clonedTrackEvent.properties.products = allProducts;

        this.logEventAndCorrespondingRevenue(clonedTrackEvent, this.trackRevenuePerProduct); // we do not want to track revenue as a whole if trackRevenuePerProduct is enabled.

        // If trackRevenuePerProduct is enabled, track revenues per product.
        if (this.trackRevenuePerProduct) {
          const trackEventMessage = {};
          Object.assign(trackEventMessage, clonedTrackEvent);
          this.trackingEventAndRevenuePerProduct(trackEventMessage, products, false); // also track revenue only and not event per product.
        }
      } else {
        // track event and revenue as a whole as products array is not available.
        this.logEventAndCorrespondingRevenue(clonedTrackEvent, false);
      }
      return;
    }

    if (products && Array.isArray(products)) {
      // track events iterating over product array individually.

      // Log the actuall event without products array. We will subsequently track each product with 'Product Purchased' event.
      delete clonedTrackEvent.properties.products;
      this.logEventAndCorrespondingRevenue(clonedTrackEvent, this.trackRevenuePerProduct);

      const trackEventMessage = {};
      Object.assign(trackEventMessage, clonedTrackEvent);

      // track products and revenue per product basis.
      this.trackingEventAndRevenuePerProduct(trackEventMessage, products, true); // track both event and revenue on per product basis.
    } else {
      // track event and revenue as a whole as no product array is present.
      this.logEventAndCorrespondingRevenue(clonedTrackEvent, false);
    }
  }

  trackingEventAndRevenuePerProduct(trackEventMessage, products, shouldTrackEventPerProduct) {
    const eventMessage = trackEventMessage;
    let { revenueType } = eventMessage.properties;
    const { revenue, revenue_type: revenueTtype } = eventMessage.properties;
    revenueType = revenueType || revenueTtype;
    products.forEach(product => {
      eventMessage.properties = product;
      eventMessage.event = 'Product Purchased';
      if (this.trackRevenuePerProduct) {
        if (revenueType) {
          eventMessage.properties.revenueType = revenueType;
        }
        if (revenue) {
          eventMessage.properties.revenue = revenue;
        }
        this.trackRevenue(eventMessage);
      }
      if (shouldTrackEventPerProduct) {
        this.logEventAndCorrespondingRevenue(eventMessage, true);
      }
    });
  }

  // Always to be called for general and top level events (and not product level)
  // For these events we expect top level revenue property.
  logEventAndCorrespondingRevenue(rudderMessage, dontTrackRevenue) {
    const { properties, event } = rudderMessage;

    window.amplitude.track(event, properties);
    if (properties.revenue && !dontTrackRevenue) {
      this.trackRevenue(rudderMessage);
    }
  }

  /**
   * track page events base on destination settings. If more than one settings is enabled, multiple events may be logged for a single page event.
   * For example, if category of a page is present, and both trackAllPages and trackCategorizedPages are enabled, then 2 events will be tracked for
   * a single pageview - 'Loaded a page' and `Viewed page ${category}`.
   *
   * @memberof Amplitude
   */
  page(rudderElement) {
    this.setDeviceId(rudderElement);

    const { properties, name, category, integrations } = rudderElement.message;
    const amplitudeIntgConfig = getDestinationOptions(integrations);
    const useNewPageEventNameFormat = amplitudeIntgConfig?.useNewPageEventNameFormat || false;
    // all pages
    if (this.trackAllPages) {
      const event = 'Loaded a page';
      window.amplitude.track(event, properties);
    }

    // categorized pages
    if (category && this.trackCategorizedPages) {
      let event;
      if (!useNewPageEventNameFormat) event = `Viewed page ${category}`;
      else event = `Viewed ${category} Page`;
      window.amplitude.track(event, properties);
    }

    // named pages
    if (name && this.trackNamedPages) {
      let event;
      if (!useNewPageEventNameFormat) event = `Viewed page ${name}`;
      else event = `Viewed ${name} Page`;
      window.amplitude.track(event, properties);
    }
  }

  group(rudderElement) {
    this.setDeviceId(rudderElement);

    const { groupId, traits } = rudderElement.message;
    const { groupTypeTrait } = this;
    const { groupValueTrait } = this;
    let groupType;
    let groupValue;

    if (groupTypeTrait && groupValueTrait && traits) {
      groupType = traits[groupTypeTrait];
      groupValue = traits[groupValueTrait];
    }

    if (groupType && groupValue) {
      window.amplitude.setGroup(groupTypeTrait, groupValueTrait);
    } else if (groupId) {
      // Similar as segment but not sure whether we need it as our cloud mode supports only the above if block
      window.amplitude.setGroup('[Rudderstack] Group', groupId);
    }

    // https://developers.amplitude.com/docs/setting-user-properties#setting-group-properties
    // no other api for setting group properties for javascript
  }

  setDeviceId(rudderElement) {
    const { anonymousId } = rudderElement.message;
    if (this.preferAnonymousIdForDeviceId && anonymousId) {
      window.amplitude.setDeviceId(anonymousId);
    }
  }

  /**
   * Tracks revenue with logRevenueV2() api based on revenue/price present in event payload. If neither of revenue/price present, it returns.
   * The event payload may contain ruddermessage of an original track event payload (from trackEvent method) or it is derived from a product
   * array (from trackingRevenuePerProduct) in an e-comm event.
   *
   * @param {*} rudderMessage
   * @returns
   * @memberof Amplitude
   */
  trackRevenue(rudderMessage) {
    const mapRevenueType = {
      'order completed': 'Purchase',
      'completed order': 'Purchase',
      'product purchased': 'Purchase',
    };

    const { properties, event } = rudderMessage;
    let { price, productId, quantity } = properties;
    const { revenue, product_id: pId, revenue_type: revenueTtype } = properties;
    const revenueType =
      properties.revenueType || revenueTtype || mapRevenueType[event.toLowerCase()];

    productId = productId || pId;

    // If neither revenue nor price is present, then return
    // else send price and quantity from properties to amplitude
    // If price not present set price as revenue's value and force quantity to be 1.
    // Ultimately set quantity to 1 if not already present from above logic.
    if (!revenue && !price) {
      logger.error('Neither "revenue" nor "price" is available. Hence, aborting');
      return;
    }

    if (!price) {
      price = revenue;
      quantity = 1;
    }
    if (!quantity) {
      quantity = 1;
    }
    const amplitudeRevenue = new window.amplitude.Revenue()
      .setPrice(price)
      .setQuantity(quantity)
      .setEventProperties(properties);
    if (revenueType) {
      amplitudeRevenue.setRevenueType(revenueType);
    }

    if (productId) {
      amplitudeRevenue.setProductId(productId);
    }
    if (amplitudeRevenue._properties) {
      delete amplitudeRevenue._properties.price;
      delete amplitudeRevenue._properties.productId;
      delete amplitudeRevenue._properties.quantity;
    }
    window.amplitude.revenue(amplitudeRevenue);
  }

  getProductAttributes(product) {
    return {
      productId: product.productId || product.product_id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      category: product.category,
    };
  }
}

export default Amplitude;
