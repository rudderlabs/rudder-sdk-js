/* eslint-disable class-methods-use-this */
import get from "get-value";
import logger from "../../utils/logUtil";
import Storage from "../../utils/storage";
import { generateUUID } from "../../utils/utils";

class ProfitWell {
  constructor(config) {
    this.publicApiKey = config.publicApiKey;
    this.siteType = config.siteType;
    this.name = "ProfitWell";
  }

  init() {
    logger.debug("===In init ProfitWell===");

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
      const userId = generateUUID().toString();
      window.profitwell("start", { user_id: userId });
      return;
    }

    const cookieUserId = Storage.getUserId();
    const cookieEmail = Storage.getUserTraits().email;

    if (!cookieUserId && !cookieEmail) {
      logger.debug(
        "User parameter (email or id) not found in cookie. Identify is required"
      );
      return;
    }

    if (cookieUserId) {
      window.profitwell("start", { user_id: cookieUserId });
    } else {
      window.profitwell("start", { user_email: cookieEmail });
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
      user_id: get(message, "userId"),
    };

    if (!payload.user_id) {
      payload = {
        user_email: get(message, "context.traits.email"),
      };
    }

    if (!payload.user_id && !payload.user_email) {
      logger.error("User parameter (email or id) is required");
      return;
    }

    window.profitwell("start", payload);
  }
}

export default ProfitWell;
