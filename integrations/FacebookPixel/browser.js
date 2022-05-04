/* eslint-disable class-methods-use-this */
import is from "is";
import each from "@ndhoule/each";
import sha256 from "crypto-js/sha256";
import ScriptLoader from "../ScriptLoader";
import logger from "../../utils/logUtil";
import getEventId from "./utils";
import {
  getHashFromArray,
  isDefinedAndNotNullAndNotEmpty,
  isDefined,
} from "../utils/commonUtils";
import { NAME, traitsMapper } from "./constants";
import { constructPayload } from "../../utils/utils";

class FacebookPixel {
  constructor(config) {
    this.blacklistPiiProperties = config.blacklistPiiProperties;
    this.categoryToContent = config.categoryToContent;
    this.pixelId = config.pixelId;
    this.eventsToEvents = config.eventsToEvents;
    this.eventCustomProperties = config.eventCustomProperties;
    this.valueFieldIdentifier = config.valueFieldIdentifier;
    this.advancedMapping = config.advancedMapping;
    this.traitKeyToExternalId = config.traitKeyToExternalId;
    this.legacyConversionPixelId = config.legacyConversionPixelId;
    this.userIdAsPixelId = config.userIdAsPixelId;
    this.whitelistPiiProperties = config.whitelistPiiProperties;
    this.useUpdatedMapping = config.useUpdatedMapping;
    this.name = NAME;
  }

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

    logger.debug("===in init FbPixel===");

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
    window.fbq.version = "2.0";
    window.fbq.queue = [];

    window.fbq("init", this.pixelId);
    ScriptLoader(
      "fbpixel-integration",
      "https://connect.facebook.net/en_US/fbevents.js"
    );
  }

  isLoaded() {
    logger.debug("in FBPixel isLoaded");
    return !!(window.fbq && window.fbq.callMethod);
  }

  isReady() {
    logger.debug("in FBPixel isReady");
    return !!(window.fbq && window.fbq.callMethod);
  }

  page(rudderElement) {
    const { properties } = rudderElement.message;
    window.fbq("track", "PageView", properties, {
      eventID: getEventId(rudderElement.message),
    });
  }

  identify(rudderElement) {
    if (this.advancedMapping) {
      let payload = {};
      const traits = rudderElement.message.context
        ? rudderElement.message.context.traits
        : undefined;
      if (this.useUpdatedMapping) {
        const reserve = [
          "email",
          "lastName",
          "firstName",
          "phone",
          "external_id",
          "city",
          "birthday",
          "gender",
          "street",
          "zip",
          "country",
        ];
        // this construcPayload will help to map the traits in the same way as cloud mode
        payload = constructPayload(rudderElement.message, traitsMapper);

        // here we are sending other traits apart from the reserved ones.
        reserve.forEach((element) => {
          delete traits[element];
        });
      }
      payload = { ...payload, ...traits };
      window.fbq("init", this.pixelId, payload);
    }
  }

  track(rudderElement) {
    const self = this;
    const { event, properties, messageId } = rudderElement.message;
    let revValue;
    let currVal;
    if (properties) {
      const { revenue, currency } = properties;
      revValue = this.formatRevenue(revenue);
      currVal = currency || "USD";
    }
    const payload = this.buildPayLoad(rudderElement, true);

    if (this.categoryToContent === undefined) {
      this.categoryToContent = [];
    }
    if (this.legacyConversionPixelId === undefined) {
      this.legacyConversionPixelId = [];
    }
    if (this.userIdAsPixelId === undefined) {
      this.userIdAsPixelId = [];
    }

    payload.value = revValue;
    const standard = this.eventsToEvents;
    const legacy = this.legacyConversionPixelId;
    const standardTo = getHashFromArray(standard);
    const legacyTo = getHashFromArray(legacy);
    const useValue = this.valueFieldIdentifier === "properties.value";
    let products;
    let quantity;
    let category;
    let prodId;
    let prodName;
    let value;
    let price;
    let query;
    if (properties) {
      products = properties.products;
      quantity = properties.quantity;
      category = properties.category;
      prodId = properties.product_id || properties.id || properties.sku || "";
      prodName = properties.product_name || properties.name;
      value = properties.value;
      price = properties.price;
      query = properties.query;
    }
    const customProperties = this.buildPayLoad(rudderElement, true);
    const derivedEventID = getEventId(rudderElement.message);
    if (event === "Product List Viewed") {
      let contentType;
      const contentIds = [];
      const contents = [];

      if (products && Array.isArray(products)) {
        products.forEach((product, index) => {
          const productId = product.product_id || product.sku || product.id;
          if (!isDefined(productId)) {
            logger.error(
              `Product id is required for product ${index}. Event not sent`
            );
          }
          if (productId) {
            contentIds.push(productId);
            contents.push({
              id: productId,
              quantity: product.quantity || quantity || 1,
              item_price: product.price,
            });
          }
        });
      } else {
        logger.error("No product array found");
      }

      if (contentIds.length) {
        contentType = ["product"];
      } else {
        contentIds.push(category || "");
        contents.push({
          id: category || "",
          quantity: 1,
        });
        contentType = ["product_group"];
      }
      window.fbq(
        "trackSingle",
        self.pixelId,
        "ViewContent",
        this.merge(
          {
            content_ids: contentIds,
            content_type: this.getContentType(rudderElement, contentType),
            contents,
          },
          customProperties
        ),
        {
          eventID: derivedEventID,
        }
      );
      each((val, key) => {
        if (key === event.toLowerCase()) {
          window.fbq(
            "trackSingle",
            self.pixelId,
            val,
            {
              currency: currVal,
              value: revValue,
            },
            {
              eventID: derivedEventID,
            }
          );
        }
      }, legacyTo);
    } else if (event === "Product Viewed") {
      if (!isDefinedAndNotNullAndNotEmpty(prodId)) {
        // not adding index, as only one product is supposed to be present here
        logger.error("Product id is required. Event not sent");
      }
      window.fbq(
        "trackSingle",
        self.pixelId,
        "ViewContent",
        this.merge(
          {
            content_ids: [prodId],
            content_type: this.getContentType(rudderElement, ["product"]),
            content_name: prodName || "",
            content_category: category || "",
            currency: currVal,
            value: useValue
              ? this.formatRevenue(value)
              : this.formatRevenue(price),
            contents: [
              {
                id: prodId,
                quantity,
                item_price: price,
              },
            ],
          },
          customProperties
        ),
        {
          eventID: derivedEventID,
        }
      );

      each((val, key) => {
        if (key === event.toLowerCase()) {
          window.fbq(
            "trackSingle",
            self.pixelId,
            val,
            {
              currency: currVal,
              value: useValue
                ? this.formatRevenue(value)
                : this.formatRevenue(price),
            },
            {
              eventID: derivedEventID,
            }
          );
        }
      }, legacyTo);
    } else if (event === "Product Added") {
      if (!isDefinedAndNotNullAndNotEmpty(prodId)) {
        // not adding index, as only one product is supposed to be present here
        logger.error("Product id is required. Event not sent");
      }
      window.fbq(
        "trackSingle",
        self.pixelId,
        "AddToCart",
        this.merge(
          {
            content_ids: [prodId],
            content_type: this.getContentType(rudderElement, ["product"]),

            content_name: prodName || "",
            content_category: category || "",
            currency: currVal,
            value: useValue
              ? this.formatRevenue(value)
              : this.formatRevenue(price),
            contents: [
              {
                id: prodId,
                quantity,
                item_price: price,
              },
            ],
          },
          customProperties
        ),
        {
          eventID: derivedEventID,
        }
      );

      each((val, key) => {
        if (key === event.toLowerCase()) {
          window.fbq(
            "trackSingle",
            self.pixelId,
            val,
            {
              currency: currVal,
              value: useValue
                ? this.formatRevenue(value)
                : this.formatRevenue(price),
            },
            {
              eventID: derivedEventID,
            }
          );
        }
      }, legacyTo);
      this.merge(
        {
          content_ids: [prodId],
          content_type: this.getContentType(rudderElement, ["product"]),

          content_name: prodName || "",
          content_category: category || "",
          currency: currVal,
          value: useValue
            ? this.formatRevenue(value)
            : this.formatRevenue(price),
          contents: [
            {
              id: prodId,
              quantity,
              item_price: price,
            },
          ],
        },
        customProperties
      );
    } else if (event === "Order Completed") {
      const contentType = this.getContentType(rudderElement, ["product"]);
      const contentIds = [];
      const contents = [];
      if (products) {
        for (let i = 0; i < products.length; i++) {
          const pId =
            products[i].product_id || products[i].sku || products[i].id;
          contentIds.push(pId);
          const content = {
            id: pId,
            quantity: products[i].quantity || quantity || 1,
            item_price: products[i].price || price,
          };
          if (!isDefined(content.id)) {
            logger.error(
              `Product id is required for product ${i}. Event not sent`
            );
          }

          contents.push(content);
        }
        // ref: https://developers.facebook.com/docs/meta-pixel/implementation/marketing-api#purchase
        // "trackSingle" feature is :
        // https://developers.facebook.com/ads/blog/post/v2/2017/11/28/event-tracking-with-multiple-pixels-tracksingle/
        window.fbq(
          "trackSingle",
          self.pixelId,
          "Purchase",
          this.merge(
            {
              content_ids: contentIds,
              content_type: contentType,
              currency: currVal,
              value: revValue,
              contents,
              num_items: contentIds.length,
            },
            customProperties
          ),
          {
            eventID: derivedEventID,
          }
        );

        each((val, key) => {
          if (key === event.toLowerCase()) {
            window.fbq(
              "trackSingle",
              self.pixelId,
              val,
              {
                currency: currVal,
                value: revValue,
              },
              {
                eventID: derivedEventID,
              }
            );
          }
        }, legacyTo);
      } else {
        logger.error("No product array found");
      }
    } else if (event === "Products Searched") {
      window.fbq(
        "trackSingle",
        self.pixelId,
        "Search",
        this.merge(
          {
            search_string: query,
          },
          customProperties
        ),
        {
          eventID: derivedEventID,
        }
      );

      each((val, key) => {
        if (key === event.toLowerCase()) {
          window.fbq(
            "trackSingle",
            self.pixelId,
            val,
            {
              currency: currVal,
              value: revValue,
            },
            {
              eventID: derivedEventID,
            }
          );
        }
      }, legacyTo);
    } else if (event === "Checkout Started") {
      let contentCategory = category;
      const contentIds = [];
      const contents = [];
      if (products) {
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          const pId = product.product_id || product.sku || product.id;
          contentIds.push(pId);
          const content = {
            id: pId,
            quantity: product.quantity || properties.quantity || 1,
            item_price: product.price || price,
          };
          if (!isDefined(content.id)) {
            logger.error(
              `Product id is required for product ${i}. Event not sent`
            );
          }
          contents.push(content);
        }

        if (!contentCategory && products[0] && products[0].category) {
          contentCategory = products[0].category;
        }
        window.fbq(
          "trackSingle",
          self.pixelId,
          "InitiateCheckout",
          this.merge(
            {
              content_category: contentCategory,
              content_ids: contentIds,
              content_type: this.getContentType(rudderElement, ["product"]),
              currency: currVal,
              value: revValue,
              contents,
              num_items: contentIds.length,
            },
            customProperties
          ),
          {
            eventID: derivedEventID,
          }
        );

        each((val, key) => {
          if (key === event.toLowerCase()) {
            window.fbq(
              "trackSingle",
              self.pixelId,
              val,
              {
                currency: currVal,
                value: revValue,
              },
              {
                eventID: derivedEventID,
              }
            );
          }
        }, legacyTo);
      } else {
        logger.error("No product array found");
      }
    } else {
      logger.debug("inside custom");
      if (!standardTo[event.toLowerCase()] && !legacyTo[event.toLowerCase()]) {
        logger.debug("inside custom not mapped");
        const payloadVal = this.buildPayLoad(rudderElement, false);
        payloadVal.value = revValue;
        window.fbq("trackSingleCustom", self.pixelId, event, payloadVal, {
          eventID: derivedEventID,
        });
      } else {
        each((val, key) => {
          if (key === event.toLowerCase()) {
            payload.currency = currVal;

            window.fbq("trackSingle", self.pixelId, val, payload, {
              eventID: derivedEventID,
            });
          }
        }, standardTo);

        each((val, key) => {
          if (key === event.toLowerCase()) {
            window.fbq(
              "trackSingle",
              self.pixelId,
              val,
              {
                currency: currVal,
                value: revValue,
              },
              {
                eventID: derivedEventID,
              }
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
    if (contentTypeMessageOverride) return [contentTypeMessageOverride];

    // Otherwise check if there is a replacement set for all Facebook Pixel
    // track calls of this category
    const category = rudderElement.message.properties.category;
    if (category) {
      const categoryMapping = this.categoryToContent?.find(
        (i) => i.from === category
      );
      if (categoryMapping?.to) return [categoryMapping.to];
    }

    // Otherwise return the default value
    return defaultValue;
  }

  merge(obj1, obj2) {
    const res = {};

    // All properties of obj1
    for (const propObj1 in obj1) {
      if (obj1.hasOwnProperty(propObj1)) {
        res[propObj1] = obj1[propObj1];
      }
    }

    // Extra properties of obj2
    for (const propObj2 in obj2) {
      if (obj2.hasOwnProperty(propObj2) && !res.hasOwnProperty(propObj2)) {
        res[propObj2] = obj2[propObj2];
      }
    }

    return res;
  }

  formatRevenue(revenue) {
    const formattedRevenue = parseFloat(parseFloat(revenue || 0).toFixed(2));
    if (!Number.isNaN(formattedRevenue)) {
      return formattedRevenue;
    }
    logger.error("Revenue could not be converted to number")
  }

  buildPayLoad(rudderElement, isStandardEvent) {
    const dateFields = [
      "checkinDate",
      "checkoutDate",
      "departingArrivalDate",
      "departingDepartureDate",
      "returningArrivalDate",
      "returningDepartureDate",
      "travelEnd",
      "travelStart",
    ];
    const defaultPiiProperties = [
      "email",
      "firstName",
      "lastName",
      "gender",
      "city",
      "country",
      "phone",
      "state",
      "zip",
      "birthday",
    ];
    const whitelistPiiProperties = this.whitelistPiiProperties || [];
    const blacklistPiiProperties = this.blacklistPiiProperties || [];
    const eventCustomProperties = this.eventCustomProperties || [];
    const customPiiProperties = {};
    for (let i = 0; i < blacklistPiiProperties[i]; i++) {
      const configuration = blacklistPiiProperties[i];
      customPiiProperties[configuration.blacklistPiiProperties] =
        configuration.blacklistPiiHash;
    }
    const payload = {};
    const { properties } = rudderElement.message;
    for (const property in properties) {
      if (!properties.hasOwnProperty(property)) {
        continue;
      }

      const customProperties = eventCustomProperties.map(
        (e) => e.eventCustomProperties
      );

      if (isStandardEvent && customProperties.indexOf(property) < 0) {
        continue;
      }

      const value = properties[property];

      if (dateFields.indexOf(properties) >= 0) {
        if (is.date(value)) {
          payload[property] = value.toISOTring().split("T")[0];
          continue;
        }
      }
      if (customPiiProperties.hasOwnProperty(property)) {
        if (customPiiProperties[property] && typeof value === "string") {
          payload[property] = sha256(value).toString();
        }
        continue;
      }
      const isPropertyPii = defaultPiiProperties.indexOf(property) >= 0;
      const isProperyWhiteListed =
        whitelistPiiProperties.indexOf(property) >= 0;
      if (!isPropertyPii || isProperyWhiteListed) {
        payload[property] = value;
      }
    }
    return payload;
  }
}

export { FacebookPixel };
