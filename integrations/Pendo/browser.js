/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
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

  constructPendoAnonymousId(id) {
    return `_PENDO_T_${id}`;
  }

  isUserAnonymous(message) {
    return !message.userId;
  }

  identify(rudderElement) {
    let visitorObj = {};
    const id = this.isUserAnonymous(rudderElement.message)
      ? this.constructPendoAnonymousId(rudderElement.message.anonymousId)
      : rudderElement.message.userId;
    visitorObj.id = id;
    if (rudderElement.message.context.traits) {
      visitorObj = {
        ...visitorObj,
        ...this.flattenAgentPayload(rudderElement.message.context.traits),
      };
    }

    this._identify({ visitor: visitorObj });
  }

  recurse(cur, prop, result) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      const l = cur.length;
      for (let i = 0; i < l; i += 1)
        this.recurse(cur[i], prop ? `${prop}.${i}` : `${i}`);
      if (l === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      Object.keys(cur).forEach((key) => {
        isEmpty = false;
        this.recurse(cur[key], prop ? `${prop}.${key}` : key, result);
      });
      if (isEmpty) result[prop] = {};
    }
    return result;
  }

  flattenAgentPayload(data) {
    return this.recurse(data, "", {});
  }

  track(rudderElement) {
    const props = rudderElement.message;
    window.pendoCli.track(rudderElement.message.event, props);
  }

  group(rudderElement) {
    const obj = {};
    let accountObj = {};
    accountObj.id =
      rudderElement.message.groupId || rudderElement.message.anonymousId;
    if (rudderElement.message.context.traits) {
      accountObj = {
        ...accountObj,
        ...this.flattenAgentPayload(rudderElement.message.context.traits),
      };
      obj.account = accountObj;
    }
    if (rudderElement.message.userId) {
      obj.visitor = { id: rudderElement.message.userId };
    }

    this._identify(obj);
  }

  _identify(obj) {
    window.pendoCli.identify(obj);
  }

  enableDebugging() {
    window.pendoCli.enableDebugging();
  }

  disableDebugging() {
    window.pendoCli.disableDebugging();
  }
}

export { Pendo };
