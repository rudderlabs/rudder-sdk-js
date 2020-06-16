import logger from "../../utils/logUtil";
class mouseflow {
  constructor(config) {
    this.siteId = config.siteID; //1549611
    this.name = "Mouseflow";
    this._ready = false;
  }

  init() {
    window.mouseflowProjectId = this.siteId;
    window._mfq = window._mfq || [];
       (function() {
        var mf = document.createElement("script");
        mf.type = "text/javascript"; mf.defer = true;
        mf.src = "//cdn.mouseflow.com/projects/f7"+window.mouseflowProjectId+".js";
        document.getElementsByTagName("head")[0].appendChild(mf);
    })();
    this._ready = true;

    logger.debug("===in init Mouseflow ===");
  }

  identify(rudderElement) {
    let userId = rudderElement.message.userId || rudderElement.message.anonymousId;
    if (!userId){
      logger.debug('[Mouseflow] identify:: user id is required');
      return;
    }
  
    var traits = rudderElement.message.context.traits;
  
    window.hj('identify', rudderElement.message.userId, traits);
  }

  track(rudderElement) {
    logger.debug("[Mouseflow] track:: method not supported");
  }

  page(rudderElement) {
    logger.debug("[Mouseflow] page:: method not supported");
  }

  isLoaded() {
    return this._ready;
  }

  isReady() {
    return this._ready;
  }
}

export { Mouseflow };
