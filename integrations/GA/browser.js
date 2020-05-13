import logger from "../../utils/logUtil";
import is from "is";
import dot from "obj-case";
import each from "component-each";
import extend from "extend";
import defaults from "@ndhoule/defaults";



class GA {
  constructor(config) {
    this.trackingID = config.trackingID; //UA-149602794-1
    this.sendUserId = config.sendUserId; //from here new to be added in ui
    this.dimensions = config.dimensions;
    this.metrics = config.metrics;
    this.contentGroupings = config.contentGroupings;
    this.nonInteraction = config.nonInteraction;
    this.anonymizeIp = config.anonymizeIp;
    this.useGoogleAmpClientId = config.useGoogleAmpClientId;
    this.classic = config.classic;
    this.domain = config.domain;
    this.doubleClick = config.doubleClick;
    this.enhancedEcommerce = config.enhancedEcommerce;
    this.enhancedLinkAttribution = config.enhancedLinkAttribution;
    this.ignoredReferrers = config.ignoredReferrers;
    this.includeSearch = config.includeSearch;
    this.setAllMappedProps = config.setAllMappedProps;
    this.siteSpeedSampleRate = config.siteSpeedSampleRate;
    this.sampleRate = config.sampleRate;
    this.trackCategorizedPages = config.trackCategorizedPages;
    this.trackNamedPages = config.trackNamedPages;
    this.optimize = config.optimize;
    this.resetCustomDimensionsOnPage = config.resetCustomDimensionsOnPage;
    this.inputs = config;
    this.enhancedEcommerceLoaded = 0;
    this.name = "GA";
  }

  init() {
   
    this.resetCustomDimensionsOnPage = "";
    this.pageCalled = false;
    (function (i, s, o, g, r, a, m) {
      i["GoogleAnalyticsObject"] = r;
      (i[r] =
        i[r] ||
        function () {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      "script",
      "https://www.google-analytics.com/analytics.js",
      "ga"
    );
    //window.ga_debug = {trace: true};
    ga("create", this.trackingID, "auto");
    ga("send", "pageview");

    logger.debug("===in init GA===");
  }

  identify(rudderElement) {
    console.log(this.sendUserId);

    if (this.sendUserId && rudderElement.message.userId) {
      ga("set", "userId", rudderElement.message.userId);
    }
    this.sendUserId = true;
    if (this.sendUserId) {
      console.log("inside ga send");
      console.log(rudderElement.message.userId);
      ga("set", "userId", rudderElement.message.userId);
    }

    var custom = metrics(
      rudderElement.message.context.traits,
      this.dimensions,
      this.metrics,
      this.contentGroupings
    );
    console.log("custom");
    console.log(custom);
    if (Object.keys(custom).length) ga("set", custom);
    logger.debug("in GoogleAnalyticsManager identify");
    console.log("in GoogleAnalyticsManager identify");
  }

  track(rudderElement, options) {
    console.log("this.name");
    console.log(this.name);
   

    // Ecommerce events
    var event = rudderElement.message.event;
    console.log(event);
    console.log("event")
    if(event ==="Order Completed"){
      console.log("inside order completed")
      var properties = rudderElement.message.properties;
      var total = properties.total;
      var orderId = properties.orderId;
      var products = properties.products;

      if(!orderId) return;
      console.log(this.ecommerce)
      if(!this.ecommerce){
        ga('require','ecommerce')
        this.ecommerce = true;
      }

      console.log(this.ecommerce)

      ga('ecommerce:addTransaction',{
        affiliation: properties.affiliation,
        shipping: properties.shipping,
        revenue: total,
        tax: properties.tax,
        id: orderId,
        currency: properties.currency

      });

      each(products, function(product){
        var productTrack = createProductTrack(rudderElement,product);
        console.log(productTrack)
        console.log("productTrack")
        ga('ecommerce:addItem',{
          category: productTrack.category,
          quantity: productTrack.quantity,
          price: productTrack.price,
          name: productTrack.name,
          sku: productTrack.sku,
          id: orderId,
          currency: productTrack.currency
        })
      })

      ga('ecommerce:send')
    }
    // enhanced ecommerce events
    else if((event ==='Checkout Started' || event === "Checkout Step Viewed" || event === 'Order Updated') && this.enhancedEcommerce){
      console.log("inside checkout started");
      var properties = rudderElement.message.properties;
      var products = properties.products;
      var options = extractCheckoutOptions(rudderElement);
      
      this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);
      

      each(products,function(product){
        var productTrack = createProductTrack(rudderElement,product);
        enhancedEcommerceTrackProduct(productTrack,this.inputs);
      });

      ga('ec:setAction','checkout',{
        step: properties.step || 1,
        option: options || undefined
      });
      pushEnhancedEcommerce(rudderElement,this.inputs);
      
    }
    else if(event ==='Checkout Step Completed' && this.enhancedEcommerce){
   var props = rudderElement.message.properties;
   var options = extractCheckoutOptions(rudderElement);

   if(!props.step) return;

   var params = {
     step: props.step,
     option : options || undefined 
   };

   this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);

   ga('ec:setAction','checkout_option',params);
   ga('send','event','Checkout','Option');
    }
    else if(event === 'Order Completed' && this.enhancedEcommerce){
    var total = rudderElement.message.properties.total || rudderElement.message.properties.revenue || 0;
    var orderId = rudderElement.message.properties.orderId;
    var products = rudderElement.message.properties.products;
    var props = rudderElement.message.properties;
    
    if(!orderId) return;

    this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);

    each(products,function(product){
      var productTrack = createProductTrack(rudderElement,product);
      enhancedEcommerceTrackProduct(productTrack,this.inputs);
    });
    ga('ec:setAction','purchase',{
      id: orderId,
      affiliation: props.affiliation,
      revenue: total,
      tax: props.tax,
      shipping: props.shipping,
      coupon: props.coupon
    });

    pushEnhancedEcommerce(rudderElement,this.inputs)

    }
    else if(event === 'Order Refunded' && this.enhancedEcommerce){
      var props = rudderElement.message.properties;
      var orderId = props.orderId;
      var products = props.products;

      if(!orderId) return;

      this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);

      each(products,function(product){
        var track = {properties:product};
        ga('ec:addProduct',{
          id: props.productId || props.id() || props.sku,
          quantity: props.quantity
        })
      })
      ga('setAction','refund',{
        id: orderId
      })
      ga('ec:setAction','refund',{
        id:orderId
      })

      pushEnhancedEcommerce(rudderElement,this.inputs)

    }
    else if(event ==='Product Added' && this.enhancedEcommerce){
      this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);
      enhancedEcommerceTrackProductAction(rudderElement,'add',null,this.inputs);
      pushEnhancedEcommerce(rudderElement,this.inputs)
    }
    else if(event ==='Product Removed' && this.enhancedEcommerce){
      this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);
      enhancedEcommerceTrackProductAction(rudderElement,'remove',null,this.inputs);
      pushEnhancedEcommerce(rudderElement,this.inputs)
    }
    else if(event === 'Product Viewed' && this.enhancedEcommerce){
      var props = rudderElement.message.properties;
      var data = {};
      this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);
      
      if(props.list) data.list = props.list;
      enhancedEcommerceTrackProductAction(rudderElement,'detail',data,this.inputs);
      pushEnhancedEcommerce(rudderElement,this.inputs);
    }
    else if(event === 'Product Clicked' && this.enhancedEcommerce){
      var props = rudderElement.message.properties;
      var data = {};
      this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);
      
      if(props.list) data.list = props.list;
      enhancedEcommerceTrackProductAction(rudderElement,'click',data,this.inputs);
      pushEnhancedEcommerce(rudderElement,this.inputs);
    }
    else if(event === 'Promotion Viewed' && this.enhancedEcommerce){
    var props = rudderElement.message.properties;
    
    this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);
    ga('ec:addPromo',{
      id: props.promotionId || props.id,
      name: props.name,
      creative: props.creative,
      position: props.position
    })
    pushEnhancedEcommerce(rudderElement,this.inputs)

    }
    else if(event === 'Promotion Clicked' && this.enhancedEcommerce){
      var props = rudderElement.message.properties;
      this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);

      ga('ec:addPromo',{
        id: props.promotionId || props.id,
        name: props.name,
        creative: props.creative,
        position: props.position
      })
      ga('ec:setAction','promo_click',{});
      pushEnhancedEcommerce(rudderElement,this.inputs);
    }
    else if(event === 'Product List Viewed' && this.enhancedEcommerce){
      console.log("inside Product List Viewed")
       var props = rudderElement.message.properties;
       var products = props.products;

       this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);

       each(products,function(product){
         var item = {properties : product};
         if(!(item.productId || item.sku) && !item.name) return;
         var impressionObj = {
           id: item.productId || item.sku,
           name: item.name,
           category: item.category || props.category,
           list: props.list_id || props.category || 'products',
           brand: item.properties.band,
           variant: item.properties.variant,
           price: item.price,
           position: getProductPosition(item,products)
         };
         impressionObj = extend(impressionObj,metrics(item.properties,this.dimensions,this.metrics,this.contentGroupings));

         for(var prop in impressionObj){
           if(impressionObj[prop] === undefined) delete impressionObj[prop]
         }
         ga('ec:addImpression',impressionObj)
       })

    }
    else if(event === 'Product List Filtered' && this.enhancedEcommerce){
      console.log("inside Product List Filtered")
      var props = rudderElement.message.properties;
      var products = props.products;
      props.filters = props.filters || [];
      props.sorters = props.sorters || [];
      var filters = props.filters.map(function(obj){
        return obj.type + ':' + obj.value;
      })
      .join();
      var sorts = props.sorters.map(function(obj){
        return obj.type + ':' +obj.value;
      }).join();

      this.enhancedEcommerceLoaded = loadEnhancedEcommerce(rudderElement,this.enhancedEcommerceLoaded);

      each(products,function(product){
        var item = {properties: product};
        if(!(item.productId || item.sku) && !item.name) return;
        var impressionObj = {
          id: item.productId || item.sku,
          name: item.name,
          category: item.category || props.category,
          list: props.list_id || props.category || 'search results',
          brand: props.brand,
          variant: filters + '::' + sorts,
          price: item.price,
          position: getProductPosition(item,products)
        }

        impressionObj = extend(impressionObj,metrics(item.properties,this.dimensions,this.metrics,this.contentGroupings))

        for(var prop in impressionObj){
          if(impressionObj[prop]=== undefined) delete impressionObj[prop];
        }
        ga('ec:addImpression',impressionObj);
      });
      pushEnhancedEcommerce(rudderElement,this.inputs)



    }
    else{
      console.log("in GoogleAnalyticsManager track 1");
      var contextOpts; //need to implement
      var interfaceOpts = this.inputs;
      var opts = defaults(options || {}, contextOpts);
      opts = defaults(opts, interfaceOpts);
      console.log("inputs");
      console.log(this.inputs);
      var eventCategory = rudderElement.message.properties.category;
      var eventAction = rudderElement.message.event;
      var eventLabel = rudderElement.message.properties.label;
      var eventValue = "";
      if (rudderElement.message.properties) {
        eventValue = rudderElement.message.properties.value
          ? rudderElement.message.properties.value
          : rudderElement.message.properties.revenue;
      }
  
      var payLoad = {
        eventCategory: eventCategory || "All",
        eventAction: eventAction,
        eventLabel: eventLabel,
        eventValue: formatValue(eventValue),
        nonInteraction:
          rudderElement.message.properties.nonInteraction !== undefined
            ? !!rudderElement.message.properties.nonInteraction
            : !!opts.nonInteraction,
      };
  
      console.log("payload 1");
      console.log(payLoad);
      var campaign = rudderElement.message.context.campaign;
      console.log(campaign);
      console.log("campaign");
      if (campaign) {
        if (campaign.name) payload.campaignName = campaign.name;
        if (campaign.source) payload.campaignSource = campaign.source;
        if (campaign.medium) payload.campaignMedium = campaign.medium;
        if (campaign.content) payload.campaignContent = campaign.content;
        if (campaign.term) payload.campaignKeyword = campaign.term;
      }
  
      payLoad = extend(
        payLoad,
        setCustomDimenionsAndMetrics(
          rudderElement.message.properties,
          this.inputs
        )
      );
      console.log("payload");
      console.log(payLoad);
      ga("send", "event", payLoad);
      logger.debug("in GoogleAnalyticsManager track");
      console.log("in GoogleAnalyticsManager track");
    }

   
  }

  page(rudderElement) {
    logger.debug("in GoogleAnalyticsManager page");
    console.log("in GoogleAnalyticsManager page");

    var category = rudderElement.message.properties.category;
    var eventProperties = rudderElement.message.properties;
    var name = rudderElement.message.properties.fullName;
    var campaign = rudderElement.message.context.campaign | {};
    var pageview = {};
    var pagePath = path(eventProperties, this.includeSearch);
    var pageReferrer = rudderElement.message.properties.referrer || "";
    var pageTitle = name || eventProperties.title;
    // var track;

    pageview.page = pagePath;
    pageview.title = pageTitle;
    pageview.location = eventProperties.url;

    if (campaign) {
      if (campaign.name) pageview.campaignName = campaign.name;
      if (campaign.source) pageview.campaignSource = campaign.source;
      if (campaign.medium) pageview.campaignMedium = campaign.medium;
      if (campaign.content) pageview.campaignContent = campaign.content;
      if (campaign.term) pageview.campaignKeyword = campaign.term;
    }

    var payload = {
      page: pagePath,
      title: pageTitle,
    };

    var resetCustomDimensions = {};
    for (var i = 0; i < this.resetCustomDimensionsOnPage.length; i++) {
      var property = this.resetCustomDimensionsOnPage[i];
      if (this.dimensions[property]) {
        resetCustomDimensions[this.dimensions[property]] = null;
      }
    }
    console.log(payload);
    console.log("payload");
    ga("set", resetCustomDimensions);
    pageview = extend(
      pageview,
      setCustomDimenionsAndMetrics(eventProperties, this.inputs)
    );

    if (pageReferrer !== document.referrer) payload.referrer = pageReferrer;
    ga("set", payload);

    if (this.pageCalled) delete pageview.location;
    console.log("pageview");
    console.log(pageview);
    ga("send", "pageview", pageview);

    //track categorized page call to be modified
    if (category && this.trackCategorizedPages) {
      this.track(rudderElement, { nonInteraction: 1 });
    }
    //track named page call to be modified
    if (name && this.trackNamedPages) {
      this.track(rudderElement, { nonInteraction: 1 });
    }
  }




  isLoaded() {
    logger.debug("in GA isLoaded");
    return !!window.gaplugins;
  }

  isReady() {
    return !!window.gaplugins;
  }
}
function metrics(obj, dimensions, metrics, contentGroupings) {
  var ret = {};

  each([metrics, dimensions, contentGroupings], function (group) {
    each(group, function (prop, key) {
      var value = dot(obj, prop) || obj[prop];
      if (is.boolean(value)) value = value.toString();
      if (value || value === 0) ret[key] = value;
    });
  });
  return ret;
}
function formatValue(value) {
  if (!value || value < 0) return 0;
  return Math.round(value);
}
function setCustomDimenionsAndMetrics(props, inputs) {
  var ret = {};
  var custom = metrics(
    inputs.dimensions,
    inputs.metrics,
    inputs.contentGroupings
  );
  if (Object.keys(custom).length) {
    if (inputs.setAllMappedProps) {
      ga("set", custom);
    } else {
      each(custom, function (key, value) {
        ret[key] = value;
      });
      return ret;
    }
  }
}
function path(properties, includeSearch) {
  if (!properties) return;
  var str = properties.path;
  if (includeSearch && properties.search) str += properties.search;
  return str;
}

function createProductTrack(rudderElement,properties){
  var props = properties || {};
  props.currency = properties.currency || rudderElement.message.properties.currency;
  return {properties: props}
}
function loadEnhancedEcommerce(rudderElement,a){
  
  console.log(a)
  if(a === 0){
    ga('require','ec');
    a = 1
  }
  console.log(a)
  ga('set','&cu',rudderElement.message.properties.currency);
  return a;
}
function enhancedEcommerceTrackProduct(rudderElement,inputs){
  var props = rudderElement.message.properties;
  var product = {
    id: props.productId || props.id || props.sku,
    name: props.name,
    category: props.category,
    quantity: props.quantity,
    price: props.price,
    brand: props.brand,
    variant: props.variant,
    currency: props.currency
  };

  if(props.position!=null){
    product.position = Math.round(props.position);
  }

  var coupon = props.coupon;
  if(coupon) product.coupon = coupon;
  product = extend(product,metrics(props,inputs.dimensions,inputs.metrics,inputs.contentGroupings));
  console.log(product)
  console.log("product")
  ga('ec:addProduct',product);
}

function extractCheckoutOptions(rudderElement){
var options = [
  rudderElement.message.properties.paymentMethod,
  rudderElement.message.properties.shippingMethod
];

var valid = rejectArr(options);
return valid.length > 0 ? valid.join(', ') : null;

}

function pushEnhancedEcommerce(rudderElement,inputs){
  var args = rejectArr([
    'send',
    'event',
    rudderElement.message.properties.category || 'EnhancedEcommerce',
    rudderElement.message.event || 'Action not defined',
    rudderElement.message.properties.label,
    extend({
      nonInteraction: 1
    },
    setCustomDimenionsAndMetrics(rudderElement.message.properties,inputs))

  ])
console.log("args")
console.log(args)
  var event = rudderElement.message.event;
  event = event.toLowerCase();
  var eventWithCategoryFieldProductScoped = [
    'product clicked',
    'product added',
    'product viewed',
    'product removed'
  ];
  if(eventWithCategoryFieldProductScoped.includes(event)){
    args[2] = 'EnhancedEcommerce';
  }
  console.log(args)
  ga.apply(window,args)
}

function enhancedEcommerceTrackProductAction(rudderElement,action,data,inputs){
  enhancedEcommerceTrackProduct(rudderElement,inputs);
  ga('ec:setAction',action,data || {})
}

function getProductPosition(item,products){
var position = item.properties.position;
if(typeof position !== 'undefined' && !Number.isNaN(Number(position)) && Number(position)> -1){
  return position
}
return (products.map(function(x){
  return x.product_id;
}).indexOf(item.productId) +1)
}

function rejectArr(obj,fn){
  fn = fn || compact;
  return 'array' == type(obj)
    ? rejectarray(obj, fn)
    : rejectobject(obj, fn);
}

 var rejectarray = function(arr, fn){
  var ret = [];

  for (var i = 0; i < arr.length; ++i) {
    if (!fn(arr[i], i)) ret[ret.length] = arr[i];
  }

  return ret;
};

var rejectobject = function(obj, fn){
  var ret = {};

  for (var k in obj) {
    if (obj.hasOwnProperty(k) && !fn(obj[k], k)) {
      ret[k] = obj[k]
    }
  }

  return ret;
};


function compact(value){
  return null == value;
}

function type(val){
  switch (toString.call(val)) {
    case '[object Function]': return 'function';
    case '[object Date]': return 'date';
    case '[object RegExp]': return 'regexp';
    case '[object Arguments]': return 'arguments';
    case '[object Array]': return 'array';
  }

  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (val === Object(val)) return 'object';

  return typeof val;
};
export { GA };
