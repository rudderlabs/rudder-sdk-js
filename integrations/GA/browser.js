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
export { GA };
