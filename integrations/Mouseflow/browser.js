/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import { NAME } from "./constants";
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import setCustomVariables from "./utils";
import { isDefinedAndNotNull } from "../utils/commonUtils";

class Mouseflow {
  constructor(config) {
    this.websiteId = config.websiteId;
    this.name = NAME;
  }

  init() {
    logger.debug("===In init mouseflow===");
    window._mfq = window._mfq || [];
    ScriptLoader(
      "mouseflow-integraions",
      `https://cdn.mouseflow.com/projects/${this.websiteId}.js`
    );
  }

  isLoaded() {
    logger.debug("===In isLoaded mouseflow===");
    return !!window.mouseflow && typeof window.mouseflow === "object";
  }

  isReady() {
    logger.debug("===In isReady mouseflow===");
    return !!window._mfq;
  }

  /*
   * Add tags
   * Set custom Variables
   * Ref: https://js-api-docs.mouseflow.com/#setting-a-custom-variable
   */
  addTags(message) {
    const tags = get(message, `integrations.${NAME}.tags`);
    if (isDefinedAndNotNull(tags)) {
      setCustomVariables(tags);
    }
  }

  /**
   * Identify.
   * for supporting userId or email
   * Ref: https://js-api-docs.mouseflow.com/#identifying-a-user
   * for supporting user traits and tags
   * Ref: https://js-api-docs.mouseflow.com/#setting-a-custom-variable
   * @param {Identify} identify
   */
  identify(rudderElement) {
    const { message } = rudderElement;
    const { traits } = message.context;
    const email =
      get(message, "context.traits.email") || get(message, "traits.email");
    const userId = message.userId || email;
    window._mfq.push(["stop"]);
    if (userId) window._mfq.push(["identify", userId]);
    window.mouseflow.start();
    setCustomVariables(traits);
    this.addTags(message);
  }

  /**
   * Track - tracks an event for a specific user
   * for supporting event
   * Ref: https://js-api-docs.mouseflow.com/#tagging-a-recording
   * for supporting properties and tags
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
    setCustomVariables(properties);
    this.addTags(message);
  }

  /**
   * Page.
   * for supporting path of Page
   * Ref: https://js-api-docs.mouseflow.com/#setting-a-virtual-path
   * @param {Page} page
   */
  page(rudderElement) {
    logger.debug("=== In mouseflow Page ===");
    const tabPath =
      rudderElement.message.properties.path ||
      rudderElement.message.context.path;
    if (tabPath) window._mfq.push(["newPageView", tabPath]);
  }
}

export default Mouseflow;
