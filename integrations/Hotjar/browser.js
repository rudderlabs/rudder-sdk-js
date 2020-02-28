import logger from "../../utils/logUtil";
class Hotjar {
  constructor(config) {
    this.siteId = config.siteID; //1549611
    this.name = "HOTJAR";
    this._ready = false;
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
    this._ready = true;

    logger.debug("===in init Hotjar===");
  }

  identify(rudderElement) {
    let userId = rudderElement.message.userId || rudderElement.message.anonymousId;
    if (!userId){
      logger.error('user id is required');
      return;
    }
  
    var traits = rudderElement.message.context.traits;
  
    window.hj('identify', rudderElement.message.userId, traits);
  }

  track(rudderElement) {
    logger.error("method not supported");
  }

  page(rudderElement) {
    logger.error("method not supported");
  }

  isLoaded() {
    return this._ready;
  }

  isReady() {
    return this._ready;
  }
}

export { Hotjar };
