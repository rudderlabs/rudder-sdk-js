/* eslint-disable class-methods-use-this */
import get from "get-value";
import logger from "../../utils/logUtil";
import Storage from "../../utils/storage";
import { removeUndefinedAndNullValues } from "../utils/commonUtils";

class ProfitWell {
  constructor(config) {
    this.publicApiToken = config.publicApiToken;
    this.name = "ProfitWell";
  }

  init() {
    logger.debug("===In init ProfitWell===");

    (function (i, s, o, g, r, a, m) {
      i[o] =
        i[o] ||
        function () {
          (i[o].q = i[o].q || []).push(arguments);
        };
      a = s.createElement(g);
      m = s.getElementsByTagName(g)[0];
      a.async = 1;
      a.src =
        r +
        "?auth=" +
        s.getElementById(o + "-js").getAttribute(this.publicApiToken);
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      "profitwell",
      "script",
      "https://public.profitwell.com/js/profitwell.js"
    );

    const cookieData = Storage.getUserTraits();

    let payload = {
      user_email: cookieData.email,
      user_id: cookieData.userId,
    };

    if (!payload.user_email && !payload.user_id) {
      logger.debug(
        "User parameter (email or id) not found in cookie. identify is required"
      );
      return;
    }

    if (payload.user_email) {
      delete payload.user_id;
    } else {
      delete payload.user_email;
    }

    payload = removeUndefinedAndNullValues(payload);
    window.profitwell("start", payload);
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
      user_id: get(message, "context.userId"),
    };

    if (!payload.user_email && !payload.user_id) {
      logger.error("User parameter (email or id) is required");
      return;
    }

    if (payload.user_email) {
      delete payload.user_id;
    } else {
      delete payload.user_email;
    }

    payload = removeUndefinedAndNullValues(payload);
    window.profitwell("start", payload);
  }
}

export default ProfitWell;
