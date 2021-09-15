/* eslint-disable class-methods-use-this */
import get from "get-value";
import logger from "../../utils/logUtil";

class ProfitWell {
  constructor(config) {
    this.publicApiKey = config.publicApiKey;
    this.siteType = config.siteType;
    this.name = "ProfitWell";
  }

  init() {
    logger.debug("===In init ProfitWell===");

    if (!this.publicApiKey) {
      logger.error("==[ProfitWell]: Public API Key not found===");
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

    if (this.siteType === "marketing") {
      window.profitwell("start", {});
      return;
    }

    const { message } = rudderElement;
    const email = get(message, "context.traits.email");
    if (email) {
      window.profitwell("start", {
        user_email: email,
      });
      return;
    }

    const userId = get(message, "userId");
    if (userId) {
      window.profitwell("start", {
        user_id: userId,
      });
      return;
    }

    logger.info("===[ProfitWell: email or userId is required for identify===");
  }
}

export default ProfitWell;
