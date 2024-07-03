/* eslint-disable func-names */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import each from '@ndhoule/each';
import sha256 from 'crypto-js/sha256';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  NAME,
  traitsMapper,
  reserveTraits,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/FacebookPixel/constants';
import Logger from '../../utils/logger';
import {
  merge,
  getEventId,
  buildPayLoad,
  getHashedStatus,
  eventHelpers,
  formatRevenue,
  getContentType,
  getContentCategory,
  getProductContentAndId,
  getProductListViewedEventParams,
  getProductsContentsAndContentIds,
} from './utils';
import { getHashFromArray } from '../../utils/commonUtils';
import { constructPayload } from '../../utils/utils';

const logger = new Logger(DISPLAY_NAME);

class FacebookPixel {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.autoConfig = config.autoConfig === undefined ? true : config.autoConfig;
    this.blacklistPiiProperties = config.blacklistPiiProperties;
    this.categoryToContent = config.categoryToContent || [];
    this.pixelId = config.pixelId;
    this.eventsToEvents = config.eventsToEvents;
    this.valueFieldIdentifier = config.valueFieldIdentifier;
    this.advancedMapping = config.advancedMapping;
    this.traitKeyToExternalId = config.traitKeyToExternalId;
    this.legacyConversionPixelId = config.legacyConversionPixelId || [];
    this.userIdAsPixelId = config.userIdAsPixelId || [];
    this.whitelistPiiProperties = config.whitelistPiiProperties;
    this.useUpdatedMapping = config.useUpdatedMapping;
    this.name = NAME;
    this.analytics = analytics;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    window._fbq = function () {
      if (window.fbq.callMethod) {
        window.fbq.callMethod.apply(window.fbq, arguments);
      } else {
        window.fbq.queue.push(arguments);
      }
    };

    window.fbq = window.fbq || window._fbq;
    window.fbq.push = window.fbq;
    window.fbq.loaded = true;
    window.fbq.disablePushState = true; // disables automatic pageview tracking
    window.fbq.allowDuplicatePageViews = true; // enables fb
    window.fbq.version = '2.0';
    window.fbq.queue = [];
    window.fbq('set', 'autoConfig', this.autoConfig, this.pixelId); // toggle autoConfig : sends button click and page metadata
    if (this.advancedMapping) {
      if (this.useUpdatedMapping) {
        const userData = {
          context: {
            traits: { ...this.analytics.getUserTraits() },
          },
          userId: this.analytics.getUserId(),
          anonymousId: this.analytics.getAnonymousId(),
        };

        const userPayload = constructPayload(userData, traitsMapper);
        // here we are sending other traits apart from the reserved ones.
        reserveTraits.forEach(element => {
          delete userData.context?.traits[element];
        });

        this.userPayload = { ...userPayload, ...userData.context.traits };

        if (this.userPayload.external_id) {
          this.userPayload.external_id = sha256(this.userPayload.external_id).toString();
        }
      } else {
        this.userPayload = { ...this.analytics.getUserTraits() };
      }
      window.fbq('init', this.pixelId, this.userPayload);
    } else {
      window.fbq('init', this.pixelId);
    }
    ScriptLoader('fbpixel-integration', 'https://connect.facebook.net/en_US/fbevents.js');
  }

  isLoaded() {
    return !!(window.fbq && window.fbq.callMethod);
  }

  isReady() {
    return this.isLoaded();
  }

  page(rudderElement) {
    const { properties } = rudderElement.message;
    window.fbq('track', 'PageView', properties, {
      eventID: getEventId(rudderElement.message),
    });
  }

  track(rudderElement) {
    const { event } = rudderElement.message;
    const properties = eventHelpers.getProperties(rudderElement.message);
    const {
      id,
      sku,
      name,
      price,
      query,
      revenue,
      products,
      quantity,
      contentName,
      product_id: productId,
      product_name: productName,
      delivery_category: deliveryCategory,
      content_type: contentType,
    } = properties;
    let { value, category, currency } = properties;

    const revValue = formatRevenue(revenue);
    eventHelpers.validateRevenue(revValue);
    currency = eventHelpers.getCurrency(currency);
    const payload = buildPayLoad(
      rudderElement,
      this.whitelistPiiProperties,
      this.blacklistPiiProperties,
      getHashedStatus(rudderElement.message),
    );

    const standard = this.eventsToEvents;
    const legacy = this.legacyConversionPixelId;
    const standardTo = getHashFromArray(standard);
    const legacyTo = getHashFromArray(legacy);
    const useValue = this.valueFieldIdentifier === 'properties.value';
    const prodId = eventHelpers.getProdId(productId, sku, id);
    value = eventHelpers.getFormattedRevenue(revValue, value);
    // check for category data type
    if (category && !getContentCategory(category)) {
      return;
    }
    category = getContentCategory(category);
    const derivedEventID = getEventId(rudderElement.message);

    if (event === 'Product List Viewed') {
      const {
        contentIds,
        contentType: defaultContentType,
        contents,
      } = getProductListViewedEventParams(properties);

      const productInfo = {
        content_ids: contentIds,
        content_type:
          contentType || getContentType(rudderElement, defaultContentType, this.categoryToContent),
        contents,
        content_category: eventHelpers.getCategory(category),
        content_name: contentName,
        value,
        currency,
      };

      this.makeTrackSignalCall(
        this.pixelId,
        'ViewContent',
        merge(productInfo, payload),
        derivedEventID,
      );
      this.makeTrackSignalCalls(this.pixelId, event, legacyTo, derivedEventID, {
        currency,
        value: revValue,
      });
    } else if (event === 'Product Viewed' || event === 'Product Added') {
      const { contents, contentIds } = getProductContentAndId(prodId, quantity, price);

      const productInfo = {
        content_ids: contentIds,
        content_type:
          contentType || getContentType(rudderElement, 'product', this.categoryToContent),
        content_name: eventHelpers.getProdName(productName, name),
        content_category: eventHelpers.getCategory(category),
        currency,
        value: eventHelpers.getValue(useValue, value, price),
        contents,
      };

      this.makeTrackSignalCall(
        this.pixelId,
        eventHelpers.getEventName(event),
        merge(productInfo, payload),
        derivedEventID,
      );
      this.makeTrackSignalCalls(this.pixelId, event, legacyTo, derivedEventID, {
        currency,
        value: productInfo.value,
      });
    } else if (event === 'Order Completed') {
      const { contents, contentIds } = getProductsContentsAndContentIds(
        products,
        quantity,
        price,
        deliveryCategory,
      );

      // ref: https://developers.facebook.com/docs/meta-pixel/implementation/marketing-api#purchase
      // "trackSingle" feature is :
      // https://developers.facebook.com/ads/blog/post/v2/2017/11/28/event-tracking-with-multiple-pixels-tracksingle/

      const productInfo = {
        content_ids: contentIds,
        content_type:
          contentType || getContentType(rudderElement, 'product', this.categoryToContent),
        currency,
        value: revValue,
        contents,
        num_items: contentIds.length,
        content_name: contentName,
      };

      this.makeTrackSignalCall(
        this.pixelId,
        'Purchase',
        merge(productInfo, payload),
        derivedEventID,
      );
      this.makeTrackSignalCalls(this.pixelId, event, legacyTo, derivedEventID, {
        currency,
        value: revValue,
      });
    } else if (event === 'Products Searched') {
      const { contents, contentIds } = getProductContentAndId(prodId, quantity, price);

      const productInfo = {
        content_ids: contentIds,
        content_category: eventHelpers.getCategory(category),
        currency,
        value,
        contents,
        search_string: query,
      };

      this.makeTrackSignalCall(this.pixelId, 'Search', merge(productInfo, payload), derivedEventID);
      this.makeTrackSignalCalls(this.pixelId, event, legacyTo, derivedEventID, { currency, value });
    } else if (event === 'Checkout Started') {
      let contentCategory = category;
      const { contents, contentIds } = getProductsContentsAndContentIds(products, quantity, price);
      if (Array.isArray(products) && !contentCategory && products[0] && products[0].category) {
        contentCategory = products[0].category;
      }

      const productInfo = {
        content_ids: contentIds,
        content_type:
          contentType || getContentType(rudderElement, 'product', this.categoryToContent),
        content_category: contentCategory,
        currency,
        value: revValue,
        contents,
        num_items: contentIds.length,
      };

      this.makeTrackSignalCall(
        this.pixelId,
        'InitiateCheckout',
        merge(productInfo, payload),
        derivedEventID,
      );
      this.makeTrackSignalCalls(this.pixelId, event, legacyTo, derivedEventID, {
        currency,
        value: revValue,
      });
    } else if (eventHelpers.isCustomEventNotMapped(standardTo, legacyTo, event)) {
      payload.value = revValue;
      window.fbq('trackSingleCustom', this.pixelId, event, payload, {
        eventID: derivedEventID,
      });
    } else {
      logger.info('Not standard event & no custom mapping available');
      payload.value = revValue;
      payload.currency = currency;
      this.makeTrackSignalCalls(this.pixelId, event, standardTo, derivedEventID, payload);
      this.makeTrackSignalCalls(this.pixelId, event, legacyTo, derivedEventID, {
        currency,
        value: revValue,
      });
    }
  }

  makeTrackSignalCalls(pixelId, event, array, derivedEventID, payload) {
    each((val, key) => {
      if (key === event.toLowerCase()) {
        window.fbq('trackSingle', pixelId, val, payload, {
          eventID: derivedEventID,
        });
      }
    }, array);
  }

  makeTrackSignalCall(pixelId, event, payload, derivedEventID) {
    window.fbq('trackSingle', pixelId, event, payload, {
      eventID: derivedEventID,
    });
  }
}

export default FacebookPixel;
