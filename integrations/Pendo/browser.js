/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
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

    // Make a call to initPendo until pendoCli gets references to pendo object.
    this.setIntervalHandler = setInterval(this.initPendo.bind(this), 1000);
  }

  initPendo() {
    if (this.isReady()) {
      window.pendoCli = window.pendo;
      clearInterval(this.setIntervalHandler);

      // After pendo is initialized set debugger if debugMode is enabled.
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
    const res = result;
    if (Object(cur) !== cur) {
      res[prop] = cur;
    } else if (Array.isArray(cur)) {
      const l = cur.length;
      for (let i = 0; i < l; i += 1)
        this.recurse(cur[i], prop ? `${prop}.${i}` : `${i}`, res);
      if (l === 0) res[prop] = [];
    } else {
      let isEmpty = true;
      Object.keys(cur).forEach((key) => {
        isEmpty = false;
        this.recurse(cur[key], prop ? `${prop}.${key}` : key, res);
      });
      if (isEmpty) res[prop] = {};
    }
    return res;
  }

  flattenAgentPayload(data) {
    return this.recurse(data, "", {});
  }

  /* Once iser is identified Pendo makes Track call to track user activity.
   */
  track(rudderElement) {
    const props = rudderElement.message.properties;
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

  /* Pendo's identify call works intelligently, once u have identifioed a visitor/user,
   *or associated a visitor to a group/account then Pendo save this data in local storage and
   *any further upcoming calls are done taking user infor from local.
   */
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
