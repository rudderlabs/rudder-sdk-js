import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class Pendo {
  constructor(config, analytics) {
    this.analytics = analytics;
    this.apiKey = !config.apiKey ? "" : config.apiKey;
    this.isDebugMode = config.enableDebugMode;
    this.name = "PENDO";

    logger.debug("Config ", config);
  }

  init() {
    ScriptLoader(
      "pendo",
      `https://cdn.pendo.io/agent/static/${this.apiKey}/pendo.js`
    );

    logger.debug("===in init Pendo===");
    this.loadScript();
  }



  identify(rudderElement){


  }


  track(rudderElement) {

  }


  group(rudderElement) {

  }

  enableDebugging() {

  }

  disableDebugging() {

  }



}

export {Pendo};
