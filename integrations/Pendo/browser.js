/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class Pendo {
  constructor(config, analytics) {
    this.analytics = analytics;
    this.apiKey = !config.apiKey ? "" : config.apiKey;
    this.isDebugMode = config.enableDebugMode;
    this.name = "PENDO";
    this.setIntervalHandler = undefined;
    logger.debug("Config ", config);
  }

  init() {
    window.pendo = {};
    window.pendoCli = undefined;
    window.pendo.apiKey = this.apiKey;
    ScriptLoader(
      "pendo-fs",
      `https://cdn.pendo.io/agent/static/${this.apiKey}/pendo.js`
    );
    logger.debug("===in init Pendo===");

    this.setIntervalHandler = setInterval(this.initPendo.bind(this), 1000);
  }

  initPendo() {
    if (this.isReady()) {
      window.pendoCli = window.pendo;
      clearInterval(this.setIntervalHandler);
      if (this.isDebugMode) {
        this.enableDebugging();
      } else {
        this.disableDebugging();
      }
    }
  }
  isLoaded() {
    logger.debug("in PENDO isLoaded");
    return !!window.pendoCli;
  }

  isReady() {
    return window.pendo && window.pendo.isReady && window.pendo.isReady();
  }

  identify(rudderElement) {
    const obj = {};
    let accountObj = {};
    let visitorObj = {};
    visitorObj.d =
      rudderElement.message.userId || rudderElement.message.anonymousId;
    if (rudderElement.message.context.traits) {
      visitorObj = {
        ...visitorObj,
        ...rudderElement.message.context.traits,
      };
    }

    obj.visitor = visitorObj;
    window.pendoCli.identify(obj);
  }

  track(rudderElement) {
    window.pendoCli.track(rudderElement.message.event);
  }

  group(rudderElement) {
    window.pendoCli.initialize();
  }

  enableDebugging() {
    window.pendoCli.enableDebugging();
  }

  disableDebugging() {
    window.pendoCli.disableDebugging();
  }
}

export { Pendo };
