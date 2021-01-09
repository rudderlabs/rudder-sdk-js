import is from "is";
import each from "@ndhoule/each";
import ScriptLoader from "../ScriptLoader";
import logger from "../../utils/logUtil";

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

  page(rudderElement) {
    window.fbq("track", "PageView");
  }

  identify(rudderElement) {
    if (this.advancedMapping) {
      window.fbq("init", this.pixelId, rudderElement.message.context.traits);
    }
  }

  track(rudderElement) {
    const self = this;
    const { event } = rudderElement.message;
    var revenue = this.formatRevenue(rudderElement.message.properties.revenue);
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

    payload.value = revenue;
    const standard = this.eventsToEvents;
    const legacy = this.legacyConversionPixelId;
    let standardTo;
    let legacyTo;

    standardTo = standard.reduce((filtered, standard) => {
      if (standard.from === event) {
        filtered.push(standard.to);
      }
      return filtered;
    }, []);

    legacyTo = legacy.reduce((filtered, legacy) => {
      if (legacy.from === event) {
        filtered.push(legacy.to);
      }
      return filtered;
    }, []);

    each((event) => {
      payload.currency = rudderElement.message.properties.currency || "USD";

      window.fbq("trackSingle", self.pixelId, event, payload, {
        eventID: rudderElement.message.messageId,
      });
    }, standardTo);

    each((event) => {
      window.fbq(
        "trackSingle",
        self.pixelId,
        event,
        {
          currency: rudderElement.message.properties.currency,
          value: revenue,
        },
        {
          eventID: rudderElement.message.messageId,
        }
      );
    }, legacyTo);

    if (event === "Product List Viewed") {
      var contentType;
      var contentIds;
      var contents = [];
      var { products } = rudderElement.message.properties;
      var customProperties = this.buildPayLoad(rudderElement, true);

      if (Array.isArray(products)) {
        products.forEach(function (product) {
          const productId = product.product_id;
          if (productId) {
            contentIds.push(productId);
            contents.push({
              id: productId,
              quantity: rudderElement.message.properties.quantity,
            });
          }
        });
      }

      if (contentIds.length) {
        contentType = ["product"];
      } else {
        contentIds.push(rudderElement.message.properties.category || "");
        contents.push({
          id: rudderElement.message.properties.category || "",
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
          eventID: rudderElement.message.messageId,
        }
      );

      each((event) => {
        window.fbq(
          "trackSingle",
          self.pixelId,
          event,
          {
            currency: rudderElement.message.properties.currency,
            value: this.formatRevenue(rudderElement.message.properties.revenue),
          },
          {
            eventID: rudderElement.message.messageId,
          }
        );
      }, legacyTo);
    } else if (event === "Product Viewed") {
      var useValue = this.valueFieldIdentifier === "properties.value";
      var customProperties = this.buildPayLoad(rudderElement, true);

      window.fbq(
        "trackSingle",
        self.pixelId,
        "ViewContent",
        this.merge(
          {
            content_ids: [
              rudderElement.message.properties.product_id ||
                rudderElement.message.properties.id ||
                rudderElement.message.properties.sku ||
                "",
            ],
            content_type: this.getContentType(rudderElement, ["product"]),
            content_name: rudderElement.message.properties.product_name || "",
            content_category: rudderElement.message.properties.category || "",
            currency: rudderElement.message.properties.currency,
            value: useValue
              ? this.formatRevenue(rudderElement.message.properties.value)
              : this.formatRevenue(rudderElement.message.properties.price),
            contents: [
              {
                id:
                  rudderElement.message.properties.product_id ||
                  rudderElement.message.properties.id ||
                  rudderElement.message.properties.sku ||
                  "",
                quantity: rudderElement.message.properties.quantity,
                item_price: rudderElement.message.properties.price,
              },
            ],
          },
          customProperties
        ),
        {
          eventID: rudderElement.message.messageId,
        }
      );

      each((event) => {
        window.fbq(
          "trackSingle",
          self.pixelId,
          event,
          {
            currency: rudderElement.message.properties.currency,
            value: useValue
              ? this.formatRevenue(rudderElement.message.properties.value)
              : this.formatRevenue(rudderElement.message.properties.price),
          },
          {
            eventID: rudderElement.message.messageId,
          }
        );
      }, legacyTo);
    } else if (event === "Product Added") {
      var useValue = this.valueFieldIdentifier === "properties.value";
      var customProperties = this.buildPayLoad(rudderElement, true);
      window.fbq(
        "trackSingle",
        self.pixelId,
        "AddToCart",
        this.merge(
          {
            content_ids: [
              rudderElement.message.properties.product_id ||
                rudderElement.message.properties.id ||
                rudderElement.message.properties.sku ||
                "",
            ],
            content_type: this.getContentType(rudderElement, ["product"]),

            content_name: rudderElement.message.properties.product_name || "",
            content_category: rudderElement.message.properties.category || "",
            currency: rudderElement.message.properties.currency,
            value: useValue
              ? this.formatRevenue(rudderElement.message.properties.value)
              : this.formatRevenue(rudderElement.message.properties.price),
            contents: [
              {
                id:
                  rudderElement.message.properties.product_id ||
                  rudderElement.message.properties.id ||
                  rudderElement.message.properties.sku ||
                  "",
                quantity: rudderElement.message.properties.quantity,
                item_price: rudderElement.message.properties.price,
              },
            ],
          },
          customProperties
        ),
        {
          eventID: rudderElement.message.messageId,
        }
      );

      each((event) => {
        window.fbq(
          "trackSingle",
          self.pixelId,
          event,
          {
            currency: rudderElement.message.properties.currency,
            value: useValue
              ? this.formatRevenue(rudderElement.message.properties.value)
              : this.formatRevenue(rudderElement.message.properties.price),
          },
          {
            eventID: rudderElement.message.messageId,
          }
        );
      }, legacyTo);
      this.merge(
        {
          content_ids: [
            rudderElement.message.properties.product_id ||
              rudderElement.message.properties.id ||
              rudderElement.message.properties.sku ||
              "",
          ],
          content_type: this.getContentType(rudderElement, ["product"]),

          content_name: rudderElement.message.properties.product_name || "",
          content_category: rudderElement.message.properties.category || "",
          currency: rudderElement.message.properties.currency,
          value: useValue
            ? this.formatRevenue(rudderElement.message.properties.value)
            : this.formatRevenue(rudderElement.message.properties.price),
          contents: [
            {
              id:
                rudderElement.message.properties.product_id ||
                rudderElement.message.properties.id ||
                rudderElement.message.properties.sku ||
                "",
              quantity: rudderElement.message.properties.quantity,
              item_price: rudderElement.message.properties.price,
            },
          ],
        },
        customProperties
      );
    } else if (event === "Order Completed") {
      var { products } = rudderElement.message.properties;
      var customProperties = this.buildPayLoad(rudderElement, true);
      var revenue = this.formatRevenue(
        rudderElement.message.properties.revenue
      );

      var contentType = this.getContentType(rudderElement, ["product"]);
      var contentIds = [];
      var contents = [];

      for (var i = 0; i < products.length; i++) {
        var pId = products[i].product_id;
        contentIds.push(pId);
        var content = {
          id: pId,
          quantity: rudderElement.message.properties.quantity,
        };
        if (rudderElement.message.properties.price) {
          content.item_price = rudderElement.message.properties.price;
        }
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
            currency: rudderElement.message.properties.currency,
            value: revenue,
            contents,
            num_items: contentIds.length,
          },
          customProperties
        ),
        {
          eventID: rudderElement.message.messageId,
        }
      );

      each((event) => {
        window.fbq(
          "trackSingle",
          self.pixelId,
          event,
          {
            currency: rudderElement.message.properties.currency,
            value: this.formatRevenue(rudderElement.message.properties.revenue),
          },
          {
            eventID: rudderElement.message.messageId,
          }
        );
      }, legacyTo);
    } else if (event === "Products Searched") {
      var customProperties = this.buildPayLoad(rudderElement, true);
      window.fbq(
        "trackSingle",
        self.pixelId,
        "Search",
        this.merge(
          {
            search_string: rudderElement.message.properties.query,
          },
          customProperties
        ),
        {
          eventID: rudderElement.message.messageId,
        }
      );

      each((event) => {
        window.fbq(
          "trackSingle",
          self.pixelId,
          event,
          {
            currency: rudderElement.message.properties.currency,
            value: formatRevenue(rudderElement.message.properties.revenue),
          },
          {
            eventID: rudderElement.message.messageId,
          }
        );
      }, legacyTo);
    } else if (event === "Checkout Started") {
      var { products } = rudderElement.message.properties;
      var customProperties = this.buildPayLoad(rudderElement, true);
      var revenue = this.formatRevenue(
        rudderElement.message.properties.revenue
      );
      let contentCategory = rudderElement.message.properties.category;
      var contentIds = [];
      var contents = [];

      for (var i = 0; i < products.length; i++) {
        const product = products[i];
        var pId = product.product_id;
        contentIds.push(pId);
        var content = {
          id: pId,
          quantity: rudderElement.message.properties.quantity,
          item_price: rudderElement.message.properties.price,
        };
        if (rudderElement.message.properties.price) {
          content.item_price = rudderElement.message.properties.price;
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
            currency: rudderElement.message.properties.currency,
            value: revenue,
            contents,
            num_items: contentIds.length,
          },
          customProperties
        ),
        {
          eventID: rudderElement.message.messageId,
        }
      );

      each((event) => {
        window.fbq(
          "trackSingle",
          self.pixelId,
          event,
          {
            currency: rudderElement.message.properties.currency,
            value: this.formatRevenue(rudderElement.message.properties.revenue),
          },
          {
            eventID: rudderElement.message.messageId,
          }
        );
      }, legacyTo);
    }
  }

  getContentType(rudderElement, defaultValue) {
    const { options } = rudderElement.message;
    if (options && options.contentType) {
      return [options.contentType];
    }

    let { category } = rudderElement.message.properties;
    if (!category) {
      const { products } = rudderElement.message.properties;
      if (products && products.length) {
        category = products[0].category;
      }
    }
    if (category) {
      const mapped = this.categoryToContent;
      let mappedTo;
      mappedTo = mapped.reduce((filtered, mapped) => {
        if (mapped.from == category) {
          filtered.push(mapped.to);
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

      if (isStandardEvent && eventCustomProperties.indexOf(property) < 0) {
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
