/* eslint-disable class-methods-use-this */
import GA from "../GA";
import logger from "../../utils/logUtil";
import { NAME } from "./constants";

class GA360 extends GA {
  constructor(config, analytics) {
    super(config, analytics);
    this.name = NAME;
  }

  init() {
    logger.debug("===in init GA 360 ===");
    return super.init();
  }

  identify(rudderElement) {
    logger.debug("=========in GA 360 identify ==========");
    return super.identify(rudderElement);
  }

  track(rudderElement) {
    logger.debug("=========in GA 360 track ==========");
    return super.track(rudderElement);
  }

  page(rudderElement) {
    logger.debug("=========in GA 360 page ==========");
    return super.page(rudderElement);
  }

  isLoaded() {
    logger.debug("=========in GA 360 load ==========");
    return super.isLoaded();
  }

  isReady() {
    return super.isReady();
  }
}

export { GA360 };
