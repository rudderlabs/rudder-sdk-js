/* eslint-disable class-methods-use-this */
import is from "is";
import each from "component-each";
import logger from "../../utils/logUtil";
import { rejectArr } from "./utils";
import ScriptLoader from "../ScriptLoader";

export default class GA {
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
      "product removed",
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
    let elementTo;
    this.dimensions.forEach((element) => {
      if (element.to.startsWith("dimension")) {
        this.dimensionsArray[element.from] = element.to;
      } else {
        /* eslint-disable no-param-reassign */
        elementTo = element.to.replace(/cd/g, "dimension");
        this.dimensionsArray[element.from] = elementTo;
      }
    });
    this.metricsArray = {};
    this.metrics.forEach((element) => {
      if (element.to.startsWith("dimension")) {
        this.metricsArray[element.from] = element.to;
      } else {
        elementTo = element.to.replace(/cm/g, "metric");
        this.metricsArray[element.from] = elementTo;
      }
    });
    this.contentGroupingsArray = {};
    this.contentGroupings.forEach((element) => {
      this.contentGroupingsArray[element.from] = element.to;
    });
    window.GoogleAnalyticsObject = "ga";
    window.ga =
      window.ga ||
      function a() {
        window.ga.q = window.ga.q || [];
        window.ga.q.push(arguments);
      };
    window.ga.l = new Date().getTime();

    this.loadScript();

    // create ga with these properties. if the properties are empty it will take default values.
    const config = {
      cookieDomain: this.domain || GA.prototype.defaults.domain,
      siteSpeedSampleRate: this.siteSpeedSampleRate,
      sampleRate: this.sampleRate,
      allowLinker: true,
      useAmpClientId: this.useGoogleAmpClientId,
    };

    window.ga("create", this.trackingID, config);

    if (this.optimizeContainerId) {
      window.ga("require", this.optimizeContainerId);
    }

    // ecommerce is required
    if (!this.ecommerce) {
      window.ga("require", "ecommerce");
      this.ecommerce = true;
    }

    // this is to display advertising
    if (this.doubleClick) {
      window.ga("require", "displayfeatures");
    }

    // https://support.google.com/analytics/answer/2558867?hl=en
    if (this.enhancedLinkAttribution) {
      window.ga("require", "linkid");
    }

    // a warning is in ga debugger if anonymize is false after initialization
    if (this.anonymizeIp) {
      window.ga("set", "anonymizeIp", true);
    }

    logger.debug("===in init GA===");
  }

  identify(rudderElement) {
    // send global id
    if (this.sendUserId && rudderElement.message.userId) {
      window.ga("set", "userId", rudderElement.message.userId);
    }

    // custom dimensions and metrics
    const custom = this.metricsFunction(
      rudderElement.message.context.traits,
      this.dimensionsArray,
      this.metricsArray,
      this.contentGroupingsArray
    );

    if (Object.keys(custom).length) {
      window.ga("set", custom);
    }

    logger.debug("in GoogleAnalyticsManager identify");
  }

  track(rudderElement) {
    const self = this;
    // Ecommerce events
    const { event, properties, name } = rudderElement.message;
    const options = this.extractCheckoutOptions(rudderElement);
    const props = rudderElement.message.properties;
    const { products } = properties;
    let { total } = properties;
    const data = {};
    const eventCategory = rudderElement.message.properties.category;
    const orderId = properties.order_id;
    const eventAction = event || name || "";
    const eventLabel = rudderElement.message.properties.label;
    let eventValue = "";
    let payload;
    const { campaign } = rudderElement.message.context;
    let params;
    let filters;
    let sorts;
    if (event === "Order Completed" && !this.enhancedEcommerce) {
      // order_id is required
      if (!orderId) {
        logger.debug("order_id not present events are not sent to GA");
        return;
      }

      // add transaction
      window.ga("ecommerce:addTransaction", {
        affiliation: properties.affiliation,
        shipping: properties.shipping,
        revenue: total,
        tax: properties.tax,
        id: orderId,
        currency: properties.currency,
      });

      // products added
      products.forEach((product) => {
        const productTrack = self.createProductTrack(rudderElement, product);

        window.ga("ecommerce:addItem", {
          category: productTrack.properties.category,
          quantity: productTrack.properties.quantity,
          price: productTrack.properties.price,
          name: productTrack.properties.name,
          sku: productTrack.properties.sku,
          id: orderId,
          currency: productTrack.properties.currency,
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
          this.loadEnhancedEcommerce(rudderElement);
          each(products, (product) => {
            let productTrack = self.createProductTrack(rudderElement, product);
            productTrack = { message: productTrack };

            self.enhancedEcommerceTrackProduct(productTrack);
          });

          window.ga("ec:setAction", "checkout", {
            step: properties.step || 1,
            option: options || undefined,
          });

          this.pushEnhancedEcommerce(rudderElement);
          break;
        case "Checkout Step Completed":
          if (!props.step) {
            logger.debug("step not present events are not sent to GA");
            return;
          }
          params = {
            step: props.step || 1,
            option: options || undefined,
          };

          this.loadEnhancedEcommerce(rudderElement);

          window.ga("ec:setAction", "checkout_option", params);
          window.ga("send", "event", "Checkout", "Option");
          break;
        case "Order Completed":
          total =
            rudderElement.message.properties.total ||
            rudderElement.message.properties.revenue ||
            0;

          if (!orderId) {
            logger.debug("order_id not present events are not sent to GA");
            return;
          }
          this.loadEnhancedEcommerce(rudderElement);

          each(products, (product) => {
            let productTrack = self.createProductTrack(rudderElement, product);
            productTrack = { message: productTrack };
            self.enhancedEcommerceTrackProduct(productTrack);
          });
          window.ga("ec:setAction", "purchase", {
            id: orderId,
            affiliation: props.affiliation,
            revenue: total,
            tax: props.tax,
            shipping: props.shipping,
            coupon: props.coupon,
          });

          this.pushEnhancedEcommerce(rudderElement);
          break;
        case "Order Refunded":
          if (!orderId) {
            logger.debug("order_id not present events are not sent to GA");
            return;
          }
          this.loadEnhancedEcommerce(rudderElement);

          each(products, (product) => {
            const track = { properties: product };
            window.ga("ec:addProduct", {
              id:
                track.properties.product_id ||
                track.properties.id ||
                track.properties.sku,
              quantity: track.properties.quantity,
            });
          });

          window.ga("ec:setAction", "refund", {
            id: orderId,
          });

          this.pushEnhancedEcommerce(rudderElement);
          break;
        case "Product Added":
          this.loadEnhancedEcommerce(rudderElement);
          this.enhancedEcommerceTrackProductAction(rudderElement, "add", null);
          this.pushEnhancedEcommerce(rudderElement);
          break;
        case "Product Removed":
          this.loadEnhancedEcommerce(rudderElement);
          this.enhancedEcommerceTrackProductAction(
            rudderElement,
            "remove",
            null
          );
          this.pushEnhancedEcommerce(rudderElement);
          break;
        case "Product Viewed":
          this.loadEnhancedEcommerce(rudderElement);

          if (props.list) data.list = props.list;
          this.enhancedEcommerceTrackProductAction(
            rudderElement,
            "detail",
            data
          );
          this.pushEnhancedEcommerce(rudderElement);
          break;
        case "Product Clicked":
          this.loadEnhancedEcommerce(rudderElement);

          if (props.list) data.list = props.list;
          this.enhancedEcommerceTrackProductAction(
            rudderElement,
            "click",
            data
          );
          this.pushEnhancedEcommerce(rudderElement);
          break;
        case "Promotion Viewed":
          this.loadEnhancedEcommerce(rudderElement);
          window.ga("ec:addPromo", {
            id: props.promotion_id || props.id,
            name: props.name,
            creative: props.creative,
            position: props.position,
          });
          this.pushEnhancedEcommerce(rudderElement);
          break;
        case "Promotion Clicked":
          this.loadEnhancedEcommerce(rudderElement);

          window.ga("ec:addPromo", {
            id: props.promotion_id || props.id,
            name: props.name,
            creative: props.creative,
            position: props.position,
          });
          window.ga("ec:setAction", "promo_click", {});
          this.pushEnhancedEcommerce(rudderElement);
          break;
        case "Product List Viewed":
          this.loadEnhancedEcommerce(rudderElement);

          each(products, (product) => {
            const item = { properties: product };
            if (
              !(item.properties.product_id || item.properties.sku) &&
              !item.properties.name
            ) {
              logger.debug(
                "product_id/sku/name of product not present events are not sent to GA"
              );
              return;
            }
            let impressionObj = {
              id: item.properties.product_id || item.properties.sku,
              name: item.properties.name,
              category: item.properties.category || props.category,
              list: props.list_id || props.category || "products",
              brand: item.properties.band,
              variant: item.properties.variant,
              price: item.properties.price,
              position: self.getProductPosition(item, products),
            };
            impressionObj = {
              ...impressionObj,
              ...self.metricsFunction(
                item.properties,
                self.dimensionsArray,
                self.metricsArray,
                self.contentGroupingsArray
              ),
            };
            Object.keys(impressionObj).forEach((key) => {
              if (impressionObj[key] === undefined) delete impressionObj[key];
            });
            window.ga("ec:addImpression", impressionObj);
          });
          this.pushEnhancedEcommerce(rudderElement);
          break;
        case "Product List Filtered":
          props.filters = props.filters || [];
          props.sorters = props.sorters || [];
          filters = props.filters
            .map((obj) => {
              return `${obj.type}:${obj.value}`;
            })
            .join();
          sorts = props.sorters
            .map((obj) => {
              return `${obj.type}:${obj.value}`;
            })
            .join();

          this.loadEnhancedEcommerce(rudderElement);

          each(products, (product) => {
            const item = { properties: product };

            if (
              !(item.properties.product_id || item.properties.sku) &&
              !item.properties.name
            ) {
              logger.debug(
                "product_id/sku/name of product not present events are not sent to GA"
              );
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
            Object.keys(impressionObj).forEach((key) => {
              if (impressionObj[key] === undefined) delete impressionObj[key];
            });
            window.ga("ec:addImpression", impressionObj);
          });
          this.pushEnhancedEcommerce(rudderElement);
          break;
        default:
          if (rudderElement.message.properties) {
            eventValue = rudderElement.message.properties.value
              ? rudderElement.message.properties.value
              : rudderElement.message.properties.revenue;
          }

          payload = {
            eventCategory: eventCategory || "All",
            eventAction,
            eventLabel,
            eventValue: this.formatValue(eventValue),
            // Allow users to override their nonInteraction integration setting for any single particluar event.
            nonInteraction:
              rudderElement.message.properties.nonInteraction !== undefined
                ? !!rudderElement.message.properties.nonInteraction
                : !!this.nonInteraction,
          };

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
              rudderElement.message.properties
            ),
          };

          window.ga("send", "event", payload.payload);
          logger.debug("in GoogleAnalyticsManager track");
      }
    } else {
      if (rudderElement.message.properties) {
        eventValue = rudderElement.message.properties.value
          ? rudderElement.message.properties.value
          : rudderElement.message.properties.revenue;
      }

      payload = {
        eventCategory: eventCategory || "All",
        eventAction,
        eventLabel,
        eventValue: this.formatValue(eventValue),
        // Allow users to override their nonInteraction integration setting for any single particluar event.
        nonInteraction:
          rudderElement.message.properties.nonInteraction !== undefined
            ? !!rudderElement.message.properties.nonInteraction
            : !!this.nonInteraction,
      };

      if (campaign) {
        if (campaign.name) payload.campaignName = campaign.name;
        if (campaign.source) payload.campaignSource = campaign.source;
        if (campaign.medium) payload.campaignMedium = campaign.medium;
        if (campaign.content) payload.campaignContent = campaign.content;
        if (campaign.term) payload.campaignKeyword = campaign.term;
      }

      payload = {
        payload,
        ...this.setCustomDimenionsAndMetrics(rudderElement.message.properties),
      };

      window.ga("send", "event", payload.payload);
      logger.debug("in GoogleAnalyticsManager track");
    }
  }

  page(rudderElement) {
    logger.debug("in GoogleAnalyticsManager page");

    const { category } = rudderElement.message.properties;
    const eventProperties = rudderElement.message.properties;
    let name;
    if (
      rudderElement.message.properties.category &&
      rudderElement.message.name
    ) {
      name = `${rudderElement.message.properties.category} ${rudderElement.message.name}`;
    } else if (
      !rudderElement.message.properties.category &&
      !rudderElement.message.name
    ) {
      name = "";
    } else {
      name =
        rudderElement.message.name || rudderElement.message.properties.category;
    }

    const campaign = rudderElement.message.context.campaign || {};
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

    const resetCustomDimensions = {};
    for (let i = 0; i < this.resetCustomDimensionsOnPage.length; i += 1) {
      const property = this.resetCustomDimensionsOnPage[i]
        .resetCustomDimensionsOnPage;
      if (this.dimensionsArray[property]) {
        resetCustomDimensions[this.dimensionsArray[property]] = null;
      }
    }
    window.ga("set", resetCustomDimensions);

    // adds more properties to pageview which will be sent
    pageview = {
      ...pageview,
      ...this.setCustomDimenionsAndMetrics(eventProperties),
    };
    const payload = {
      page: pagePath,
      title: pageTitle,
    };
    logger.debug(pageReferrer);
    logger.debug(document.referrer);
    if (pageReferrer !== document.referrer) payload.referrer = pageReferrer;

    window.ga("set", payload);

    if (this.pageCalled) delete pageview.location;

    window.ga("send", "pageview", pageview);

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

    each([metrics, dimensions, contentGroupings], (group) => {
      each(group, (prop, key) => {
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
  setCustomDimenionsAndMetrics(props) {
    const ret = {};
    const custom = this.metricsFunction(
      props,
      this.dimensionsArray,
      this.metricsArray,
      this.contentGroupingsArray
    );
    if (Object.keys(custom).length) {
      if (this.setAllMappedProps) {
        window.ga("set", custom);
      } else {
        Object.keys(custom).forEach((key) => {
          ret[key] = custom[key];
        });
        // each(custom, (key, value) => {
        //   ret[key] = value;
        // });
      }
    }
    return ret;
  }

  /**
   *  Return the path based on `properties` and `options`
   *
   * @param  {} properties
   * @param  {} includeSearch
   */
  path(properties, includeSearch) {
    let str = properties.path;
    if (properties) {
      if (includeSearch && properties.search) {
        str += properties.search;
      }
    }
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
  loadEnhancedEcommerce(rudderElement) {
    if (this.enhancedEcommerceLoaded === 0) {
      window.ga("require", "ec");
      this.enhancedEcommerceLoaded = 1;
    }

    window.ga("set", "&cu", rudderElement.message.properties.currency);
  }

  /**
   * helper class to not repeat `ec:addProduct`
   * @param  {} rudderElement
   * @param  {} inputs
   */
  enhancedEcommerceTrackProduct(rudderElement) {
    const props = rudderElement.message.properties;

    let product = {
      id: props.product_id || props.id || props.sku,
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
      ...product,
      ...this.metricsFunction(
        props,
        this.dimensionsArray,
        this.metricsArray,
        this.contentGroupingsArray
      ),
    };

    window.ga("ec:addProduct", product);
  }

  /**
   * set action with data
   * @param  {} rudderElement
   * @param  {} action
   * @param  {} data
   * @param  {} inputs
   */
  enhancedEcommerceTrackProductAction(rudderElement, action, data) {
    this.enhancedEcommerceTrackProduct(rudderElement);
    window.ga("ec:setAction", action, data || {});
  }

  /**
   * @param  {} rudderElement
   * @param  {} inputs
   */
  pushEnhancedEcommerce(rudderElement) {
    const args = rejectArr([
      "send",
      "event",
      rudderElement.message.properties.category || "EnhancedEcommerce",
      rudderElement.message.event || "Action not defined",
      rudderElement.message.properties.label,
      {
        nonInteraction: 1,
        ...this.setCustomDimenionsAndMetrics(rudderElement.message.properties),
      },
    ]);

    let { event } = rudderElement.message;
    event = event.toLowerCase();

    if (this.eventWithCategoryFieldProductScoped.includes(event)) {
      args[2] = "EnhancedEcommerce";
    }

    window.ga.call(window, ...args);
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
        .map((x) => {
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
