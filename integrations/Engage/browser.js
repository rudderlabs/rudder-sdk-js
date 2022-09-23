/* eslint-disable*/
import logger from "../../utils/logUtil";
import get from "get-value";
import { NAME } from "./constants";
import { LOAD_ORIGIN } from "../ScriptLoader";
import { refinePayload } from "./utils.js";
import { removeUndefinedAndNullValues } from "../utils/commonUtils";

class Engage {
  constructor(config) {
    this.api_key = config.publicKey;
    this.api_secret = config.privateKey;
    this.name = NAME;
    this.listsIds = config.listsIds;
  }

  init() {
    logger.debug("===In init Engage===");

    !(function (n) {
      if (!window.Engage) {
        (window[n] = window[n] || {}),
          (window[n].queue = window[n].queue || []),
          (window.Engage = window.Engage || {});
        for (
          var e = ["init", "identify", "addAttribute", "track"], i = 0;
          i < e.length;
          i++
        )
          window.Engage[e[i]] = w(e[i]);
        var d = document.createElement("script");
        (d.src = "//d2969mkc0xw38n.cloudfront.net/next/engage.min.js"),
          d.setAttribute("data-loader", LOAD_ORIGIN),
          (d.async = !0),
          document.head.appendChild(d);
      }
      function w(e) {
        return function () {
          window[n].queue.push([e].concat([].slice.call(arguments)));
        };
      }
    })("engage");

    window.Engage.init({
      key: this.api_key,
      secret: this.api_secret,
    });
  }

  isLoaded() {
    logger.debug("===In isLoaded Engage===");

    return !!window.Engage;
  }

  isReady() {
    logger.debug("===In isReady Engage===");
    return !!window.Engage;
  }

  identify(rudderElement) {
    logger.debug("===In Engage identify");

    const { message } = rudderElement;
    let { userId, originalTimestamp } = message;
    if (!userId) {
      userId = get(message, "context.traits.userId");
      if (!userId) {
        logger.error("userId is required for Identify call.");
        return;
      }
    }
    const number = get(message, "context.traits.phone");
    const fName =
      get(message, "context.traits.firstName") ||
      get(message, "context.traits.firstname") ||
      get(message, "context.traits.first_name");
    const lName =
      get(message, "context.traits.lastName") ||
      get(message, "context.traits.lastname") ||
      get(message, "context.traits.last_name");

    const { traits } = message.context;
    let payload = refinePayload(traits, (this.identifyFlag = true));

    payload.number = number;
    payload.last_name = lName;
    payload.first_name = fName;
    payload.created_at = originalTimestamp;
    payload = removeUndefinedAndNullValues(payload);
    payload.id = userId;
    window.Engage.identify(payload);
  }

  track(rudderElement) {
    logger.debug("===In Engage track===");
    const { message } = rudderElement;
    const { event, properties, originalTimestamp, userId } = message;
    if (!userId) {
      userId = get(message, "context.traits.userId");
      if (!userId) {
        logger.error("userId is required for Identify call.");
        return;
      }
    }

    if (!event) {
      logger.error("[ Engage ]:: Event name not present");
      return;
    }
    let payload = refinePayload(properties);
    payload = removeUndefinedAndNullValues(payload);
    window.Engage.track(userId, {
      event: event,
      timestamp: originalTimestamp,
      properties: payload,
    });
  }

  page(rudderElement) {
    logger.debug("===In Engage page===");
    const { message } = rudderElement;
    const { name, properties, originalTimestamp, category, userId } = message;
    if (!userId) {
      userId = get(message, "context.traits.userId");
      if (!userId) {
        logger.error("userId is required for Identify call.");
        return;
      }
    }
    let payload = refinePayload(properties);
    payload = removeUndefinedAndNullValues(payload);
    const pageCat = category ? `${category} ` : "";
    const pageName = name ? `${name} ` : "";
    const eventName = `Viewed ${pageCat}${pageName}Page`;
    window.Engage.track(userId, {
      event: eventName,
      timestamp: originalTimestamp,
      properties: payload,
    });
  }
}

export default Engage;
