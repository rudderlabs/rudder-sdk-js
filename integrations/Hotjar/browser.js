/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";

class Hotjar {
  constructor(config) {
    this.siteId = config.siteID;
    this.name = "HOTJAR";
    this._ready = false;
  }

  init() {
    logger.debug("===In init Hotjar===");

    window.hotjarSiteId = this.siteId;
    (function (h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function () {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: h.hotjarSiteId, hjsv: 6 };
      a = o.getElementsByTagName("head")[0];
      r = o.createElement("script");
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");
    this._ready = true;
  }

  identify(rudderElement) {
    logger.debug("===In Hotjar identify===");

    const userId =
      rudderElement.message.userId || rudderElement.message.anonymousId;
    if (!userId) {
      logger.debug("[Hotjar] identify:: user id is required");
      return;
    }

    const { traits } = rudderElement.message.context;

    window.hj("identify", rudderElement.message.userId, traits);
  }

  track(rudderElement) {
    logger.debug("===In Hotjar track===");

    const { event } = rudderElement.message;

    if (!event) {
      logger.error("Event name not present");
      return;
    }

    window.hj("event", event);
  }

  page() {
    logger.debug("===In Hotjar page===");
    logger.debug("[Hotjar] page:: method not supported");
  }

  isLoaded() {
    logger.debug("===In isLoaded Hotjar===");
    return this._ready;
  }

  isReady() {
    logger.debug("===In isReady Hotjar===");
    return this._ready;
  }
}

export { Hotjar };
