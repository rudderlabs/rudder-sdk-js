import logger from "../../utils/logUtil";

class CustomerIO {
  constructor(config) {
    this.siteID = config.siteID;
    this.apiKey = config.apiKey;

    this.name = "CUSTOMERIO";
  }

  init() {
    logger.debug("===in init Customer IO init===");
    window._cio = window._cio || [];
    const { siteID } = this;
    (function () {
      let a;
      let b;
      let c;
      a = function (f) {
        return function () {
          window._cio.push(
            [f].concat(Array.prototype.slice.call(arguments, 0))
          );
        };
      };
      b = ["load", "identify", "sidentify", "track", "page"];
      for (c = 0; c < b.length; c++) {
        window._cio[b[c]] = a(b[c]);
      }
      const t = document.createElement("script");
      const s = document.getElementsByTagName("script")[0];
      t.async = true;
      t.id = "cio-tracker";
      t.setAttribute("data-site-id", siteID);
      t.src = "https://assets.customer.io/assets/track.js";
      s.parentNode.insertBefore(t, s);
    })();
  }

  identify(rudderElement) {
    logger.debug("in Customer IO identify");
    const userId = rudderElement.message.userId
      ? rudderElement.message.userId
      : rudderElement.message.anonymousId;
    const traits = rudderElement.message.context.traits
      ? rudderElement.message.context.traits
      : {};
    if (!traits.created_at) {
      traits.created_at = Math.floor(new Date().getTime() / 1000);
    }
    traits.id = userId;
    window._cio.identify(traits);
  }

  track(rudderElement) {
    logger.debug("in Customer IO track");

    const eventName = rudderElement.message.event;
    const { properties } = rudderElement.message;
    window._cio.track(eventName, properties);
  }

  page(rudderElement) {
    logger.debug("in Customer IO page");

    const name =
      rudderElement.message.name || rudderElement.message.properties.url;
    window._cio.page(name, rudderElement.message.properties);
  }

  isLoaded() {
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }

  isReady() {
    return !!(window._cio && window._cio.push !== Array.prototype.push);
  }
}

export { CustomerIO };
