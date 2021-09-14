/* eslint-disable class-methods-use-this */
import get from "get-value";
import logger from "../../utils/logUtil";
import { generateUUID } from "../../utils/utils";

class ProfitWell {
  constructor(config) {
    this.publicApiKey = config.publicApiKey;
    this.siteType = config.siteType;
    this.name = "ProfitWell";
  }

  init() {
    logger.debug("===In init ProfitWell===");

    if (!this.publicApiKey) {
      logger.error("Public API Key not found");
      return;
    }

    window.publicApiKey = this.publicApiKey;

    const scriptTag = document.createElement("script");
    scriptTag.setAttribute("id", "profitwell-js");
    scriptTag.setAttribute("data-pw-auth", window.publicApiKey);
    document.body.appendChild(scriptTag);

    (function (i, s, o, g, r, a, m) {
      i[o] =
        i[o] ||
        function () {
          (i[o].q = i[o].q || []).push(arguments);
        };
      a = s.createElement(g);
      m = s.getElementsByTagName(g)[0];
      a.async = 1;
      a.src = r + "?auth=" + window.publicApiKey;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      "profitwell",
      "script",
      "https://public.profitwell.com/js/profitwell.js"
    );

    if (this.siteType === "marketing") {
      window.profitwell("start", { user_id: generateUUID().toString() });
    }
  }

  isLoaded() {
    logger.debug("===In isLoaded ProfitWell===");
    return !!window.profitwell;
  }

  isReady() {
    logger.debug("===In isReady ProfitWell===");
    return !!window.profitwell;
  }

  identify(rudderElement) {
    logger.debug("===In ProfitWell identify===");

    const { message } = rudderElement;

    let payload = {
      user_email: get(message, "context.traits.email"),
    };

    if (!payload.user_email) {
      payload = {
        user_id: get(message, "anonymousId"),
      };
    }

    window.profitwell("start", payload);
  }
}

export default ProfitWell;
