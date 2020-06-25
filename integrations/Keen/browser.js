import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class Keen {
  constructor(config) {
    this.projectID = config.projectID;
    this.writeKey = config.writeKey;
    this.ipAddon = config.ipAddon;
    this.uaAddon = config.uaAddon;
    this.urlAddon = config.urlAddon;
    this.referrerAddon = config.referrerAddon;
    this.client = null;
    this.name = "KEEN";
  }

  init() {
    logger.debug("===in init Keen===");
    ScriptLoader(
      "keen-integration",
      "https://cdn.jsdelivr.net/npm/keen-tracking@4"
    );

    const check = setInterval(checkAndInitKeen.bind(this), 1000);
    function initKeen(object) {
      object.client = new window.KeenTracking({
        projectId: object.projectID,
        writeKey: object.writeKey,
      });
      return object.client;
    }
    function checkAndInitKeen() {
      if (window.KeenTracking !== undefined && window.KeenTracking !== void 0) {
        this.client = initKeen(this);
        clearInterval(check);
      }
    }
  }

  identify(rudderElement) {
    logger.debug("in Keen identify");
    const { traits } = rudderElement.message.context;
    const userId = rudderElement.message.userId
      ? rudderElement.message.userId
      : rudderElement.message.anonymousId;
    let properties = rudderElement.message.properties
      ? Object.assign(properties, rudderElement.message.properties)
      : {};
    properties.user = {
      userId,
      traits,
    };
    properties = this.getAddOn(properties);
    this.client.extendEvents(properties);
  }

  track(rudderElement) {
    logger.debug("in Keen track");

    const { event } = rudderElement.message;
    let { properties } = rudderElement.message;
    properties = this.getAddOn(properties);
    this.client.recordEvent(event, properties);
  }

  page(rudderElement) {
    logger.debug("in Keen page");
    const pageName = rudderElement.message.name;
    const pageCategory = rudderElement.message.properties
      ? rudderElement.message.properties.category
      : undefined;
    let name = "Loaded a Page";
    if (pageName) {
      name = `Viewed ${pageName} page`;
    }
    if (pageCategory && pageName) {
      name = `Viewed ${pageCategory} ${pageName} page`;
    }

    let { properties } = rudderElement.message;
    properties = this.getAddOn(properties);
    this.client.recordEvent(name, properties);
  }

  isLoaded() {
    logger.debug("in Keen isLoaded");
    return !!(this.client != null);
  }

  isReady() {
    return !!(this.client != null);
  }

  getAddOn(properties) {
    const addOns = [];
    if (this.ipAddon) {
      properties.ip_address = "${keen.ip}";
      addOns.push({
        name: "keen:ip_to_geo",
        input: {
          ip: "ip_address",
        },
        output: "ip_geo_info",
      });
    }
    if (this.uaAddon) {
      properties.user_agent = "${keen.user_agent}";
      addOns.push({
        name: "keen:ua_parser",
        input: {
          ua_string: "user_agent",
        },
        output: "parsed_user_agent",
      });
    }
    if (this.urlAddon) {
      properties.page_url = document.location.href;
      addOns.push({
        name: "keen:url_parser",
        input: {
          url: "page_url",
        },
        output: "parsed_page_url",
      });
    }
    if (this.referrerAddon) {
      properties.page_url = document.location.href;
      properties.referrer_url = document.referrer;
      addOns.push({
        name: "keen:referrer_parser",
        input: {
          referrer_url: "referrer_url",
          page_url: "page_url",
        },
        output: "referrer_info",
      });
    }
    properties.keen = {
      addons: addOns,
    };
    return properties;
  }
}

export { Keen };
