/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

export default class GA4 {
  constructor(config, analytics) {
    this.measurementId = config.measurementId;
    this.analytics = analytics;
    this.sendUserId = config.sendUserId || false;
    this.blockPageView = config.blockPageViewEvent || false;
    this.name = "GA4";
  }

  loadScript(measurementId, userId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gt() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };
    window.gtag("js", new Date());

    // This condition is not working, even after disabling page view
    // page_view is even getting called on page load
    if (this.blockPageView) {
      window.gtag("config", measurementId, {
        user_id: userId,
        send_page_view: false,
      });
    } else {
      window.gtag("config", measurementId);
    }

    ScriptLoader(
      "google-analytics 4",
      `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    );
  }

  init() {
    // To do :: check how custom dimension and metrics is used
    const userId = this.analytics.userId || this.analytics.anonymousId;
    this.loadScript(this.measurementId, userId);
  }

  /* utility functions ---Start here ---  */
  isLoaded() {
    return !!(window.gtag && window.gtag.push !== Array.prototype.push);
  }

  isReady() {
    return !!(window.gtag && window.gtag.push !== Array.prototype.push);
  }
  /* utility functions --- Ends here ---  */

  isReservedName(eventName) {
    const reservedName = [
      "ad_activeview",
      "ad_click",
      "ad_exposure",
      "ad_impression",
      "ad_query",
      "adunit_exposure",
      "app_clear_data",
      "app_install",
      "app_update",
      "app_remove",
      "error",
      "first_open",
      "first_visit",
      "in_app_purchase",
      "notification_dismiss",
      "notification_foreground",
      "notification_open",
      "notification_receive",
      "os_update",
      "screen_view",
      "session_start",
      "user_engagement",
    ];

    return reservedName.includes(eventName);
  }

  track(rudderElement) {
    const { products } = rudderElement.message.properties;
    const items = [];
    products.forEach((p) => {
      const itemId = p.product_id;
      const itemName = p.product_name;
      items.push({ item_id: itemId, item_name: itemName });
    });
    const { event } = rudderElement.message;
    if (!event || this.isReservedName(event)) {
      throw Error("Cannot call un-named/reserved named track event");
    }
    const props = { ...rudderElement.message.properties, ...items };

    window.gtag("event", event, props);
  }

  identify(rudderElement) {
    if (this.sendUserId && rudderElement.message.userId) {
      const userId = this.analytics.userId || this.analytics.anonymousId;
      window.gtag("config", this.measurementId, {
        user_id: userId,
      });
    }
    window.gtag("set", "user_properties", this.analytics.userTraits);
    logger.debug("in GoogleAnalyticsManager identify");
  }

  page(rudderElement) {
    window.gtag(
      "event",
      "page_view",
      (rudderElement.message.context && rudderElement.message.context.page) ||
        {}
    );
  }
}
