/* eslint-disable class-methods-use-this */
import get from "get-value";
import sha256 from "crypto-js/sha256";
import Storage from "../../utils/storage";
import logger from "../../utils/logUtil";

import {
  isDefinedAndNotNull,
  removeUndefinedAndNullValues,
} from "../utils/commonUtils";
import { ecommEventPayload, eventPayload, sendEvent } from "./util";
import { NAME } from "./constants";

class SnapPixel {
  constructor(config) {
    this.pixelId = config.pixelId;
    this.hashMethod = config.hashMethod;
    this.name = NAME;

    this.trackEvents = [
      "SIGN_UP",
      "OPEN_APP",
      "SAVE",
      "VIEW_CONTENT",
      "SEARCH",
      "SUBSCRIBE",
      "COMPLETE_TUTORIAL",
      "INVITE",
      "LOGIN",
      "SHARE",
      "RESERVE",
      "ACHIEVEMENT_UNLOCKED",
      "SPENT_CREDITS",
      "RATE",
      "START_TRIAL",
      "LIST_VIEW",
    ];

    this.ecomEvents = {
      PURCHASE: "PURCHASE",
      START_CHECKOUT: "START_CHECKOUT",
      ADD_CART: "ADD_CART",
      ADD_BILLING: "ADD_BILLING",
      AD_CLICK: "AD_CLICK",
      AD_VIEW: "AD_VIEW",
      ADD_TO_WISHLIST: "ADD_TO_WISHLIST",
    };

    this.customEvents = [
      "custom_event_1",
      "custom_event_2",
      "custom_event_3",
      "custom_event_4",
      "custom_event_5",
    ];
  }

  init() {
    logger.debug("===In init SnapPixel===");

    (function (e, t, n) {
      if (e.snaptr) return;
      var a = (e.snaptr = function () {
        a.handleRequest
          ? a.handleRequest.apply(a, arguments)
          : a.queue.push(arguments);
      });
      a.queue = [];
      var s = "script";
      var r = t.createElement(s);
      r.async = !0;
      r.src = n;
      var u = t.getElementsByTagName(s)[0];
      u.parentNode.insertBefore(r, u);
    })(window, document, "https://sc-static.net/scevent.min.js");

    const cookieData = Storage.getUserTraits();

    let payload = {
      user_email: cookieData.email,
      user_phone_number: cookieData.phone,
    };

    if (!payload.user_email && !payload.user_phone_number) {
      logger.debug(
        "User parameter (email or phone number) not found in cookie. identify is required"
      );
      return;
    }

    if (this.hashMethod === "sha256") {
      if (isDefinedAndNotNull(payload.user_email)) {
        payload.user_email = sha256(payload.user_email).toString();
      }
      if (isDefinedAndNotNull(payload.user_phone_number)) {
        payload.user_phone_number = sha256(
          payload.user_phone_number
        ).toString();
      }
    }

    payload = removeUndefinedAndNullValues(payload);
    window.snaptr("init", this.pixelId, payload);
  }

  isLoaded() {
    logger.debug("===In isLoaded SnapPixel===");
    return !!window.snaptr;
  }

  isReady() {
    logger.debug("===In isReady SnapPixel===");
    return !!window.snaptr;
  }

  identify(rudderElement) {
    logger.debug("===In SnapPixel identify");

    const { message } = rudderElement;

    let payload = {
      user_email: get(message, "context.traits.email"),
      user_phone_number: get(message, "context.traits.phone"),
    };

    if (!payload.user_email && !payload.user_phone_number) {
      logger.error("User parameter (email or phone number) is required");
      return;
    }

    if (this.hashMethod === "sha256") {
      if (isDefinedAndNotNull(payload.user_email)) {
        payload.user_email = sha256(payload.user_email).toString();
      }
      if (isDefinedAndNotNull(payload.user_phone_number)) {
        payload.user_phone_number = sha256(
          payload.user_phone_number
        ).toString();
      }
    }

    payload = removeUndefinedAndNullValues(payload);
    window.snaptr("init", this.pixelId, payload);
  }

  track(rudderElement) {
    logger.debug("===In SnapPixel track===");

    const { message } = rudderElement;
    const { event } = message;

    if (!event) {
      logger.error("Event name not present");
      return;
    }

    switch (event.toLowerCase().trim()) {
      case "order completed":
        sendEvent(this.ecomEvents.PURCHASE, ecommEventPayload(event, message));
        break;
      case "checkout started":
        sendEvent(
          this.ecomEvents.START_CHECKOUT,
          ecommEventPayload(event, message)
        );
        break;
      case "product added":
        sendEvent(this.ecomEvents.ADD_CART, ecommEventPayload(event, message));
        break;
      case "payment info entered":
        sendEvent(
          this.ecomEvents.ADD_BILLING,
          ecommEventPayload(event, message)
        );
        break;
      case "promotion clicked":
        sendEvent(this.ecomEvents.AD_CLICK, ecommEventPayload(event, message));
        break;
      case "promotion viewed":
        sendEvent(this.ecomEvents.AD_VIEW, ecommEventPayload(event, message));
        break;
      case "product added to wishlist":
        sendEvent(
          this.ecomEvents.ADD_TO_WISHLIST,
          ecommEventPayload(event, message)
        );
        break;
      default:
        if (
          !this.trackEvents.includes(event) &&
          !this.customEvents.includes(event.trim().toLowerCase())
        ) {
          logger.error("Event doesn't match with Snap Pixel Events!");
          return;
        }
        sendEvent(event, eventPayload(message));
        break;
    }
  }

  page(rudderElement) {
    logger.debug("===In SnapPixel page===");

    const { message } = rudderElement;
    sendEvent("PAGE_VIEW", eventPayload(message));
  }
}

export default SnapPixel;
