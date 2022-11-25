/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { NAME } from "./constants";
import logger from "../../utils/logUtil";
import { LOAD_ORIGIN } from "../ScriptLoader";
import makeACall from "./utils";

class Axeptio {
  constructor(config) {
    this.clientId = config.clientId;
    this.name = NAME;
  }

  loadScript() {
    window.axeptioSettings = {
      clientId: this.clientId,
    };
    (function (d, s) {
      var t = d.getElementsByTagName(s)[0],
        e = d.createElement(s);
      e.async = true;
      e.src = "//static.axept.io/sdk.js";
      e.setAttribute("data-loader", LOAD_ORIGIN),
        t.parentNode.insertBefore(e, t);
    })(document, "script");
  }

  init() {
    logger.debug("===In init Axeptio===");
    this.loadScript();
  }

  isLoaded() {
    logger.debug("===In isLoaded Axeptio===");
    return !!window.__axeptioSDK && typeof window.__axeptioSDK === "object";
  }

  isReady() {
    logger.debug("===In isReady Axeptio===");
    this.recordAxeptioEvents();
    return !!window.__axeptioSDK;
  }

  // this fucntion is used to record the triggered axeptio events through callback
  recordAxeptioEvents() {
    window._axcb = window._axcb || [];
    window._axcb.push(function () {
      window.__axeptioSDK.on(
        "cookies:*",
        function (payload, event) {
          makeACall(event, payload);
        },
        // set to true to record the past events too that have been dispatched before the event handler is set
        { replay: true }
      );
    });
  }
}

export default Axeptio;
