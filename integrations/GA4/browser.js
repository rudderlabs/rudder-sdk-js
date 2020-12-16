/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import {
  eventName,
  eventParameter,
  itemParameter,
} from "./ECommerceEventConfig";

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

  // When adding events do everything ion lowercase.
  // use underscores instead of spaces
  // Register your parameters to show them up in UI even user_id

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

  sendGAEvent(event, props) {
    window.gtag("event", event, props);
  }

  getDestinationEvent(event) {
    return eventName.find((p) => p.src.includes(event.toLowerCase()));
  }

  getDestinationEventProperties(props, destParameter) {
    const destinationProperties = {};
    const item = {};
    Object.keys(props).forEach((key) => {
      destParameter.forEach((param) => {
        if (key === param.src) {
          if (Array.isArray(param.dest)) {
            param.dest.forEach((d) => {
              const result = d.split(".");
              // Here we only support mapping single level object mapping.
              // To Do Future Scope :: implement using recursion to handle multi level prop mapping
              if (result.length > 1) {
                const levelOne = result[0];
                const levelTwo = result[1];
                item[levelTwo] = props[key];
                if (!destinationProperties[levelOne]) {
                  destinationProperties[levelOne] = [];
                  destinationProperties[levelOne].push(item);
                }
              } else {
                destinationProperties[result] = props[key];
              }
            });
          } else {
            destinationProperties[param.dest] = props[key];
          }
        }
      });
    });
    return destinationProperties;
  }

  getDestinationItemProperties(products, item) {
    const items = [];
    let obj = {};
    products.forEach((p) => {
      obj = {
        ...this.getDestinationEventProperties(p, itemParameter),
        ...(item && item[0]),
      };
      items.push(obj);
    });
    return items;
  }

  track(rudderElement) {
    let { event } = rudderElement.message;
    const { properties } = rudderElement.message;
    const { products } = properties;
    let destinationProperties = {};
    if (!event || this.isReservedName(event)) {
      throw Error("Cannot call un-named/reserved named track event");
    }

    const obj = this.getDestinationEvent(event);
    if (obj) {
      if (products && Array.isArray(products)) {
        event = obj.dest;
        // eslint-disable-next-line no-const-assign
        destinationProperties = this.getDestinationEventProperties(
          properties,
          eventParameter
        );
        destinationProperties.items = this.getDestinationItemProperties(
          products,
          destinationProperties.items
        );
      } else {
        event = obj.dest;
        if (!obj.hasItem) {
          // eslint-disable-next-line no-const-assign
          destinationProperties = this.getDestinationEventProperties(
            properties,
            eventParameter
          );
        } else {
          // create items
          destinationProperties.items = this.getDestinationItemProperties([
            properties,
          ]);
        }
      }
    } else {
      destinationProperties = properties;
    }

    this.sendGAEvent(event, destinationProperties);
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
