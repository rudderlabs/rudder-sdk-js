/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import { NAME } from "./constants";
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class Mouseflow {
  constructor(config) {
    this.websiteId = config.websiteId;
    this.name = NAME;
  }

  init() {
    logger.debug("===In init mouseflow===");
    window._mfq = window._mfq || [];
    // ScriptLoader(
    //   "mouseflow-integration",
    //   `https://cdn.mouseflow.com/projects/${this.websiteId}.js`
    // );
    (function () {
      var mf = document.createElement("script");
      mf.type = "text/javascript";
      mf.defer = true;
      mf.src = `//cdn.mouseflow.com/projects/${this.websiteId}.js`;
      document.getElementsByTagName("head")[0].appendChild(mf);
    })();
  }

  isLoaded() {
    logger.debug("===In isLoaded mouseflow===");
    return !!window.mouseflow && typeof window.mouseflow === "object";
  }

  isReady() {
    logger.debug("===In isReady mouseflow===");
    return !!window._mfq;
  }

  /**
   * Identify.
   * Ref: https://js-api-docs.mouseflow.com/#identifying-a-user
   * @param {Identify} identify
   */
  identify(rudderElement) {
    const { message } = rudderElement;
    const email =
      get(message, "context.traits.email") || get(message, "traits.email");
    const userId = message.userId || email;
    _mfq.push(["stop"]);
    if (userId) window.mouseflow.identify(userId);
    mouseflow.start();
  }

  /**
   * Track - tracks an event for a specific user
   * Set custom tags
   * Ref: https://js-api-docs.mouseflow.com/#tagging-a-recording
   * Set custom Variables
   * Ref: https://js-api-docs.mouseflow.com/#setting-a-custom-variable
   * @param {Track} track
   */
  track(rudderElement) {
    logger.debug("=== In mouseflow track ===");

    const { message } = rudderElement;
    const { event, properties } = message;
    if (!event) {
      logger.error("[mouseflow]: Event name from track call is missing!!===");
      return;
    }
    window._mfq.push(["tag", event]);
    Object.entries(properties).forEach((_ref) => {
      const [_key, _value] = _ref;
      window._mfq.push(["setVariable", _key, _value]);
    });
  }

  /**
   * Page.
   * Ref: https://js-api-docs.mouseflow.com/#setting-a-virtual-path
   * @param {Page} page
   */
  page(rudderElement) {
    logger.debug("=== In mouseflow Page ===");
    const { name, category, properties } = rudderElement.message;
    let eventName;
    if (!name && !category) {
      eventName = `Viewed Page`;
    } else if (!name && category) {
      eventName = `Viewed ${category} Page`;
    } else if (name && !category) {
      eventName = `Viewed ${name} Page`;
    } else {
      eventName = `Viewed ${category} ${name} Page`;
    }
    window._mfq.push(["newPageView", eventName]);
    Object.entries(properties).forEach((_ref) => {
      const [_key, _value] = _ref;
      window._mfq.push(["setVariable", _key, _value]);
    });
  }
}

export default Mouseflow;
