/* eslint-disable */
import logger from "../../utils/logUtil";
import get from "get-value";
import { NAME } from "./constants";
import { LOAD_ORIGIN } from "../ScriptLoader";

class June {
  constructor(config) {
    this.name = NAME;
    this.apiKey = config.apiKey;
  }

  loadScript() {
    window.analytics = {};
    function juneify(writeKey) {
      window.analytics._writeKey = writeKey;
      const script = document.createElement("script");
      script.type = "application/javascript";
      script.src =
        "https://unpkg.com/@june-so/analytics-next/dist/umd/standalone.js";
      script.setAttribute("data-loader", LOAD_ORIGIN);
      const first = document.getElementsByTagName("script")[0];
      first.parentNode.insertBefore(script, first);
    }
    juneify(this.apiKey);
  }

  init() {
    logger.debug("===In init June===");
    this.loadScript();
  }

  isLoaded() {
    logger.debug("===In isLoaded June===");
    return !!window.analytics && typeof window.analytics === "object";
  }

  isReady() {
    logger.debug("===In isReady June===");
    return !!window.analytics;
  }

  page(rudderElement) {
    logger.debug("===In June page===");
    const { name, properties } = rudderElement.message;
    window.analytics.page(name, properties);
  }

  identify(rudderElement) {
    logger.debug("===In June identify===");
    const { message } = rudderElement;
    const userId =
      get(message, "userId") ||
      get(message, "context.traits.userId") ||
      get(message, "context.traits.Id");
    const traits = get(message, "context.traits");
    if (!userId) {
      logger.error("userId is required for an identify call");
      return;
    }
    window.analytics.identify(userId, traits);
  }

  track(rudderElement) {
    logger.debug("===In June track===");
    let groupId;
    const { event } = rudderElement.message;
    let { properties } = rudderElement.message;
    ({ groupId, ...properties } = properties || {});

    if (groupId) {
      window.analytics.track(event, properties, { groupId });
    } else {
      window.analytics.track(event, properties);
    }
  }

  group(rudderElement) {
    logger.debug("===In June group===");
    const { groupId, traits } = rudderElement.message;
    if (!groupId) {
      logger.error("groupId is required for group call");
      return;
    }
    window.analytics.group(groupId, traits);
  }
}

export default June;
