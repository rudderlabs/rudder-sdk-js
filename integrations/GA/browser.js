import logger from "../../utils/logUtil";
import is from "is";
import each from "component-each";
import extend from "extend";
import defaults from "@ndhoule/defaults";

class GA {
  constructor(config) {
    this.trackingID = config.trackingID;
    this.sendUserId = config.sendUserId || false; //from here new to be added in ui
    this.dimensions = config.dimensions || [];
    this.metrics = config.metrics || [];
    this.contentGroupings = config.contentGroupings || [];
    this.nonInteraction = config.nonInteraction || false;
    this.anonymizeIp = config.anonymizeIp || false;
    this.useGoogleAmpClientId = config.useGoogleAmpClientId || false;
    this.classic = config.classic || false; //set to false
    this.domain = config.domain || "auto";
    this.doubleClick = config.doubleClick || false;
    this.enhancedEcommerce = config.enhancedEcommerce || false;
    this.enhancedLinkAttribution = config.enhancedLinkAttribution || false;
    this.ignoredReferrers = config.ignoredReferrers || null;
    this.includeSearch = config.includeSearch || false;
    this.setAllMappedProps = config.setAllMappedProps || true;
    this.siteSpeedSampleRate = config.siteSpeedSampleRate || 1;
    this.sampleRate = config.sampleRate || 100;
    this.trackCategorizedPages = config.trackCategorizedPages || true;
    this.trackNamedPages = config.trackNamedPages || true;
    this.optimize = config.optimize || "";
    this.resetCustomDimensionsOnPage = config.resetCustomDimensionsOnPage || [];
    this.inputs = config;
    this.enhancedEcommerceLoaded = 0;
    this.name = "GA";
  }

  init() {
    if (this.classic) {
      var anonymizeIp = this.anonymizeIp;
      var domain = this.domain;
      var enhanced = this.enhancedLinkAttribution;
      var ignore = this.ignoredReferrers;
      var sample = this.siteSpeedSampleRate;

      window._gaq = window._gaq || [];
      window._gaq.push("_setAccount", this.trackingID);
      window._gaq.push("_setAllowLinker", true);

      if (anonymizeIp) window._gaq.push("_gat._anonymizeIp");
      if (domain) window._gaq.push("_setDomainName", domain);
      if (sample) window._gaq.push("_setSiteSpeedSampleRate", sample);

      if (enhanced) {
        var protocol =
          document.location.protocol === "https:" ? "https:" : "http:";
        var pluginUrl =
          protocol + "//www.google-analytics.com/plugins/ga/inpage_linkid.js";
        window._gaq.push("_require", "inpage_linkid", pluginUrl);
      }

      if (ignore) {
        if (!is.array(ignore)) ignore = [ignore];
        each(ignore, function (domain) {
          window._gaq.push("_addIgnoredRef", domain);
        });
      }

      if (this.doubleClick) {
        //nned to change
      } else {
        var name = useHttps() ? "https" : "http";
        //need to change
      }
    } else {
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
      ga =
        ga ||
        function () {
          ga.q = ga.q || [];
          ga.q.push(arguments);
        };
      ga.l = new Date().getTime();

      var config = {
        cookieDomain: this.domain || GA.prototype.defaults.domain,
        siteSpeedSampleRate: this.siteSpeedSampleRate,
        sampleRate: this.sampleRate,
        allowLinker: true,
        useAmpClientId: this.useGoogleAmpClientId,
      };

      ga("create", this.trackingID, config);

      if (this.optimize) {
        ga("require", this.optimize);
      }

      if (this.doubleClick) {
        ga("require", "displayfeatures");
      }

      if (this.enhancedLinkAttribution) {
        ga("require", "linkid", "linkid.js");
      }

      if (this.anonymizeIp) {
        ga("set", "anonymizeIp", true);
      }

      console.log("===in init GA===");
    }
  }

  identify(rudderElement) {
    var dimensionsArray = {};
    for (let val of this.dimensions) {
      dimensionsArray[val.from] = val.to;
    }
    var metricsArray = {};
    for (let val of this.metrics) {
      metricsArray[val.from] = val.to;
    }
    var contentGroupingsArray = {};
    for (let val of this.contentGroupings) {
      contentGroupingsArray[val.from] = val.to;
    }
    console.log(rudderElement.message.userId);
    if (this.sendUserId && rudderElement.message.userId) {
      ga("set", "userId", rudderElement.message.userId);
    }
    var dimensionsArray = {};
    for (let val of this.dimensions) {
      dimensionsArray[val.from] = val.to;
    }
    var metricsArray = {};
    for (let val of this.metrics) {
      metricsArray[val.from] = val.to;
    }
    var contentGroupingsArray = {};
    for (let val of this.contentGroupings) {
      contentGroupingsArray[val.from] = val.to;
    }

    var custom = metrics(
      rudderElement.message.context.traits,
      dimensionsArray,
      metricsArray,
      contentGroupingsArray
    );

    console.log(Object.keys(custom).length);

    if (Object.keys(custom).length) ga("set", custom);

    console.log("in GoogleAnalyticsManager identify");
  }

  track(rudderElement, options) {
    if (this.classic) {
      if (event === "Order Completed") {
        var props = rudderElement.message.properties;
        var total = props.total || props.revenue;
        var orderId = props.orderId;
        var products = props.products || [];
        var currncy = props.currency;

        if (!orderId) return;

        window._gaq.push(
          "_addTrans",
          orderId,
          props.affiliation,
          total,
          props.tax,
          props.shipping,
          props.city,
          props.state,
          props.country
        );

        each(products, function (product) {
          var track = { properties: product };
          window._gaq.push(
            "_addItem",
            orderId,
            track.properties.sku,
            track.properties.name,
            track.properties.category,
            track.properties.price,
            track.properties.quantity
          );
        });

        window._gaq.push("_set", "currencyCode", currncy);
        window._gaq.push("_trackTrans");
      } else {
        var opts = options || "";
        var props = rudderElement.message.properties;
        var revenue = props.revenue;
        var event = rudderElement.message.event;
        var category = props.category || "All";
        var label = props.label;
        var value = formatValue(revenue || props.value);
        var nonInteraction = !!(props.nonInteraction || opts.nonInteraction);
        window._gaq.push(
          "_trackEvent",
          category,
          event,
          label,
          value,
          nonInteraction
        );
      }
    } else {
      var dimensionsArray = {};
      for (let val of this.dimensions) {
        dimensionsArray[val.from] = val.to;
      }
      var metricsArray = {};
      for (let val of this.metrics) {
        metricsArray[val.from] = val.to;
      }
      var contentGroupingsArray = {};
      for (let val of this.contentGroupings) {
        contentGroupingsArray[val.from] = val.to;
      }

      // Ecommerce events
      var event = rudderElement.message.event;

      if (event === "Order Completed" && !this.enhancedEcommerce) {
        var properties = rudderElement.message.properties;
        var total = properties.total;
        var orderId = properties.orderId;
        var products = properties.products;

        if (!orderId) return;

        if (!this.ecommerce) {
          ga("require", "ecommerce");
          this.ecommerce = true;
        }

        ga("ecommerce:addTransaction", {
          affiliation: properties.affiliation,
          shipping: properties.shipping,
          revenue: total,
          tax: properties.tax,
          id: orderId,
          currency: properties.currency,
        });

        each(products, function (product) {
          var productTrack = createProductTrack(rudderElement, product);

          ga("ecommerce:addItem", {
            category: productTrack.category,
            quantity: productTrack.quantity,
            price: productTrack.price,
            name: productTrack.name,
            sku: productTrack.sku,
            id: orderId,
            currency: productTrack.currency,
          });
        });

        ga("ecommerce:send");
      }
      // enhanced ecommerce events
      else if (
        (event === "Checkout Started" ||
          event === "Checkout Step Viewed" ||
          event === "Order Updated") &&
        this.enhancedEcommerce
      ) {
        var properties = rudderElement.message.properties;
        var products = properties.products;
        var options = extractCheckoutOptions(rudderElement);

        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );

        each(products, function (product) {
          var productTrack = createProductTrack(rudderElement, product);
          enhancedEcommerceTrackProduct(productTrack, this.inputs);
        });

        ga("ec:setAction", "checkout", {
          step: properties.step || 1,
          option: options || undefined,
        });
        pushEnhancedEcommerce(rudderElement, this.inputs);
      } else if (
        event === "Checkout Step Completed" &&
        this.enhancedEcommerce
      ) {
        var props = rudderElement.message.properties;
        var options = extractCheckoutOptions(rudderElement);

        if (!props.step) return;

        var params = {
          step: props.step || 1,
          option: options || undefined,
        };

        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );

        ga("ec:setAction", "checkout_option", params);
        ga("send", "event", "Checkout", "Option");
      } else if (event === "Order Completed" && this.enhancedEcommerce) {
        var total =
          rudderElement.message.properties.total ||
          rudderElement.message.properties.revenue ||
          0;
        var orderId = rudderElement.message.properties.orderId;
        var products = rudderElement.message.properties.products;
        var props = rudderElement.message.properties;

        if (!orderId) return;

        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );

        each(products, function (product) {
          var productTrack = createProductTrack(rudderElement, product);
          enhancedEcommerceTrackProduct(productTrack, this.inputs);
        });
        ga("ec:setAction", "purchase", {
          id: orderId,
          affiliation: props.affiliation,
          revenue: total,
          tax: props.tax,
          shipping: props.shipping,
          coupon: props.coupon,
        });

        pushEnhancedEcommerce(rudderElement, this.inputs);
      } else if (event === "Order Refunded" && this.enhancedEcommerce) {
        var props = rudderElement.message.properties;
        var orderId = props.orderId;
        var products = props.products;

        if (!orderId) return;

        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );

        each(products, function (product) {
          var track = { properties: product };
          ga("ec:addProduct", {
            id:
              track.properties.product_id ||
              track.properties.id ||
              track.properties.sku,
            quantity: track.properties.quantity,
          });
        });

        ga("ec:setAction", "refund", {
          id: orderId,
        });

        pushEnhancedEcommerce(rudderElement, this.inputs);
      } else if (event === "Product Added" && this.enhancedEcommerce) {
        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );
        enhancedEcommerceTrackProductAction(
          rudderElement,
          "add",
          null,
          this.inputs
        );
        pushEnhancedEcommerce(rudderElement, this.inputs);
      } else if (event === "Product Removed" && this.enhancedEcommerce) {
        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );
        enhancedEcommerceTrackProductAction(
          rudderElement,
          "remove",
          null,
          this.inputs
        );
        pushEnhancedEcommerce(rudderElement, this.inputs);
      } else if (event === "Product Viewed" && this.enhancedEcommerce) {
        var props = rudderElement.message.properties;
        var data = {};
        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );

        if (props.list) data.list = props.list;
        enhancedEcommerceTrackProductAction(
          rudderElement,
          "detail",
          data,
          this.inputs
        );
        pushEnhancedEcommerce(rudderElement, this.inputs);
      } else if (event === "Product Clicked" && this.enhancedEcommerce) {
        var props = rudderElement.message.properties;
        var data = {};
        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );

        if (props.list) data.list = props.list;
        enhancedEcommerceTrackProductAction(
          rudderElement,
          "click",
          data,
          this.inputs
        );
        pushEnhancedEcommerce(rudderElement, this.inputs);
      } else if (event === "Promotion Viewed" && this.enhancedEcommerce) {
        var props = rudderElement.message.properties;

        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );
        ga("ec:addPromo", {
          id: props.promotionId || props.id,
          name: props.name,
          creative: props.creative,
          position: props.position,
        });
        pushEnhancedEcommerce(rudderElement, this.inputs);
      } else if (event === "Promotion Clicked" && this.enhancedEcommerce) {
        var props = rudderElement.message.properties;
        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );

        ga("ec:addPromo", {
          id: props.promotionId || props.id,
          name: props.name,
          creative: props.creative,
          position: props.position,
        });
        ga("ec:setAction", "promo_click", {});
        pushEnhancedEcommerce(rudderElement, this.inputs);
      } else if (event === "Product List Viewed" && this.enhancedEcommerce) {
        var props = rudderElement.message.properties;
        var products = props.products;

        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );

        each(products, function (product) {
          var item = { properties: product };
          if (
            !(item.properties.product_id || item.properties.sku) &&
            !item.properties.name
          )
            return;
          var impressionObj = {
            id: item.properties.productId || item.properties.sku,
            name: item.properties.name,
            category: item.properties.category || props.category,
            list: props.list_id || props.category || "products",
            brand: item.properties.band,
            variant: item.properties.variant,
            price: item.properties.price,
            position: getProductPosition(item, products),
          };
          impressionObj = extend(
            impressionObj,
            metrics(
              item.properties,
              dimensionsArray,
              metricsArray,
              contentGroupingsArray
            )
          );

          for (var prop in impressionObj) {
            if (impressionObj[prop] === undefined) delete impressionObj[prop];
          }
          ga("ec:addImpression", impressionObj);
        });
        pushEnhancedEcommerce(rudderElement, this.inputs);
      } else if (event === "Product List Filtered" && this.enhancedEcommerce) {
        var props = rudderElement.message.properties;
        var products = props.products;
        props.filters = props.filters || [];
        props.sorters = props.sorters || [];
        var filters = props.filters
          .map(function (obj) {
            return obj.type + ":" + obj.value;
          })
          .join();
        var sorts = props.sorters
          .map(function (obj) {
            return obj.type + ":" + obj.value;
          })
          .join();

        this.enhancedEcommerceLoaded = loadEnhancedEcommerce(
          rudderElement,
          this.enhancedEcommerceLoaded
        );

        each(products, function (product) {
          var item = { properties: product };

          if (
            !(item.properties.product_id || item.properties.sku) &&
            !item.properties.name
          ) {
            return;
          }

          var impressionObj = {
            id: item.properties.product_id || item.sku,
            name: item.name,
            category: item.category || props.category,
            list: props.list_id || props.category || "search results",
            brand: props.brand,
            variant: filters + "::" + sorts,
            price: item.price,
            position: getProductPosition(item, products),
          };

          impressionObj = extend(
            impressionObj,
            metrics(
              item.properties,
              dimensionsArray,
              metricsArray,
              contentGroupingsArray
            )
          );

          for (var prop in impressionObj) {
            if (impressionObj[prop] === undefined) delete impressionObj[prop];
          }
          ga("ec:addImpression", impressionObj);
        });
        pushEnhancedEcommerce(rudderElement, this.inputs);
      } else {
        var contextOpts; //need to implement
        var interfaceOpts = this.inputs;
        var opts = defaults(options || {}, contextOpts);
        opts = defaults(opts, interfaceOpts);

        var eventCategory = rudderElement.message.properties.category;
        var eventAction = rudderElement.message.event;
        var eventLabel = rudderElement.message.properties.label;
        var eventValue = "";
        if (rudderElement.message.properties) {
          eventValue = rudderElement.message.properties.value
            ? rudderElement.message.properties.value
            : rudderElement.message.properties.revenue;
        }

        var payload = {
          eventCategory: eventCategory || "All",
          eventAction: eventAction,
          eventLabel: eventLabel,
          eventValue: formatValue(eventValue),
          nonInteraction:
            rudderElement.message.properties.nonInteraction !== undefined
              ? !!rudderElement.message.properties.nonInteraction
              : !!opts.nonInteraction,
        };

        var campaign = rudderElement.message.context.campaign;

        if (campaign) {
          if (campaign.name) payload.campaignName = campaign.name;
          if (campaign.source) payload.campaignSource = campaign.source;
          if (campaign.medium) payload.campaignMedium = campaign.medium;
          if (campaign.content) payload.campaignContent = campaign.content;
          if (campaign.term) payload.campaignKeyword = campaign.term;
        }

        payload = extend(
          payload,
          setCustomDimenionsAndMetrics(
            rudderElement.message.properties,
            this.inputs
          )
        );

        ga("send", "event", payload);
        logger.debug("in GoogleAnalyticsManager track");
      }
    }
  }

  page(rudderElement) {
    if (this.classic) {
      var props = rudderElement.message.properties;
      var category = props.category;
      var name = props.name;
      window._gaq.push("_trackPageview", path(this.props, this.includeSearch));

      if ((category && this, this.trackCategorizedPages)) {
        this.track(rudderElement, { nonInteraction: 1 });
      }

      if (name && this.trackNamedPages) {
        this.track(rudderElement, { nonInteraction: 1 });
      }
    } else {
      var dimensionsArray = {};
      for (let val of this.dimensions) {
        dimensionsArray[val.from] = val.to;
      }
      var metricsArray = {};
      for (let val of this.metrics) {
        metricsArray[val.from] = val.to;
      }
      var contentGroupingsArray = {};
      for (let val of this.contentGroupings) {
        contentGroupingsArray[val.from] = val.to;
      }
      console.log("in GoogleAnalyticsManager page");

      var category = rudderElement.message.properties.category;
      var eventProperties = rudderElement.message.properties;
      var name =
        rudderElement.message.properties.category +
        " " +
        rudderElement.message.name;
      var campaign = rudderElement.message.context.campaign | {};
      var pageview = {};
      var pagePath = path(eventProperties, this.includeSearch);
      var pageReferrer = rudderElement.message.properties.referrer || "";
      var pageTitle;
      if (
        !rudderElement.message.properties.category &&
        !rudderElement.message.name
      )
        pageTitle = eventProperties.title;
      else if (!rudderElement.message.properties.category)
        pageTitle = rudderElement.message.name;
      else if (!rudderElement.message.name)
        pageTitle = rudderElement.message.properties.category;
      else pageTitle = name;

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
        if (dimensionsArray[property]) {
          resetCustomDimensions[dimensionsArray[property]] = null;
        }
      }

      ga("set", resetCustomDimensions);
      pageview = extend(
        pageview,
        setCustomDimenionsAndMetrics(eventProperties, this.inputs)
      );

      if (pageReferrer !== document.referrer) payload.referrer = pageReferrer;

      ga("set", payload);

      if (this.pageCalled) delete pageview.location;

      ga("send", "pageview", pageview);

      if (category && this.trackCategorizedPages) {
        this.track(rudderElement, { nonInteraction: 1 });
      }

      if (name && this.trackNamedPages) {
        this.track(rudderElement, { nonInteraction: 1 });
      }
    }
  }

  isLoaded() {
    if (this.classic) {
      console.log("in GA isLoaded");

      return !!(window._gaq && window._gaq.push !== Array.prototype.push);
    } else {
      console.log("in GA isLoaded");
      console.log(!!window.gaplugins);
      return !!window.gaplugins;
    }
  }

  isReady() {
    if (this.classic) {
      return !!(window._gaq && window._gaq.push !== Array.prototype.push);
    } else {
      return !!window.gaplugins;
    }
  }
}
function metrics(obj, dimensions, metrics, contentGroupings) {
  var ret = {};

  each([metrics, dimensions, contentGroupings], function (group) {
    each(group, function (prop, key) {
      var value = obj[prop];
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
  var dimensionsArray = {};
  for (let val of inputs.dimensions) {
    dimensionsArray[val.from] = val.to;
  }
  var metricsArray = {};
  for (let val of inputs.metrics) {
    metricsArray[val.from] = val.to;
  }
  var contentGroupingsArray = {};
  for (let val of inputs.contentGroupings) {
    contentGroupingsArray[val.from] = val.to;
  }
  var custom = metrics(
    props,
    dimensionsArray,
    metricsArray,
    contentGroupingsArray
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

function createProductTrack(rudderElement, properties) {
  var props = properties || {};
  props.currency =
    properties.currency || rudderElement.message.properties.currency;
  return { properties: props };
}
function loadEnhancedEcommerce(rudderElement, a) {
  if (a === 0) {
    ga("require", "ec");
    a = 1;
  }

  ga("set", "&cu", rudderElement.message.properties.currency);
  return a;
}
function enhancedEcommerceTrackProduct(rudderElement, inputs) {
  var dimensionsArray = {};
  for (let val of inputs.dimensions) {
    dimensionsArray[val.from] = val.to;
  }
  var metricsArray = {};
  for (let val of inputs.metrics) {
    metricsArray[val.from] = val.to;
  }
  var contentGroupingsArray = {};
  for (let val of inputs.contentGroupings) {
    contentGroupingsArray[val.from] = val.to;
  }
  var props = rudderElement.message.properties;
  var product = {
    id: props.productId || props.id || props.sku,
    name: props.name,
    category: props.category,
    quantity: props.quantity,
    price: props.price,
    brand: props.brand,
    variant: props.variant,
    currency: props.currency,
  };

  if (props.position != null) {
    product.position = Math.round(props.position);
  }

  var coupon = props.coupon;
  if (coupon) product.coupon = coupon;
  product = extend(
    product,
    metrics(props, dimensionsArray, metricsArray, contentGroupingsArray)
  );

  ga("ec:addProduct", product);
}

function extractCheckoutOptions(rudderElement) {
  var options = [
    rudderElement.message.properties.paymentMethod,
    rudderElement.message.properties.shippingMethod,
  ];

  var valid = rejectArr(options);
  return valid.length > 0 ? valid.join(", ") : null;
}

function pushEnhancedEcommerce(rudderElement, inputs) {
  var args = rejectArr([
    "send",
    "event",
    rudderElement.message.properties.category || "EnhancedEcommerce",
    rudderElement.message.event || "Action not defined",
    rudderElement.message.properties.label,
    extend(
      {
        nonInteraction: 1,
      },
      setCustomDimenionsAndMetrics(rudderElement.message.properties, inputs)
    ),
  ]);

  var event = rudderElement.message.event;
  event = event.toLowerCase();
  var eventWithCategoryFieldProductScoped = [
    "product clicked",
    "product added",
    "product viewed",
    "product removed",
  ];
  if (eventWithCategoryFieldProductScoped.includes(event)) {
    args[2] = "EnhancedEcommerce";
  }

  ga.apply(window, args);
}

function enhancedEcommerceTrackProductAction(
  rudderElement,
  action,
  data,
  inputs
) {
  enhancedEcommerceTrackProduct(rudderElement, inputs);
  ga("ec:setAction", action, data || {});
}

function getProductPosition(item, products) {
  var position = item.properties.position;
  if (
    typeof position !== "undefined" &&
    !Number.isNaN(Number(position)) &&
    Number(position) > -1
  ) {
    return position;
  }
  return (
    products
      .map(function (x) {
        return x.product_id;
      })
      .indexOf(item.productId) + 1
  );
}

function rejectArr(obj, fn) {
  fn = fn || compact;
  return "array" == type(obj) ? rejectarray(obj, fn) : rejectobject(obj, fn);
}

var rejectarray = function (arr, fn) {
  var ret = [];

  for (var i = 0; i < arr.length; ++i) {
    if (!fn(arr[i], i)) ret[ret.length] = arr[i];
  }

  return ret;
};

var rejectobject = function (obj, fn) {
  var ret = {};

  for (var k in obj) {
    if (obj.hasOwnProperty(k) && !fn(obj[k], k)) {
      ret[k] = obj[k];
    }
  }

  return ret;
};

function compact(value) {
  return null == value;
}

function type(val) {
  switch (toString.call(val)) {
    case "[object Function]":
      return "function";
    case "[object Date]":
      return "date";
    case "[object RegExp]":
      return "regexp";
    case "[object Arguments]":
      return "arguments";
    case "[object Array]":
      return "array";
  }

  if (val === null) return "null";
  if (val === undefined) return "undefined";
  if (val === Object(val)) return "object";

  return typeof val;
}
export { GA };
