import logger from "../../utils/logUtil";

class HotjarNode {
  constructor() {
    logger.debug("nothing to construct");
  }

  init() {
    logger.debug("node not supported");

    logger.debug("===in init===");
  }

  identify(rudderElement) {
    logger.debug("node not supported");
  }

  track(rudderElement) {
    logger.debug("node not supported");
  }

  page(rudderElement) {
    logger.debug("node not supported");
  }

  loaded() {
    logger.debug("in hubspot isLoaded");
    logger.debug("node not supported");
  }
}

export { HotjarNode };
