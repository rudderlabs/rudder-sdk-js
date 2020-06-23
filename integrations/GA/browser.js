import is from "is";
import each from "component-each";
import extend from "extend";
import defaults from "@ndhoule/defaults";
import { rejectArr } from "../../utils/utils";
import logger from "../../utils/logUtil";

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
    this.inputs = config;
    this.enhancedEcommerceLoaded = 0;
    this.name = "GA";
    this.eventWithCategoryFieldProductScoped = [
      "product clicked",
      "product added",
      "product viewed",
      "product removed",
    ];
  }

  init() {
    this.pageCalled = false;
    this.dimensionsArray = {};
    for (const val of this.dimensions) {
      this.dimensionsArray[val.from] = val.to;
    }
    this.metricsArray = {};
    for (const val of this.metrics) {
      this.metricsArray[val.from] = val.to;
    }
    this.contentGroupingsArray = {};
    for (const val of this.contentGroupings) {
      this.contentGroupingsArray[val.from] = val.to;
    }

    (function (i, s, o, g, r, a, m) {
      i.GoogleAnalyticsObject = r;
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
    // window.ga_debug = {trace: true};
    ga =
      ga ||
      function () {
        ga.q = ga.q || [];
        ga.q.push(arguments);
      };
    ga.l = new Date().getTime();

    // create ga with these properties. if the properties are empty it will take default values.
    const config = {
      cookieDomain: this.domain || GA.prototype.defaults.domain,
      siteSpeedSampleRate: this.siteSpeedSampleRate,
      sampleRate: this.sampleRate,
      allowLinker: true,
      useAmpClientId: this.useGoogleAmpClientId,
      //   name: "rudder_ga"
    };

    ga("create", this.trackingID, config);

    if (this.optimizeContainerId) {
      ga("require", this.optimizeContainerId);
    }
    // ecommerce is required
    if (!this.ecommerce) {
      ga("require", "ecommerce");
      this.ecommerce = true;
    }
    // this is to display advertising
    if (this.doubleClick) {
      ga("require", "displayfeatures");
    }

    // https://support.google.com/analytics/answer/2558867?hl=en
    if (this.enhancedLinkAttribution) {
      ga("require", "linkid");
    }

    // a warning is in ga debugger if anonymize is false after initialization
    if (this.anonymizeIp) {
      ga("set", "anonymizeIp", true);
    }

    logger.debug("===in init GA===");
  }

  identify(rudderElement) {
    // send global id
    if (this.sendUserId && rudderElement.message.userId) {
      ga("set", "userId", rudderElement.message.userId);
    }

    // custom dimensions and metrics
    const custom = this.metricsFunction(
      rudderElement.message.context.traits,
      this.dimensionsArray,
      this.metricsArray,
      this.contentGroupingsArray
    );

    console.log(Object.keys(custom).length);

    if (Object.keys(custom).length) ga("set", custom);

    logger.debug("in GoogleAnalyticsManager identify");
  }

  track(rudderElement, options) {
    const self = this;
    // Ecommerce events
    const { event } = rudderElement.message;

    if (event === "Order Completed" && !this.enhancedEcommerce) {
      var { properties } = rudderElement.message;
      var { total } = properties;
      var { orderId } = properties;
      var { products } = properties;

      // orderId is required
      if (!orderId) return;

      // add transaction
      ga("ecommerce:addTransaction", {
        affiliation: properties.affiliation,
        shipping: properties.shipping,
        revenue: total,
        tax: properties.tax,
        id: orderId,
        currency: properties.currency,
      });

      // products added
      each(products, function (product) {
        const productTrack = self.createProductTrack(rudderElement, product);

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
    else if (this.enhancedEcommerce) {
      switch (event) {
        case "Checkout Started":
        case "Checkout Step Viewed":
        case "Order Updated":
          var { properties } = rudderElement.message;
          var { products } = properties;
          var options = this.extractCheckoutOptions(rudderElement);

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );
          each(products, function (product) {
            let productTrack = self.createProductTrack(rudderElement, product);
            productTrack = { message: productTrack };

            self.enhancedEcommerceTrackProduct(productTrack, self.inputs);
          });

          ga("ec:setAction", "checkout", {
            step: properties.step || 1,
            option: options || undefined,
          });

          this.pushEnhancedEcommerce(rudderElement, this.inputs);
          break;
        case "Checkout Step Completed":
          var props = rudderElement.message.properties;
          var options = this.extractCheckoutOptions(rudderElement);

          if (!props.step) return;

          var params = {
            step: props.step || 1,
            option: options || undefined,
          };

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );

          ga("ec:setAction", "checkout_option", params);
          ga("send", "event", "Checkout", "Option");
          break;
        case "Order Completed":
          var total =
            rudderElement.message.properties.total ||
            rudderElement.message.properties.revenue ||
            0;
          var { orderId } = rudderElement.message.properties;
          var { products } = rudderElement.message.properties;
          var props = rudderElement.message.properties;

          if (!orderId) return;

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );

          each(products, function (product) {
            let productTrack = self.createProductTrack(rudderElement, product);
            productTrack = { message: productTrack };
            self.enhancedEcommerceTrackProduct(productTrack, self.inputs);
          });
          ga("ec:setAction", "purchase", {
            id: orderId,
            affiliation: props.affiliation,
            revenue: total,
            tax: props.tax,
            shipping: props.shipping,
            coupon: props.coupon,
          });

          this.pushEnhancedEcommerce(rudderElement, this.inputs);
          break;
        case "Order Refunded":
          var props = rudderElement.message.properties;
          var { orderId } = props;
          var { products } = props;

          if (!orderId) return;

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );

          each(products, function (product) {
            const track = { properties: product };
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

          this.pushEnhancedEcommerce(rudderElement, this.inputs);
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
            this.inputs
          );
          this.pushEnhancedEcommerce(rudderElement, this.inputs);
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
            this.inputs
          );
          this.pushEnhancedEcommerce(rudderElement, this.inputs);
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
            this.inputs
          );
          this.pushEnhancedEcommerce(rudderElement, this.inputs);
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
            this.inputs
          );
          this.pushEnhancedEcommerce(rudderElement, this.inputs);
          break;
        case "Promotion Viewed":
          var props = rudderElement.message.properties;

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );
          ga("ec:addPromo", {
            id: props.promotionId || props.id,
            name: props.name,
            creative: props.creative,
            position: props.position,
          });
          this.pushEnhancedEcommerce(rudderElement, this.inputs);
          break;
        case "Promotion Clicked":
          var props = rudderElement.message.properties;
          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
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
          this.pushEnhancedEcommerce(rudderElement, this.inputs);
          break;
        case "Product List Viewed":
          var props = rudderElement.message.properties;
          var { products } = props;

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );

          each(products, function (product) {
            const item = { properties: product };
            if (
              !(item.properties.product_id || item.properties.sku) &&
              !item.properties.name
            )
              return;
            let impressionObj = {
              id: item.properties.productId || item.properties.sku,
              name: item.properties.name,
              category: item.properties.category || props.category,
              list: props.list_id || props.category || "products",
              brand: item.properties.band,
              variant: item.properties.variant,
              price: item.properties.price,
              position: self.getProductPosition(item, products),
            };
            impressionObj = {
              impressionObj,
              ...self.metricsFunction(
                item.properties,
                self.dimensionsArray,
                self.metricsArray,
                self.contentGroupingsArray
              ),
            };

            for (const prop in impressionObj) {
              if (impressionObj[prop] === undefined) delete impressionObj[prop];
            }
            ga("ec:addImpression", impressionObj);
          });
          this.pushEnhancedEcommerce(rudderElement, this.inputs);
          break;
        case "Product List Filtered":
          var props = rudderElement.message.properties;
          var { products } = props;
          props.filters = props.filters || [];
          props.sorters = props.sorters || [];
          var filters = props.filters
            .map(function (obj) {
              return `${obj.type}:${obj.value}`;
            })
            .join();
          var sorts = props.sorters
            .map(function (obj) {
              return `${obj.type}:${obj.value}`;
            })
            .join();

          this.enhancedEcommerceLoaded = this.loadEnhancedEcommerce(
            rudderElement,
            this.enhancedEcommerceLoaded
          );

          each(products, function (product) {
            const item = { properties: product };

            if (
              !(item.properties.product_id || item.properties.sku) &&
              !item.properties.name
            ) {
              return;
            }

            let impressionObj = {
              id: item.properties.product_id || item.sku,
              name: item.name,
              category: item.category || props.category,
              list: props.list_id || props.category || "search results",
              brand: props.brand,
              variant: `${filters}::${sorts}`,
              price: item.price,
              position: self.getProductPosition(item, products),
            };

            impressionObj = {
              impressionObj,
              ...self.metricsFunction(
                item.properties,
                self.dimensionsArray,
                self.metricsArray,
                self.contentGroupingsArray
              ),
            };

            for (const prop in impressionObj) {
              if (impressionObj[prop] === undefined) delete impressionObj[prop];
            }
            ga("ec:addImpression", impressionObj);
          });
          this.pushEnhancedEcommerce(rudderElement, this.inputs);
          break;
        default:
          var interfaceOpts = this.inputs;
          var opts = options || {};
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
            eventAction,
            eventLabel,
            eventValue: this.formatValue(eventValue),
            // Allow users to override their nonInteraction integration setting for any single particluar event.
            nonInteraction:
              rudderElement.message.properties.nonInteraction !== undefined
                ? !!rudderElement.message.properties.nonInteraction
                : !!opts.nonInteraction,
          };

          var { campaign } = rudderElement.message.context;

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
              this.inputs
            ),
          };

          ga("send", "event", payload);
          logger.debug("in GoogleAnalyticsManager track");
      }
    } else {
      let contextOpts; // need to implement
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
        eventAction,
        eventLabel,
        eventValue: this.formatValue(eventValue),
        // Allow users to override their nonInteraction integration setting for any single particluar event.
        nonInteraction:
          rudderElement.message.properties.nonInteraction !== undefined
            ? !!rudderElement.message.properties.nonInteraction
            : !!opts.nonInteraction,
      };

      var { campaign } = rudderElement.message.context;

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
          this.inputs
        ),
      };

      ga("send", "event", payload);
      logger.debug("in GoogleAnalyticsManager track");
    }
  }

  page(rudderElement) {
    logger.debug("in GoogleAnalyticsManager page");

    const { category } = rudderElement.message.properties;
    const eventProperties = rudderElement.message.properties;
    const name = `${rudderElement.message.properties.category} ${rudderElement.message.name}`;
    const campaign = rudderElement.message.context.campaign | {};
    let pageview = {};
    const pagePath = this.path(eventProperties, this.includeSearch);
    const pageReferrer = rudderElement.message.properties.referrer || "";
    let pageTitle;
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

    const resetCustomDimensions = {};
    for (let i = 0; i < this.resetCustomDimensionsOnPage.length; i++) {
      const property = this.resetCustomDimensionsOnPage[i];
      if (this.dimensionsArray[property]) {
        resetCustomDimensions[this.dimensionsArray[property]] = null;
      }
    }

    ga("set", resetCustomDimensions);

    // adds more properties to pageview which will be sent
    pageview = {
      pageview,
      ...this.setCustomDimenionsAndMetrics(eventProperties, this.inputs),
    };
    const payload = {
      page: pagePath,
      title: pageTitle,
    };
    if (pageReferrer !== document.referrer) payload.referrer = pageReferrer;

    ga("set", payload);

    if (this.pageCalled) delete pageview.location;

    ga("send", "pageview", pageview);

    // categorized pages
    if (category && this.trackCategorizedPages) {
      this.track(rudderElement, { nonInteraction: 1 });
    }

    // named pages
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
    const ret = {};

    each([metrics, dimensions, contentGroupings], function (group) {
      each(group, function (prop, key) {
        let value = obj[prop];
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
  setCustomDimenionsAndMetrics(props, inputs) {
    const ret = {};
    const dimensionsArray = {};
    for (const val of inputs.dimensions) {
      dimensionsArray[val.from] = val.to;
    }
    const metricsArray = {};
    for (const val of inputs.metrics) {
      metricsArray[val.from] = val.to;
    }
    const contentGroupingsArray = {};
    for (const val of inputs.contentGroupings) {
      contentGroupingsArray[val.from] = val.to;
    }
    const custom = this.metricsFunction(
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

  /**
   *  Return the path based on `properties` and `options`
   *
   * @param  {} properties
   * @param  {} includeSearch
   */
  path(properties, includeSearch) {
    if (!properties) return;
    let str = properties.path;
    if (includeSearch && properties.search) str += properties.search;
    return str;
  }

  /**
   * Creates a track out of product properties
   * @param  {} rudderElement
   * @param  {} properties
   */
  createProductTrack(rudderElement, properties) {
    const props = properties || {};
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
      ga("require", "ec");
      a = 1;
    }

    ga("set", "&cu", rudderElement.message.properties.currency);
    return a;
  }

  /**
   * helper class to not repeat `ec:addProduct`
   * @param  {} rudderElement
   * @param  {} inputs
   */
  enhancedEcommerceTrackProduct(rudderElement, inputs) {
    const dimensionsArray = {};
    for (const val of inputs.dimensions) {
      dimensionsArray[val.from] = val.to;
    }
    const metricsArray = {};
    for (const val of inputs.metrics) {
      metricsArray[val.from] = val.to;
    }
    const contentGroupingsArray = {};
    for (const val of inputs.contentGroupings) {
      contentGroupingsArray[val.from] = val.to;
    }

    const props = rudderElement.message.properties;

    let product = {
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

    const { coupon } = props;
    if (coupon) product.coupon = coupon;
    product = {
      product,
      ...this.metricsFunction(
        props,
        dimensionsArray,
        metricsArray,
        contentGroupingsArray
      ),
    };

    ga("ec:addProduct", product);
  }

  /**
   * set action with data
   * @param  {} rudderElement
   * @param  {} action
   * @param  {} data
   * @param  {} inputs
   */
  enhancedEcommerceTrackProductAction(rudderElement, action, data, inputs) {
    this.enhancedEcommerceTrackProduct(rudderElement, inputs);
    ga("ec:setAction", action, data || {});
  }

  /**
   * @param  {} rudderElement
   * @param  {} inputs
   */
  pushEnhancedEcommerce(rudderElement, inputs) {
    const args = rejectArr([
      "send",
      "event",
      rudderElement.message.properties.category || "EnhancedEcommerce",
      rudderElement.message.event || "Action not defined",
      rudderElement.message.properties.label,
      {
        nonInteraction: 1,

        ...this.setCustomDimenionsAndMetrics(
          rudderElement.message.properties,
          inputs
        ),
      },
    ]);

    let { event } = rudderElement.message;
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
    const { position } = item.properties;

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
    const options = [
      rudderElement.message.properties.paymentMethod,
      rudderElement.message.properties.shippingMethod,
    ];
    // remove all nulls and join with commas.
    const valid = rejectArr(options);
    return valid.length > 0 ? valid.join(", ") : null;
  }
}
export { GA };
