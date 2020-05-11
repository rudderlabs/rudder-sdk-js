import { ScriptLoader } from "../ScriptLoader";
import logger from "../../utils/logUtil";
import is from "is";
import each from "./node_modules/@ndhoule/each";

class FBPixel {
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
    console.log(config)
  }

  init() {
<<<<<<< HEAD
   
  if(this.categoryToContent === undefined){
    this.categoryToContent = []
  }
  if(this.legacyConversionPixelId === undefined){
    this.legacyConversionPixelId = []
  }
  if(this.userIdAsPixelId === undefined){
    this.userIdAsPixelId = []
  }
  
  
    logger.debug("===in init FbPixel===");
=======
    logger.debug("===in init FBPixel===");
>>>>>>> f480af1a60a4e8fb924bf73a40ff921b7dff93fc
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
      "//connect.facebook.net/en_US/fbevents.js"
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
    var event = rudderElement.message.event;
    var revenue = this.formatRevenue(rudderElement.message.properties.revenue);
    var payload = this.buildPayLoad(rudderElement, true);

    if(this.categoryToContent === undefined){
      this.categoryToContent = []
    }
    if(this.legacyConversionPixelId === undefined){
      this.legacyConversionPixelId = []
    }
    if(this.userIdAsPixelId === undefined){
      this.userIdAsPixelId = []
    }
   
    payload.value = revenue;
    var standard = this.eventsToEvents;
    var legacy = this.legacyConversionPixelId;
    var standardTo;
    var legacyTo;
    

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

    each(function (event) {
      if (event === "Purchase"){
        payload.currency = rudderElement.message.properties.currency || "USD";
      }
        
      window.fbq("trackSingle", this.pixelId, event, payload, {
        eventID: rudderElement.message.messageId,
      });
    }, standardTo);

    each(function (event) {
      window.fbq(
        "trackSingle",
        this.pixelId,
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
      var products = rudderElement.message.properties.products;
      var customProperties = this.buildPayLoad(rudderElement, true);

      if (Array.isArray(products)) {
        products.forEach(function (product) {
          var productId = product.product_id;
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
        this.pixelId,
        "ViewContent",
        this.merge(
          {
            content_ids: contentIds,
            content_type: this.getContentType(rudderElement, contentType), 
            contents: contents,
          },
          customProperties
        ),
        {
          eventID: rudderElement.message.messageId,
        }
      );

      each(function (event) {
        window.fbq(
          "trackSingle",
          this.pixelId,
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
        this.pixelId,
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

      each(function (event) {
        window.fbq(
          "trackSingle",
          this.pixelId,
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
        this.pixelId,
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

      each(function (event) {
        window.fbq(
          "trackSingle",
          this.pixelId,
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
      var products = rudderElement.message.properites.products;
      var customProperties = this.buildPayLoad(rudderElement, true);
      var revenue = this.formatRevenue(
        rudderElement.message.properties.revenue
      );

      var contentType = this.getContentType(rudderElement, ["product"]); 
      var contentIds = [];
      var contents = [];

      for (var i = 0; i < products.length; i++) {
        var pId = product.product_id;
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
        this.pixelId,
        "Purchase",
        this.merge(
          {
            content_ids: contentIds,
            content_type: contentType,
            currency: rudderElement.message.properties.currency,
            value: revenue,
            contents: contents,
            num_items: contentIds.length,
          },
          customProperties
        ),
        {
          eventID: rudderElement.message.messageId,
        }
      );

      each(function (event) {
        window.fbq(
          "trackSingle",
          this.pixelId,
          event,
          {
            currency: rudderElement.message.properties.currency,
            value: this.formatRevenue(rudderElement.message.properties.revenue),
          },
          {
            eventID: rudderElement.message.messageId,
          }
        );
      }, legacyto);
    } else if (event === "Products Searched") {
      var customProperties = this.buildPayLoad(rudderElement, true);
      window.fbq(
        "trackSingle",
        this.pixelId,
        "Search",
        merge(
          {
            search_string: rudderElement.message.properties.query,
          },
          customProperties
        ),
        {
          eventID: rudderElement.message.messageId,
        }
      );

      each(function (event) {
        window.fbq(
          "trackSingle",
          this.pixelId,
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
      var products = rudderElement.message.properites.products;
      var customProperties = this.buildPayLoad(rudderElement, true);
      var revenue = this.formatRevenue(
        rudderElement.message.properties.revenue
      );
      var contentCategory = rudderElement.message.properties.category;
      var contentIds = [];
      var contents = [];

      for (var i = 0; i < products.length; i++) {
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
        this.pixelId,
        "InitiateCheckout",
        this.merge(
          {
            content_category: contentCategory,
            content_ids: contentIds,
            content_type: this.getContentType(rudderElement, ["product"]),
            currency: rudderElement.message.properties.currency,
            value: revenue,
            contents: contents,
            num_items: contentIds.length,
          },
          customProperties
        ),
        {
          eventID: rudderElement.message.messageId,
        }
      );

      each(function (event) {
        window.fbq(
          "trackSingle",
          this.pixelId,
          event,
          {
            currency: rudderElement.message.properties.currency,
            value: this.formatRevenue(rudderElement.message.properties.revenue),
          },
          {
            eventID: rudderElement.message.messageId,
          }
        );
      }, legacyto);
    }
  }

  getContentType(rudderElement, defaultValue) {
    var options = rudderElement.message.options;
    if (options && options.contentType) {
      return [options.contentType];
    }

    var category = rudderElement.message.properties.category;
    if (!category) {
      var products = rudderElement.message.properties.products;
      if (products && products.length) {
        category = products[0].category;
      }
    }
    if (category) {
      var mapped = this.categoryToContent;
      var mappedTo;
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
    var res = {};

    // All properties of obj1
    for (var propObj1 in obj1) {
      if (obj1.hasOwnProperty(propObj1)) {
        res[propObj1] = obj1[propObj1];
      }
    }

    // Extra properties of obj2
    for (var propObj2 in obj2) {
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
    var dateFields = [
      "checkinDate",
      "checkoutDate",
      "departingArrivalDate",
      "departingDepartureDate",
      "returningArrivalDate",
      "returningDepartureDate",
      "travelEnd",
      "travelStart",
    ];
    var defaultPiiProperties = [
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
    var whitelistPiiProperties = this.whitelistPiiProperties || [];
    var blacklistPiiProperties = this.blacklistPiiProperties || [];
    var eventCustomProperties = this.eventCustomProperties || [];
    var customPiiProperties = {};
    for (var i = 0; i < blacklistPiiProperties[i]; i++) {
      var configuration = blacklistPiiProperties[i];
      customPiiProperties[configuration.blacklistPiiProperties] =
        configuration.blacklistPiiHash; 
    }
    var payload = {};
    var properties = rudderElement.message.properties;

    for (var property in properties) {
      if (!properties.hasOwnProperty(property)) {
        continue;
      }

      if (isStandardEvent && eventCustomProperties.indexOf(property) < 0) {
        continue;
      }
      var value = properties[property];

      if (dateFields.indexOf(properties) >= 0) {
        if (is.date(value)) {
          payload[property] = value.toISOTring().split("T")[0];
          continue;
        }
      }
      if (customPiiProperties.hasOwnProperty(property)) {
        if (customPiiProperties[property] && typeof value == "string") {
          payload[property] = sha256(value);
        }
        continue;
      }
      var isPropertyPii = defaultPiiProperties.indexOf(property) >= 0;
      var isProperyWhiteListed = whitelistPiiProperties.indexOf(property) >= 0;
      if (!isPropertyPii || isProperyWhiteListed) {
        payload[property] = value;
      }
    }
    return payload;
  }
}

export { FBPixel };
