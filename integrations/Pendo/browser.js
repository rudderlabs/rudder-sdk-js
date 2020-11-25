/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import { flattenJsonPayload } from "../../utils/utils";

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

  /* utility functions ---Start here ---  */
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
  /* utility functions --- Ends here ---  */

  /* Config managed functions ----- Start here ------- */
  enableDebugging() {
    window.pendoCli.enableDebugging();
  }

  disableDebugging() {
    window.pendoCli.disableDebugging();
  }
  /* Config managed functions ------- Ends here ------- */

  /*
   * PENDO MAPPED FUNCTIONS :: identify, track, group
   */

  /* Pendo's identify call works intelligently, once u have identified a visitor/user,
   *or associated a visitor to a group/account then Pendo save this data in local storage and
   *any further upcoming calls are done taking user info from local.
   * To track user perndo maps user to Visitor in Pendo.
   */
  identify(rudderElement) {
    let visitorObj = {};
    const { traits } = rudderElement.message.context;
    const id = this.isUserAnonymous(rudderElement.message)
      ? this.constructPendoAnonymousId(rudderElement.message.anonymousId)
      : rudderElement.message.userId;
    visitorObj.id = id;
    if (traits) {
      visitorObj = {
        ...visitorObj,
        ...flattenJsonPayload(traits),
      };
    }

    this._identify({ visitor: visitorObj });
  }

  /* Once user is identified Pendo makes Track call to track user activity.
   */
  track(rudderElement) {
    const { event } = rudderElement.message;
    if (!event) {
      throw Error("Cannot call un-named track event");
    }
    const props = rudderElement.message.properties;
    window.pendoCli.track(event, props);
  }

  /*
   *Group call maps to an account for which visitor belongs.
   *It is same as identify call but here we send account object.
   */
  group(rudderElement) {
    const obj = {};
    let accountObj = {};
    const { traits } = rudderElement.message.context;
    accountObj.id =
      rudderElement.message.groupId || rudderElement.message.anonymousId;
    if (traits) {
      accountObj = {
        ...accountObj,
        ...flattenJsonPayload(traits),
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
}

export { Pendo };