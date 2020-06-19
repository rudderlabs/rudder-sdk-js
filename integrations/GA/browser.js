import logger from "../../utils/logUtil";
import { rejectArr } from "../../utils/utils";
import is from "is";
import each from "component-each";
import { ScriptLoader } from "../ScriptLoader";

class GA {
  constructor(config) {
    this.trackingID = config.trackingID;
    this.sendUserId = config.sendUserId || false;
    this.dimensions = config.dimensions || [];
    this.metrics = config.metrics || [];
    this.contentGroupings = config.contentGroupings || [];
    this.nonInteraction = config.nonInteraction || false;
    this.anonymizeIp = config.anonymizeIp || false;
    this.useGoogleAmpClientId = config.useGoogleAmpClientId || false;

    this.domain = config.domain || "auto";
    this.doubleClick = config.doubleClick || false;
    this.enhancedEcommerce = config.enhancedEcommerce || false;
    this.enhancedLinkAttribution = config.enhancedLinkAttribution || false;

    this.includeSearch = config.includeSearch || false;
    this.setAllMappedProps = config.setAllMappedProps || true;
    this.siteSpeedSampleRate = config.siteSpeedSampleRate || 1;
    this.sampleRate = config.sampleRate || 100;
    this.trackCategorizedPages = config.trackCategorizedPages || true;
    this.trackNamedPages = config.trackNamedPages || true;
    this.optimizeContainerId = config.optimize || "";
    this.resetCustomDimensionsOnPage = config.resetCustomDimensionsOnPage || [];
    this.enhancedEcommerceLoaded = 0;
    this.name = "GA";
    this.eventWithCategoryFieldProductScoped = [
      "product clicked",
      "product added",
      "product viewed",
      "product removed"
    ];
  }

  loadScript() {
    ScriptLoader(
      "google-analytics",
      "https://www.google-analytics.com/analytics.js"
    );
  }

  init() {
    this.pageCalled = false;
    this.dimensionsArray = {};
    for (let val of this.dimensions) {
      this.dimensionsArray[val.from] = val.to;
    }
    this.metricsArray = {};
    for (let val of this.metrics) {
      this.metricsArray[val.from] = val.to;
    }
    this.contentGroupingsArray = {};
    for (let val of this.contentGroupings) {
      this.contentGroupingsArray[val.from] = val.to;
    }

    window.GoogleAnalyticsObject = "ga";
    window.ga =
      window.ga ||
      function () {
        window.ga.q = window.ga.q || [];
        window.ga.q.push(arguments);
      };
    window.ga.l = new Date().getTime();

    this.loadScript();

    //window.ga_debug = {trace: true};
    ga =
      ga ||
      function () {
        ga.q = ga.q || [];
        ga.q.push(arguments);
      };
    ga.l = new Date().getTime();

    //create ga with these properties. if the properties are empty it will take default values.
    var config = {
      cookieDomain: this.domain || GA.prototype.defaults.domain,
      siteSpeedSampleRate: this.siteSpeedSampleRate,
      sampleRate: this.sampleRate,
      allowLinker: true,
      useAmpClientId: this.useGoogleAmpClientId
      //   name: "rudder_ga"
    };

    window.ga("create", this.trackingID, config);

    if (this.optimizeContainerId) {
      window.ga("require", this.optimizeContainerId);
    }
    //ecommerce is required
    if (!this.ecommerce) {
      window.ga("require", "ecommerce");
      this.ecommerce = true;
    }
    //this is to display advertising
    if (this.doubleClick) {
      window.ga("require", "displayfeatures");
    }

    // https://support.google.com/analytics/answer/2558867?hl=en
    if (this.enhancedLinkAttribution) {
      window.ga("require", "linkid");
    }

    //a warning is in ga debugger if anonymize is false after initialization
    if (this.anonymizeIp) {
      window.ga("set", "anonymizeIp", true);
    }

    logger.debug("===in init GA===");
  }

  identify(rudderElement) {
    //send global id
    if (this.sendUserId && rudderElement.message.userId) {
      window.ga("set", "userId", rudderElement.message.userId);
    }

    //custom dimensions and metrics
    var custom = this.metricsFunction(
      rudderElement.message.context.traits,
      this.dimensionsArray,
      this.metricsArray,
      this.contentGroupingsArray
    );

    if (Object.keys(custom).length) window.ga("set", custom);

    logger.debug("in GoogleAnalyticsManager identify");
  }

  track(rudderElement, options) {
    var self = this;
    // Ecommerce events
    var event = rudderElement.message.event;

    if (event === "Order Completed" && !this.enhancedEcommerce) {
      var properties = rudderElement.message.properties;
      var total = properties.total;
      var orderId = properties.orderId;
      var products = properties.products;

      //orderId is required
      if (!orderId) return;

      //add transaction
      window.ga("ecommerce:addTransaction", {
        affiliation: properties.affiliation,
        shipping: properties.shipping,
        revenue: total,
        tax: properties.tax,
        id: orderId,
        currency: properties.currency
      });

      //products added
      each(products, function (product) {
        var productTrack = self.createProductTrack(rudderElement, product);

        window.ga("ecommerce:addItem", {
          category: productTrack.category,
          quantity: productTrack.quantity,
          price: productTrack.price,
          name: productTrack.name,
          sku: productTrack.sku,
          id: orderId,
          currency: productTrack.currency
        });
      });

      window.ga("ecommerce:send");
    }
    // enhanced ecommerce events
    else if (this.enhancedEcommerce) {
  
      switch (event) {
        case "Checkout Started":
        case "Checkout Step Viewed":
        case "Order Updated":
          var properties = rudderElement.message.properties;
          var products = properties.products;
          var options = this.extractCheckoutOptions(rudderElement);

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );
          each(products, function (product) {
            var productTrack = self.createProductTrack(rudderElement, product);
            productTrack = { message: productTrack };

            self.enhancedEcommerceTrackProduct(
              productTrack,
              self.dimensions,
              self.metrics,
              self.contentGroupings
            );
          });

          window.ga("ec:setAction", "checkout", {
            step: properties.step || 1,
            option: options || undefined
          });

          this.pushEnhancedEcommerce(
            rudderElement,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          break;
        case "Checkout Step Completed":
          var props = rudderElement.message.properties;
          var options = this.extractCheckoutOptions(rudderElement);
          console.log(options);
          if (!props.step) return;

          var params = {
            step: props.step || 1,
            option: options || undefined
          };

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );

          window.ga("ec:setAction", "checkout_option", params);
          window.ga("send", "event", "Checkout", "Option");
          break;
        case "Order Completed":
          var total =
            rudderElement.message.properties.total ||
            rudderElement.message.properties.revenue ||
            0;
          var orderId = rudderElement.message.properties.orderId;
          var products = rudderElement.message.properties.products;
          var props = rudderElement.message.properties;

          if (!orderId) return;

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );

          each(products, function (product) {
            var productTrack = self.createProductTrack(rudderElement, product);
            productTrack = { message: productTrack };
            self.enhancedEcommerceTrackProduct(
              productTrack,
              self.dimensions,
              self.metrics,
              self.contentGroupings
            );
          });
          window.ga("ec:setAction", "purchase", {
            id: orderId,
            affiliation: props.affiliation,
            revenue: total,
            tax: props.tax,
            shipping: props.shipping,
            coupon: props.coupon
          });

          this.pushEnhancedEcommerce(
            rudderElement,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          break;
        case "Order Refunded":
          var props = rudderElement.message.properties;
          var orderId = props.orderId;
          var products = props.products;

          if (!orderId) return;

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );

          each(products, function (product) {
            var track = { properties: product };
            window.ga("ec:addProduct", {
              id:
                track.properties.product_id ||
                track.properties.id ||
                track.properties.sku,
              quantity: track.properties.quantity
            });
          });

          window.ga("ec:setAction", "refund", {
            id: orderId
          });

          this.pushEnhancedEcommerce(
            rudderElement,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          break;
        case "Product Added":
          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );
          this.enhancedEcommerceTrackProductAction(
            rudderElement,
            "add",
            null,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          this.pushEnhancedEcommerce(
            rudderElement,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          break;
        case "Product Removed":
          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );
          this.enhancedEcommerceTrackProductAction(
            rudderElement,
            "remove",
            null,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          this.pushEnhancedEcommerce(
            rudderElement,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          break;
        case "Product Viewed":
          var props = rudderElement.message.properties;
          var data = {};
          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );

          if (props.list) data.list = props.list;
          this.enhancedEcommerceTrackProductAction(
            rudderElement,
            "detail",
            data,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          this.pushEnhancedEcommerce(
            rudderElement,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          break;
        case "Product Clicked":
          var props = rudderElement.message.properties;
          var data = {};
          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );

          if (props.list) data.list = props.list;
          this.enhancedEcommerceTrackProductAction(
            rudderElement,
            "click",
            data,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          this.pushEnhancedEcommerce(
            rudderElement,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          break;
        case "Promotion Viewed":
          var props = rudderElement.message.properties;

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );
          window.ga("ec:addPromo", {
            id: props.promotionId || props.id,
            name: props.name,
            creative: props.creative,
            position: props.position
          });
          this.pushEnhancedEcommerce(
            rudderElement,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          break;
        case "Promotion Clicked":
          var props = rudderElement.message.properties;
          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );

          window.ga("ec:addPromo", {
            id: props.promotionId || props.id,
            name: props.name,
            creative: props.creative,
            position: props.position
          });
          window.ga("ec:setAction", "promo_click", {});
          this.pushEnhancedEcommerce(
            rudderElement,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          break;
        case "Product List Viewed":
          var props = rudderElement.message.properties;
          var products = props.products;

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
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
              position: self.getProductPosition(item, products)
            };
            impressionObj = {
              impressionObj,
              ...self.metricsFunction(
                item.properties,
                self.dimensionsArray,
                self.metricsArray,
                self.contentGroupingsArray
              )
            };

            for (var prop in impressionObj) {
              if (impressionObj[prop] === undefined) delete impressionObj[prop];
            }
            window.ga("ec:addImpression", impressionObj);
          });
          this.pushEnhancedEcommerce(
            rudderElement,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          break;
        case "Product List Filtered":
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

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
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
              position: self.getProductPosition(item, products)
            };

            impressionObj = {
              impressionObj,
              ...self.metricsFunction(
                item.properties,
                self.dimensionsArray,
                self.metricsArray,
                self.contentGroupingsArray
              )
            };

            for (var prop in impressionObj) {
              if (impressionObj[prop] === undefined) delete impressionObj[prop];
            }
            window.ga("ec:addImpression", impressionObj);
          });
          this.pushEnhancedEcommerce(
            rudderElement,
            this.dimensions,
            this.metrics,
            this.contentGroupings
          );
          break;
        default:
          var eventCategory = rudderElement.message.properties.category;
          var eventAction =
            rudderElement.message.event || rudderElement.message.name || "";
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
            eventValue: this.formatValue(eventValue),
            // Allow users to override their nonInteraction integration setting for any single particluar event.
            nonInteraction:
              rudderElement.message.properties.nonInteraction !== undefined
                ? !!rudderElement.message.properties.nonInteraction
                : !!this.nonInteraction
          };

          var campaign = rudderElement.message.context.campaign;

          if (campaign) {
            if (campaign.name) payload.campaignName = campaign.name;
            if (campaign.source) payload.campaignSource = campaign.source;
            if (campaign.medium) payload.campaignMedium = campaign.medium;
            if (campaign.content) payload.campaignContent = campaign.content;
            if (campaign.term) payload.campaignKeyword = campaign.term;
          }

          payload = {
            payload,
            ...this.setCustomDimenionsAndMetrics(
              rudderElement.message.properties,
              this.dimensions,
              this.metrics,
              this.contentGroupings
            )
          };

          window.ga("send", "event", payload.payload);
          logger.debug("in GoogleAnalyticsManager track");
      }
    } else {
      var eventCategory = rudderElement.message.properties.category;
      var eventAction = rudderElement.message.event || "";
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
        eventValue: this.formatValue(eventValue),
        // Allow users to override their nonInteraction integration setting for any single particluar event.
        nonInteraction:
          rudderElement.message.properties.nonInteraction !== undefined
            ? !!rudderElement.message.properties.nonInteraction
            : !!this.nonInteraction
      };

      var campaign = rudderElement.message.context.campaign;

      if (campaign) {
        if (campaign.name) payload.campaignName = campaign.name;
        if (campaign.source) payload.campaignSource = campaign.source;
        if (campaign.medium) payload.campaignMedium = campaign.medium;
        if (campaign.content) payload.campaignContent = campaign.content;
        if (campaign.term) payload.campaignKeyword = campaign.term;
      }

      payload = {
        payload,
        ...this.setCustomDimenionsAndMetrics(
          rudderElement.message.properties,
          this.dimensions,
          this.metrics,
          this.contentGroupings
        )
      };

      window.ga("send", "event", payload.payload);
      logger.debug("in GoogleAnalyticsManager track");
    }
  }

  page(rudderElement) {
    logger.debug("in GoogleAnalyticsManager page");

    var category = rudderElement.message.properties.category;
    var eventProperties = rudderElement.message.properties;
    var name;
    if (
      rudderElement.message.properties.category &&
      rudderElement.message.name
    ) {
      name =
        rudderElement.message.properties.category +
        " " +
        rudderElement.message.name;
    } else if (
      !rudderElement.message.properties.category &&
      !rudderElement.message.name
    ) {
      name = "";
    } else {
      name =
        rudderElement.message.name || rudderElement.message.properties.category;
    }

    var campaign = rudderElement.message.context.campaign | {};
    var pageview = {};
    var pagePath = this.path(eventProperties, this.includeSearch);
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

    // Reset custom dimension which are previously set.
    // Uses the configured dimensions as:
    // this.dimensions: { "fruit": "dimension1" }
    // this.resetCustomDimensions: [ "fruit" ]
    // --> resetCustomDimensions: { "dimension1": null }

    var resetCustomDimensions = {};
    for (var i = 0; i < this.resetCustomDimensionsOnPage.length; i++) {
      var property = this.resetCustomDimensionsOnPage[i].resetCustomDimensionsOnPage;
      if (this.dimensionsArray[property]) {
        resetCustomDimensions[this.dimensionsArray[property]] = null;
      }
    }
    window.ga("set", resetCustomDimensions);

    //adds more properties to pageview which will be sent
    pageview = {
      ...pageview,
      ...this.setCustomDimenionsAndMetrics(
        eventProperties,
        this.dimensions,
        this.metrics,
        this.contentGroupings
      )
    };
    var payload = {
      page: pagePath,
      title: pageTitle
    };
    logger.debug(pageReferrer);
    logger.debug(document.referrer);
    if (pageReferrer !== document.referrer) payload.referrer = pageReferrer;

    window.ga("set", payload);

    if (this.pageCalled) delete pageview.location;

    window.ga("send", "pageview", pageview);

    //categorized pages
    if (category && this.trackCategorizedPages) {
      this.track(rudderElement, { nonInteraction: 1 });
    }

    //named pages
    if (name && this.trackNamedPages) {
      this.track(rudderElement, { nonInteraction: 1 });
    }
    this.pageCalled = true;
  }

  isLoaded() {
    logger.debug("in GA isLoaded");

    return !!window.gaplugins;
  }

  isReady() {
    return !!window.gaplugins;
  }
  /**
   *
   *
   * @param  {} obj  incoming properties
   * @param  {} dimensions   the dimension mapping which is entered by the user in the ui. Eg: firstName : dimension1
   * @param  {} metrics  the metrics mapping which is entered by the user in the ui. Eg: age : metrics1
   * @param  {} contentGroupings the contentGrouping mapping which is entered by the user in the ui. Eg: section : contentGrouping1
   *
   * This function maps these dimensions,metrics and contentGroupings with the incoming properties to send it to GA where the user has to set the corresponding dimension/metric/content group.
   * For example if:
   * if obj -> {age: 24}
   * metrics -> {age: metric1}
   * then the function will return {metric1:24} and it will be shown sent to GA if metric1 is set there.
   *
   * if obj -> {age: 24}
   * metrics - {revenue: metric2}
   * then the function will return {} as there is no corresponding mapping of metric.
   *
   */
  metricsFunction(obj, dimensions, metrics, contentGroupings) {
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
  formatValue(value) {
    if (!value || value < 0) return 0;
    return Math.round(value);
  }
  /**
   * @param  {} props
   * @param  {} inputs
   */
  setCustomDimenionsAndMetrics(props, dimensions, metrics, contentGroupings) {
    var ret = {};
    var dimensionsArray = {};
    for (let val of dimensions) {
      dimensionsArray[val.from] = val.to;
    }
    var metricsArray = {};
    for (let val of metrics) {
      metricsArray[val.from] = val.to;
    }
    var contentGroupingsArray = {};
    for (let val of contentGroupings) {
      contentGroupingsArray[val.from] = val.to;
    }
    var custom = this.metricsFunction(
      props,
      dimensionsArray,
      metricsArray,
      contentGroupingsArray
    );
    if (Object.keys(custom).length) {
      if (this.setAllMappedProps) {
        window.ga("set", custom);
      } else {
        each(custom, function (key, value) {
          ret[key] = value;
        });
        return ret;
      }
    }
  }
  /**
   *  Return the path based on `properties` and `options`
   *
   * @param  {} properties
   * @param  {} includeSearch
   */
  path(properties, includeSearch) {
    if (!properties) return;
    var str = properties.path;
    if (includeSearch && properties.search) str += properties.search;
    return str;
  }
  /**
   * Creates a track out of product properties
   * @param  {} rudderElement
   * @param  {} properties
   */
  createProductTrack(rudderElement, properties) {
    var props = properties || {};
    props.currency =
      properties.currency || rudderElement.message.properties.currency;
    return { properties: props };
  }
  /**
   * Loads ec.js (unless already loaded)
   * @param  {} rudderElement
   * @param  {} a
   */
  loadEnhancedEcommerce(rudderElement, a) {
    if (a === 0) {
      window.ga("require", "ec");
      a = 1;
    }

    window.ga("set", "&cu", rudderElement.message.properties.currency);
    return a;
  }

  /**
   * helper class to not repeat `ec:addProduct`
   * @param  {} rudderElement
   * @param  {} inputs
   */
  enhancedEcommerceTrackProduct(
    rudderElement,
    dimensions,
    metrics,
    contentGroupings
  ) {
    var dimensionsArray = {};
    for (let val of dimensions) {
      dimensionsArray[val.from] = val.to;
    }
    var metricsArray = {};
    for (let val of metrics) {
      metricsArray[val.from] = val.to;
    }
    var contentGroupingsArray = {};
    for (let val of contentGroupings) {
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
      currency: props.currency
    };

    if (props.position != null) {
      product.position = Math.round(props.position);
    }

    var coupon = props.coupon;
    if (coupon) product.coupon = coupon;
    product = {
      product,
      ...this.metricsFunction(
        props,
        dimensionsArray,
        metricsArray,
        contentGroupingsArray
      )
    };
    

    window.ga("ec:addProduct", product.product);
  }

  /**
   * set action with data
   * @param  {} rudderElement
   * @param  {} action
   * @param  {} data
   * @param  {} inputs
   */
  enhancedEcommerceTrackProductAction(
    rudderElement,
    action,
    data,
    dimensions,
    metrics,
    contentGroupings
  ) {
    this.enhancedEcommerceTrackProduct(
      rudderElement,
      dimensions,
      metrics,
      contentGroupings
    );
    window.ga("ec:setAction", action, data || {});
  }
  /**
   * @param  {} rudderElement
   * @param  {} inputs
   */
  pushEnhancedEcommerce(rudderElement, dimensions, metrics, contentGroupings) {
    var args = rejectArr([
      "send",
      "event",
      rudderElement.message.properties.category || "EnhancedEcommerce",
      rudderElement.message.event || "Action not defined",
      rudderElement.message.properties.label,
      {
        nonInteraction: 1,

        ...this.setCustomDimenionsAndMetrics(
          rudderElement.message.properties,
          dimensions,
          metrics,
          contentGroupings
        )
      }
    ]);

    var event = rudderElement.message.event;
    event = event.toLowerCase();

    if (this.eventWithCategoryFieldProductScoped.includes(event)) {
      args[2] = "EnhancedEcommerce";
    }

    ga.apply(window, args);
  }
  /**
   * @param  {} item
   * @param  {} products
   */
  getProductPosition(item, products) {
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
        .indexOf(item.properties.product_id) + 1
    );
  }
  /**
   *extracts checkout options
   * @param  {} rudderElement
   */
  extractCheckoutOptions(rudderElement) {
    var options = [
      rudderElement.message.properties.paymentMethod,
      rudderElement.message.properties.shippingMethod
    ];
    //remove all nulls and join with commas.
    var valid = rejectArr(options);
    return valid.length > 0 ? valid.join(", ") : null;
  }
}
export { GA };
