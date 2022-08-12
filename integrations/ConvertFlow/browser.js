/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { NAME } from "./constants";
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class ConvertFlow {
  constructor(config) {
    this.websiteId = config.websiteId;
    this.toggleToSendData = config.toggleToSendData;
    this.name = NAME;
  }

  init() {
    logger.debug("===In init convertflow===");
    ScriptLoader(
      "convertflow-integration",
      `https://js.convertflow.co/production/websites/${this.websiteId}.js`
    );
  }

  isLoaded() {
    logger.debug("===In isLoaded convertflow===");
    return !!window.convertflow && typeof window.convertflow === "object";
  }

  isReady() {
    logger.debug("===In isReady convertflow===");
    return !!window.convertflow;
  }

  identify(rudderElement) {
    logger.debug("===In convertflow Identify===");
    const { message } = rudderElement;
    const email = message.context.traits?.email || message.traits?.email;
    if (email) {
      const payload = { email, override: true };
      window.convertflow.identify(payload);
    }
  }
}

export default ConvertFlow;
