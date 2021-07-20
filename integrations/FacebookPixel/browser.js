/* eslint-disable class-methods-use-this */
import is from "is";
import each from "@ndhoule/each";
import ScriptLoader from "../ScriptLoader";
import logger from "../../utils/logUtil";
import { getHashFromArray } from "../utils/commonUtils";

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
    this.name = "FB_PIXEL";
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

  page() {
    window.fbq("track", "PageView");
  }

  identify(rudderElement) {
    if (this.advancedMapping) {
      const traits = rudderElement.message.context
        ? rudderElement.message.context.traits
        : undefined;
      window.fbq("init", this.pixelId, traits);
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
      prodName = properties.product_name;
      value = properties.value;
      price = properties.price;
      query = properties.query;
    }
    const customProperties = this.buildPayLoad(rudderElement, true);
    if (event === "Product List Viewed") {
      let contentType;
      const contentIds = [];
      const contents = [];

      if (products && Array.isArray(products)) {
        products.forEach((product) => {
          const productId = product.product_id;
          if (productId) {
            contentIds.push(productId);
            contents.push({
              id: productId,
              quantity: quantity || 1,
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
          eventID: messageId,
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
              eventID: messageId,
            }
          );
        }
      }, legacyTo);
    } else if (event === "Product Viewed") {
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
          eventID: messageId,
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
              eventID: messageId,
            }
          );
        }
      }, legacyTo);
    } else if (event === "Product Added") {
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
          eventID: messageId,
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
              eventID: messageId,
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
          const pId = products[i].product_id;
          contentIds.push(pId);
          const content = {
            id: pId,
            quantity,
          };

          content.item_price = price;

          contents.push(content);
        }
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
            eventID: messageId,
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
                eventID: messageId,
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
          eventID: messageId,
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
              eventID: messageId,
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
          const pId = product.product_id;
          contentIds.push(pId);
          const content = {
            id: pId,
            quantity,
            item_price: price,
          };

          content.item_price = price;

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
            eventID: messageId,
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
                eventID: messageId,
              }
            );
          }
        }, legacyTo);
      } else {
        logger.error("No product array found");
      }
    } else {
      console.log("inside custom");
      if (!standardTo[event.toLowerCase()] && !legacyTo[event.toLowerCase()]) {
        console.log("inside custom not mapped");
        const payloadVal = this.buildPayLoad(rudderElement, false);
        payloadVal.value = revValue;
        window.fbq("trackSingleCustom", self.pixelId, event, payloadVal, {
          eventID: messageId,
        });
      } else {
        each((val, key) => {
          if (key === event.toLowerCase()) {
            payload.currency = currVal;

            window.fbq("trackSingle", self.pixelId, val, payload, {
              eventID: messageId,
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
                eventID: messageId,
              }
            );
          }
        }, legacyTo);
      }
    }
  }

  getContentType(rudderElement, defaultValue) {
    const { options, properties } = rudderElement.message;
    if (options && options.contentType) {
      return [options.contentType];
    }
    let { category } = properties;
    const { products } = properties;
    if (!category) {
      if (products && products.length) {
        category = products[0].category;
      }
    }
    if (category) {
      const mapped = this.categoryToContent;
      const mappedTo = mapped.reduce((filtered, mappedVal) => {
        if (mappedVal.from === category) {
          filtered.push(mappedVal.to);
        }
        return filtered;
      }, []);
      if (mappedTo.length) {
        return mappedTo;
      }
    }
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
    return Number(revenue || 0).toFixed(2);
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

      const customProperties = eventCustomProperties.map(e => e.eventCustomProperties);

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
          payload[property] = sha256(value);
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
