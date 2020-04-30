import { ScriptLoader } from "../ScriptLoader";
import logger from "../../utils/logUtil";
import is from "is";
import each from "@ndhoule/each";
//var each = require('@ndhoule/each');

class FbPixel {
  constructor(config) {
    (this.blacklistPiiProperties = config.blacklistPiiProperties), //present
      (this.categoryToContent = config.categoryToContent), //map contentTypes
      (this.pixelId = config.pixelId), //present
      (this.eventsToEvents = config.eventsToEvents), //map  standardEvents
      (this.eventCustomProperties = config.eventCustomProperties), //present
      (this.valueFieldIdentifier = config.valueFieldIdentifier), //present
      (this.advancedMapping = config.advancedMapping),
      (this.traitKeyToExternalId = config.traitKeyToExternalId), //present
      (this.legacyConversionPixelId = config.legacyConversionPixelId), //map legacyevents
      (this.userIdAsPixelId = config.userIdAsPixelId), //present
      (this.whitelistPiiProperties = config.whitelistPiiProperties); //present
    this.name = "FB_PIXEL";
    console.log(config);
  }

  init() {
    logger.debug("===in init FbPixelRuchira===");
    console.log("===in init FbPixel Ruchira===");
    console.log(this.pixelId);
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
    console.log(window.fbq);
    ScriptLoader(
      "fbpixel-integration",
      "//connect.facebook.net/en_US/fbevents.js"
    );
    console.log("script loaded");
  }

  isLoaded() {
    logger.debug("in FbPixel isLoaded");
    console.log("in FbPixel isLoaded");
    console.log(!!(window.fbq && window.fbq.callMethod));
    return !!(window.fbq && window.fbq.callMethod);
  }
  isReady() {
    logger.debug("in FbPixel isReady");
    console.log("in FbPixel isReady");
    console.log(!!(window.fbq && window.fbq.callMethod));
    return !!(window.fbq && window.fbq.callMethod);
  }
  page(rudderElement) {
    console.log("in page call");
    window.fbq("track", "PageView");
  }
  identify(rudderElement) {
    console.log("in identify call");
    this.page();
  }
  track(rudderElement) {
    console.log("in track call");
    var event = rudderElement.message.event;
    var revenue = this.formatRevenue(rudderElement.message.properties.revenue);
    var payload = this.buildPayLoad(rudderElement, true);

    payload.value = revenue;
    var standard = this.eventsToEvents;
    var legacy = this.legacyConversionPixelId;
    console.log(standard);
    console.log(legacy);
    var standardTo;
    var legacyTo;

    standardTo = standard.reduce((filtered, standard) => {
      if (standard.from === event) {
        console.log("in if");
        filtered.push(standard.to);
      }
      return filtered;
    }, []);
    legacyTo = legacy.reduce((filtered, legacy) => {
      if (legacy.from === event) {
        console.log("in if");
        filtered.push(legacy.to);
      }
      return filtered;
    }, []);

    console.log(payload);
    if (![].concat(standardTo, legacyTo).length) {
      window.fbq("trackSingleCustom", this.pixelId, event, payload, {
        eventID: rudderElement.messageId,
      });
      return;
    }
    each(function (event) {
      if (event === "Purchase")
        payload.currency = rudderElement.properties.currency;
      window.fbq("trackSingle", this.pixelId, event, payload, {
        eventID: rudderElement.messageId,
      });
    }, standardTo);

    each(function (event) {
      window.fbq(
        "trackSingle",
        this.pixelId,
        event,
        {
          currency: rudderElement.properties.currency,
          value: revenue,
        },
        {
          eventID: rudderElement.messageId,
        }
      );
    }, legacyTo);

    if (event === "Product List Viewed") {
      var contentType;
      var contentIds;
      var contents = [];
      var products = rudderElement.properties.products;
      var customProperties = buildPayLoad(rudderElement, true);

      if (Array.isArray(products)) {
        products.forEach(function (product) {
          var productId = product.product_id;
          if (productId) {
            contentIds.push(productId);
            contents.push({
              id: productId,
              quantity: rudderElement.properties.quantity,
            });
          }
        });
      }
      if (contentIds.length) {
        contentType = ["product"];
      } else {
        contentIds.push(rudderElement.properties.category || "");
        contents.push({
          id: rudderElement.properties.category || "",
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
            content_type: contentType, //need to change
            contents: contents,
          },
          customProperties
        ),
        {
          eventID: rudderElement.messageId,
        }
      );

      each(function (event) {
        window.fbq(
          "trackSingle",
          this.pixelId,
          event,
          {
            currency: rudderElement.properties.currency,
            value: this.formatRevenue(rudderElement.properties.revenue),
          },
          {
            eventID: rudderElement.messageId,
          }
        );
      }, legacyTo);
    } else if (event == "Product Viewed") {
      var useValue = this.valueFieldIdentifier === "properties.value";
      var customProperties = this.buildPayLoad(rudderElement, true);

      window.fbq(
        "trackSingle",
        this.pixelId,
        "ViewContent",
        this.merge(
          {
            content_ids: [
              rudderElement.properties.product_id ||
                rudderElement.properties.id ||
                rudderElement.properties.sku ||
                "",
            ],
            content_type: "", //need to change
            content_name: rudderElement.properties.product_name || "",
            content_category: rudderElement.properties.category || "",
            currency: rudderElement.properties.currency,
            value: useValue
              ? this.formatRevenue(rudderElement.properties.value)
              : this.formatRevenue(rudderElement.properties.price),
            contents: [
              {
                id:
                  rudderElement.properties.product_id ||
                  rudderElement.properties.id ||
                  rudderElement.properties.sku ||
                  "",
                quantity: rudderElement.properties.quantity,
                item_price: rudderElement.properties.price,
              },
            ],
          },
          customProperties
        ),
        {
          eventID: rudderElement.messageId,
        }
      );

      each(function (event) {
        window.fbq(
          "trackSingle",
          this.pixelId,
          event,
          {
            currency: rudderElement.properties.currency,
            value: useValue
              ? this.formatRevenue(rudderElement.properties.value)
              : this.formatRevenue(rudderElement.properties.price),
          },
          {
            eventID: rudderElement.messageId,
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
              rudderElement.properties.product_id ||
                rudderElement.properties.id ||
                rudderElement.properties.sku ||
                "",
            ],
            content_type: "", //need to change
            content_name: rudderElement.properties.product_name || "",
            content_category: rudderElement.properties.category || "",
            currency: rudderElement.properties.currency,
            value: useValue
              ? this.formatRevenue(rudderElement.properties.value)
              : this.formatRevenue(rudderElement.properties.price),
            contents: [
              {
                id:
                  rudderElement.properties.product_id ||
                  rudderElement.properties.id ||
                  rudderElement.properties.sku ||
                  "",
                quantity: rudderElement.properties.quantity,
                item_price: rudderElement.properties.price,
              },
            ],
          },
          customProperties
        ),
        {
          eventID: rudderElement.messageId,
        }
      );

      each(function (event) {
        window.fbq(
          "trackSingle",
          this.pixelId,
          event,
          {
            currency: rudderElement.properties.currency,
            value: useValue
              ? this.formatRevenue(rudderElement.properties.value)
              : this.formatRevenue(rudderElement.properties.price),
          },
          {
            eventID: rudderElement.messageId,
          }
        );
      }, legacyTo);
    }
    else if(event == 'Order Completed'){
      var products = rudderElement.properites.products;
      var customProperties = this.buildPayLoad(rudderElement,true)
      var revenue = this.formatRevenue(rudderElement.properties.revenue)

      var contentType = '' //need to change
      var contentIds = [];
      var contents = [];

      for(var i=0; i<products.length; i++)
{
  var pId = product.product_id;
  contentIds.push(pId);
  var content = {
    id: pId,
    quantity: rudderElement.properties.quantity
  }
  if(rudderElement.properties.price){
    content.item_price = rudderElement.properties.price;
  }
  contents.push(content)
}  
window.fbq('trackSingle',
this.pixelId,
'Purchase',
this.merge({
  content_ids: contentIds,
  content_type: contentType,
  currency: rudderElement.properties.currency,
  value: revenue,
  contents: contents,
  num_items: contentIds.length
},customProperties),{
  eventID: rudderElement.messageId
})

each(function(event){
  window.fbq('trackSingle',this.pixelId,event,{
    currency: rudderElement.properties.currency,
    value: this.formatRevenue(rudderElement.properties.revenue)
  },{
    eventID: rudderElement.messageId
  })},legacyto
)

}
else if(event === 'Products Searched'){
  var customProperties = this.buildPayLoad(rudderElement,true);
  window.fbq('trackSingle',this.pixelId,'Search',merge({
    search_string: rudderElement.properties.query
  },customProperties),{
    eventID: rudderElement.messageId
  })

  each(function(event){
    window.fbq('trackSingle',this.pixelId,event,{
      currency: rudderElement.properties.currency,
      value: formatRevenue(rudderElement.properties.revenue)
    },{
      eventID: rudderElement.messageId
    })
  },legacyTo)
}
else if(event === 'Checkout Started'){
  var products = rudderElement.properites.products;
      var customProperties = this.buildPayLoad(rudderElement,true)
      var revenue = this.formatRevenue(rudderElement.properties.revenue)
      var contentCategory= rudderElement.properties.category;
      var contentType = '' //need to change
      var contentIds = [];
      var contents = [];

      for(var i=0; i<products.length; i++)
{
  var pId = product.product_id;
  contentIds.push(pId);
  var content = {
    id: pId,
    quantity: rudderElement.properties.quantity,
    item_price: rudderElement.properties.price
  }
  if(rudderElement.properties.price){
    content.item_price = rudderElement.properties.price;
  }
  contents.push(content)
} 
if(!contentCategory && products[0] && products[0].category){
  contentCategory = products[0].category
} 
window.fbq('trackSingle',
this.pixelId,
'InitiateCheckout',
this.merge({
  content_category: contentCategory,
  content_ids: contentIds,
  content_type: contentType,
  currency: rudderElement.properties.currency,
  value: revenue,
  contents: contents,
  num_items: contentIds.length
},customProperties),{
  eventID: rudderElement.messageId
})

each(function(event){
  window.fbq('trackSingle',this.pixelId,event,{
    currency: rudderElement.properties.currency,
    value: this.formatRevenue(rudderElement.properties.revenue)
  },{
    eventID: rudderElement.messageId
  })},legacyto
)
}
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
        configuration.blacklistPiiHash; //configuration.hashProperty
    }
    var payload = {};
    var properties = rudderElement.message.properties;

    console.log("properties");
    console.log(properties);

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
    console.log("payload");
    console.log(payload);
    return payload;
  }
}

export { FbPixel };
