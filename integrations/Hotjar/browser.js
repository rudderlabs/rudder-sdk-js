import logger from "../../utils/logUtil";
class Hotjar {
  constructor(config) {
    this.siteId = config.siteID; //1549611
    this.name = "HOTJAR";
  }

  init() {
    window.hotjarSiteId = this.siteId;
    (function(h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function() {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: h.hotjarSiteId, hjsv: 6 };
      a = o.getElementsByTagName("head")[0];
      r = o.createElement("script");
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, "https://static.hotjar.com/c/hotjar-", ".js?sv=");

    logger.debug("===in init Hotjar===");
  }

  identify(rudderElement) {
    logger.error("method not supported");
  }

  track(rudderElement) {
    logger.error("method not supported");
  }

  page(rudderElement) {
    logger.error("method not supported");
  }

  isLoaded() {
    logger.error("method not supported");
  }

  isReady() {
    return true;
  }
}

export { Hotjar };
