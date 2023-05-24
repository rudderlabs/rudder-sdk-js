import is from 'is';
import each from '@ndhoule/each';
import sha256 from 'crypto-js/sha256';
import ScriptLoader from '../ScriptLoader';
import logger from '../../utils/logUtil';
import { getEventId, getContentCategory } from './utils';
import { getHashFromArray, isDefined } from '../utils/commonUtils';
import { NAME, traitsMapper, reserveTraits } from './constants';
import { constructPayload } from '../../utils/utils';

class FacebookPixel {
  constructor(config, analytics) {
    this.analytics = analytics;
    this.blacklistPiiProperties = config.blacklistPiiProperties;
    this.categoryToContent = config.categoryToContent;
    this.pixelId = config.pixelId;
    this.eventsToEvents = config.eventsToEvents;
    this.valueFieldIdentifier = config.valueFieldIdentifier;
    this.advancedMapping = config.advancedMapping;
    this.traitKeyToExternalId = config.traitKeyToExternalId;
    this.legacyConversionPixelId = config.legacyConversionPixelId;
    this.userIdAsPixelId = config.userIdAsPixelId;
    this.whitelistPiiProperties = config.whitelistPiiProperties;
    this.useUpdatedMapping = config.useUpdatedMapping;
    this.name = NAME;
  }
  // START-NO-SONAR-SCAN
  /* eslint-disable */
  init() {
    if (this.categoryToContent === undefined) {
      this.categoryToContent = [];
    }
    if (this.legacyConversionPixelId === undefined) {
      this.legacyConversionPixelId = [];
    }
    if (this.userIdAsPixelId === undefined) {
      this.userIdAsPixelId = [];
    }

    logger.debug('===in init FbPixel===');

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
        reserveTraits.forEach((element) => {
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
  /* eslint-enable */
  // END-NO-SONAR-SCAN
  /* eslint-disable sonarjs/no-redundant-jump */
  /* eslint-disable no-useless-return */
  /* eslint-disable no-continue */
  /* eslint-disable sonarjs/cognitive-complexity */
  /* eslint-disable no-prototype-builtins */
  /* eslint-disable no-restricted-syntax */
  /* eslint-disable class-methods-use-this */

  isLoaded() {
    logger.debug('in FBPixel isLoaded');
    return !!(window.fbq && window.fbq.callMethod);
  }

  isReady() {
    logger.debug('in FBPixel isReady');
    return !!(window.fbq && window.fbq.callMethod);
  }

  page(rudderElement) {
    const { properties } = rudderElement.message;
    window.fbq('track', 'PageView', properties, {
      eventID: getEventId(rudderElement.message),
    });
  }

  // eslint-disable-next-line no-unused-vars
  identify(rudderElement) {
    logger.error('Identify is deprecated for Facebook Pixel');
    return;
  }
  // disable sonarjs/cognitive-complexity for this function
  // as it is a complex function and needs to be refactored later

  track(rudderElement) {
    const self = this;
    const { event, properties } = rudderElement.message;
    let revValue;
    let currVal;
    if (properties) {
      const { revenue, currency } = properties;
      revValue = this.formatRevenue(revenue);
      if (!isDefined(revValue)) {
        logger.error("'properties.revenue' could not be converted to a number");
      }
      currVal = currency || 'USD';
    }
    const payload = this.buildPayLoad(rudderElement);

    if (this.categoryToContent === undefined) {
      this.categoryToContent = [];
    }
    if (this.legacyConversionPixelId === undefined) {
      this.legacyConversionPixelId = [];
    }
    if (this.userIdAsPixelId === undefined) {
      this.userIdAsPixelId = [];
    }

    const standard = this.eventsToEvents;
    const legacy = this.legacyConversionPixelId;
    const standardTo = getHashFromArray(standard);
    const legacyTo = getHashFromArray(legacy);
    const useValue = this.valueFieldIdentifier === 'properties.value';
    let products;
    let quantity;
    let category;
    let prodId;
    let prodName;
    let value;
    let price;
    let query;
    let contentName;
    if (properties) {
      products = properties.products;
      quantity = properties.quantity;
      category = properties.category;
      prodId = properties.product_id || properties.sku || properties.id;
      prodName = properties.product_name || properties.name;
      value = revValue || this.formatRevenue(properties.value);
      price = properties.price;
      query = properties.query;
      contentName = properties.contentName;
    }

    // check for category data type
    if (category && !getContentCategory(category)) {
      return;
    }
    category = getContentCategory(category);
    const customProperties = this.buildPayLoad(rudderElement);
    const derivedEventID = getEventId(rudderElement.message);
    if (event === 'Product List Viewed') {
      let contentType;
      const contentIds = [];
      const contents = [];

      if (Array.isArray(products)) {
        products.forEach((product) => {
          if (product) {
            const productId = product.product_id || product.sku || product.id;
            if (isDefined(productId)) {
              contentIds.push(productId);
              contents.push({
                id: productId,
                quantity: product.quantity || quantity || 1,
                item_price: product.price,
              });
            }
          }
        });
      }

      if (contentIds.length > 0) {
        contentType = 'product';
      } else if (category) {
        contentIds.push(category);
        contents.push({
          id: category,
          quantity: 1,
        });
        contentType = 'product_group';
      }

      window.fbq(
        'trackSingle',
        self.pixelId,
        'ViewContent',
        this.merge(
          {
            content_ids: contentIds,
            content_type: this.getContentType(rudderElement, contentType),
            contents,
            content_category: category || '',
            content_name: contentName,
            value,
            currency: currVal,
          },
          customProperties,
        ),
        {
          eventID: derivedEventID,
        },
      );
      each((val, key) => {
        if (key === event.toLowerCase()) {
          window.fbq(
            'trackSingle',
            self.pixelId,
            val,
            {
              currency: currVal,
              value,
            },
            {
              eventID: derivedEventID,
            },
          );
        }
      }, legacyTo);
    } else if (event === 'Product Viewed') {
      window.fbq(
        'trackSingle',
        self.pixelId,
        'ViewContent',
        this.merge(
          {
            content_ids: [prodId],
            content_type: this.getContentType(rudderElement, 'product'),
            content_name: prodName || '',
            content_category: category || '',
            currency: currVal,
            value: useValue ? value : this.formatRevenue(price),
            contents: [
              {
                id: prodId,
                quantity,
                item_price: price,
              },
            ],
          },
          customProperties,
        ),
        {
          eventID: derivedEventID,
        },
      );

      each((val, key) => {
        if (key === event.toLowerCase()) {
          window.fbq(
            'trackSingle',
            self.pixelId,
            val,
            {
              currency: currVal,
              value: useValue ? value : this.formatRevenue(price),
            },
            {
              eventID: derivedEventID,
            },
          );
        }
      }, legacyTo);
    } else if (event === 'Product Added') {
      const contentIds = [];
      const contents = [];

      if (prodId) {
        contentIds.push(prodId);
        contents.push({
          id: prodId,
          quantity,
          item_price: price,
        });
      }
      const productInfo = {
        content_ids: contentIds,
        content_type: this.getContentType(rudderElement, 'product'),
        content_name: prodName || '',
        content_category: category || '',
        currency: currVal,
        value: useValue ? value : this.formatRevenue(price),
        contents,
      };
      window.fbq(
        'trackSingle',
        self.pixelId,
        'AddToCart',
        this.merge(productInfo, customProperties),
        {
          eventID: derivedEventID,
        },
      );

      each((val, key) => {
        if (key === event.toLowerCase()) {
          window.fbq(
            'trackSingle',
            self.pixelId,
            val,
            {
              currency: currVal,
              value: useValue ? value : this.formatRevenue(price),
            },
            {
              eventID: derivedEventID,
            },
          );
        }
      }, legacyTo);
      this.merge(productInfo, customProperties);
    } else if (event === 'Order Completed') {
      const contentType = this.getContentType(rudderElement, 'product');
      const contentIds = [];
      const contents = [];
      if (Array.isArray(products)) {
        products.forEach((product) => {
          if (product) {
            const pId = product.product_id || product.sku || product.id;
            if (pId) {
              contentIds.push(pId);
              const content = {
                id: pId,
                quantity: product.quantity || quantity || 1,
                item_price: product.price || price,
              };
              contents.push(content);
            }
          }
        });
      } else {
        logger.debug('No product array found');
      }
      // ref: https://developers.facebook.com/docs/meta-pixel/implementation/marketing-api#purchase
      // "trackSingle" feature is :
      // https://developers.facebook.com/ads/blog/post/v2/2017/11/28/event-tracking-with-multiple-pixels-tracksingle/

      const productInfo = {
        content_ids: contentIds,
        content_type: contentType,
        currency: currVal,
        value: revValue,
        contents,
        num_items: contentIds.length,
        content_name: contentName,
      };

      window.fbq(
        'trackSingle',
        self.pixelId,
        'Purchase',
        this.merge(productInfo, customProperties),
        {
          eventID: derivedEventID,
        },
      );

      each((val, key) => {
        if (key === event.toLowerCase()) {
          window.fbq(
            'trackSingle',
            self.pixelId,
            val,
            {
              currency: currVal,
              value: revValue,
            },
            {
              eventID: derivedEventID,
            },
          );
        }
      }, legacyTo);
    } else if (event === 'Products Searched') {
      const contentIds = [];
      const contents = [];

      if (prodId) {
        contentIds.push(prodId);
        contents.push({
          id: prodId,
          quantity,
          item_price: price,
        });
      }
      const productInfo = {
        content_ids: contentIds,
        content_category: category || '',
        currency: currVal,
        value,
        contents,
        search_string: query,
      };
      window.fbq('trackSingle', self.pixelId, 'Search', this.merge(productInfo, customProperties), {
        eventID: derivedEventID,
      });

      each((val, key) => {
        if (key === event.toLowerCase()) {
          window.fbq(
            'trackSingle',
            self.pixelId,
            val,
            {
              currency: currVal,
              value,
            },
            {
              eventID: derivedEventID,
            },
          );
        }
      }, legacyTo);
    } else if (event === 'Checkout Started') {
      let contentCategory = category;
      const contentIds = [];
      const contents = [];
      if (Array.isArray(products)) {
        products.forEach((product) => {
          if (product) {
            const pId = product.product_id || product.sku || product.id;
            if (pId) {
              contentIds.push(pId);
              const content = {
                id: pId,
                quantity: product.quantity || quantity || 1,
                item_price: product.price || price,
              };
              contents.push(content);
            }
          }
        });

        if (!contentCategory && products[0] && products[0].category) {
          contentCategory = products[0].category;
        }
      }

      const productInfo = {
        content_ids: contentIds,
        content_type: this.getContentType(rudderElement, 'product'),
        content_category: contentCategory,
        currency: currVal,
        value: revValue,
        contents,
        num_items: contentIds.length,
      };
      window.fbq(
        'trackSingle',
        self.pixelId,
        'InitiateCheckout',
        this.merge(productInfo, customProperties),
        {
          eventID: derivedEventID,
        },
      );

      each((val, key) => {
        if (key === event.toLowerCase()) {
          window.fbq(
            'trackSingle',
            self.pixelId,
            val,
            {
              currency: currVal,
              value: revValue,
            },
            {
              eventID: derivedEventID,
            },
          );
        }
      }, legacyTo);
    } else {
      logger.debug('inside custom');
      if (!standardTo[event?.toLowerCase()] && !legacyTo[event?.toLowerCase()]) {
        logger.debug('inside custom not mapped');
        const payloadVal = this.buildPayLoad(rudderElement);
        payloadVal.value = revValue;
        window.fbq('trackSingleCustom', self.pixelId, event, payloadVal, {
          eventID: derivedEventID,
        });
      } else {
        each((val, key) => {
          if (key === event.toLowerCase()) {
            payload.currency = currVal;
            payload.value = revValue;

            window.fbq('trackSingle', self.pixelId, val, payload, {
              eventID: derivedEventID,
            });
          }
        }, standardTo);

        each((val, key) => {
          if (key === event.toLowerCase()) {
            window.fbq(
              'trackSingle',
              self.pixelId,
              val,
              {
                currency: currVal,
                value: revValue,
              },
              {
                eventID: derivedEventID,
              },
            );
          }
        }, legacyTo);
      }
    }
  }

  /**
   * Get the Facebook Content Type
   *
   * Can be `product`, `destination`, `flight` or `hotel`.
   *
   * This can be overridden within the message
   * `options.integrations.FACEBOOK_PIXEL.contentType`, or alternatively you can
   * set the "Map Categories to Facebook Content Types" setting within
   * RudderStack config and then set the corresponding commerce category in
   * `track()` properties.
   *
   * https://www.facebook.com/business/help/606577526529702?id=1205376682832142
   */
  getContentType(rudderElement, defaultValue) {
    // Get the message-specific override if it exists in the options parameter of `track()`
    const contentTypeMessageOverride =
      rudderElement.message.integrations?.FACEBOOK_PIXEL?.contentType;
    if (contentTypeMessageOverride) return contentTypeMessageOverride;

    // Otherwise check if there is a replacement set for all Facebook Pixel
    // track calls of this category
    const category = rudderElement.message.properties?.category;
    if (category) {
      const categoryMapping = this.categoryToContent?.find((i) => i.from === category);
      if (categoryMapping?.to) return categoryMapping.to;
    }

    // Otherwise return the default value
    return defaultValue;
  }

  merge(obj1, obj2) {
    const res = {};

    // All properties of obj1
    Object.keys(obj1).forEach((propObj1) => {
      if (Object.prototype.hasOwnProperty.call(obj1, propObj1)) {
        res[propObj1] = obj1[propObj1];
      }
    });

    // Extra properties of obj2
    Object.keys(obj2).forEach((propObj2) => {
      if (
        Object.prototype.hasOwnProperty.call(obj2, propObj2) &&
        !Object.prototype.hasOwnProperty.call(res, propObj2)
      ) {
        res[propObj2] = obj2[propObj2];
      }
    });

    return res;
  }

  formatRevenue(revenue) {
    const formattedRevenue = parseFloat(parseFloat(revenue || 0).toFixed(2));
    if (Number.isNaN(formattedRevenue)) {
      logger.error('Revenue could not be converted to number');
    }
    return formattedRevenue;
  }

  buildPayLoad(rudderElement) {
    const dateFields = [
      'checkinDate',
      'checkoutDate',
      'departingArrivalDate',
      'departingDepartureDate',
      'returningArrivalDate',
      'returningDepartureDate',
      'travelEnd',
      'travelStart',
    ];
    const defaultPiiProperties = [
      'email',
      'firstName',
      'lastName',
      'gender',
      'city',
      'country',
      'phone',
      'state',
      'zip',
      'birthday',
    ];
    const whitelistPiiProperties = this.whitelistPiiProperties || [];
    const blacklistPiiProperties = this.blacklistPiiProperties || [];
    const customPiiProperties = {};
    for (let i = 0; i < blacklistPiiProperties[i]; i += 1) {
      const configuration = blacklistPiiProperties[i];
      customPiiProperties[configuration.blacklistPiiProperties] = configuration.blacklistPiiHash;
    }
    const payload = {};
    const { properties } = rudderElement.message;
    for (const property in properties) {
      if (!properties.hasOwnProperty(property)) {
        continue;
      }

      const value = properties[property];

      if (dateFields.includes(properties) && is.date(value)) {
        const [dateValue] = value.toISOString().split('T');
        payload[property] = dateValue;
      }
      if (
        customPiiProperties.hasOwnProperty(property) &&
        customPiiProperties[property] &&
        typeof value === 'string'
      ) {
        payload[property] = sha256(value).toString();
      }
      const isPropertyPii = defaultPiiProperties.includes(property);
      const isProperyWhiteListed = whitelistPiiProperties.includes(property);
      if (!isPropertyPii || isProperyWhiteListed) {
        payload[property] = value;
      }
    }
    return payload;
  }
}

export { FacebookPixel };
