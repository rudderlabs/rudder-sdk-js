/* eslint-disable class-methods-use-this */
import get from "get-value";
import sha256 from "crypto-js/sha256";
import Storage from "../../utils/storage";
import logger from "../../utils/logUtil";

import { removeUndefinedAndNullValues } from "../utils/commonUtils";
import { ecommEventPayload, eventPayload, sendEvent } from "./util";
import { NAME } from "./constants";
import { LOAD_ORIGIN } from "../ScriptLoader";

class SnapPixel {
  constructor(config) {
    this.pixelId = config.pixelId;
    this.hashMethod = config.hashMethod;
    this.name = NAME;
    this.deduplicationKey = config.deduplicationKey;
    this.trackEvents = [
      "SIGN_UP",
      "OPEN_APP",
      "SAVE",
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
      VIEW_CONTENT: "VIEW_CONTENT",
      SEARCH: "SEARCH",
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
      r.dataset.loader = LOAD_ORIGIN;
      var u = t.getElementsByTagName(s)[0];
      u.parentNode.insertBefore(r, u);
    })(window, document, "https://sc-static.net/scevent.min.js");

    const cookieData = Storage.getUserTraits();

    const userEmail = cookieData.email;
    const userPhoneNumber = cookieData.phone;

    let payload = {};
    if (this.hashMethod === "sha256") {
      payload = {
        user_hashed_email: userEmail ? sha256(userEmail).toString() : "",
        user_hashed_phone_number: userPhoneNumber
          ? sha256(userPhoneNumber).toString()
          : "",
      };
    } else {
      payload = {
        user_email: userEmail,
        user_phone_number: userPhoneNumber,
      };
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

    const userEmail = get(message, "context.traits.email");
    const userPhoneNumber = get(message, "context.traits.phone");
    const ipAddress = get(message, "context.ip") || get(message, "request_ip");
    let payload = {};

    if (!userEmail && !userPhoneNumber && !ipAddress) {
      logger.error(
        "User parameter (email or phone number or ip address) is required"
      );
      return;
    }

    if (this.hashMethod === "sha256") {
      payload = {
        user_hashed_email: userEmail ? sha256(userEmail).toString() : "",
        user_hashed_phone_number: userPhoneNumber
          ? sha256(userPhoneNumber).toString()
          : "",
      };
    } else {
      payload = {
        user_email: userEmail,
        user_phone_number: userPhoneNumber,
      };
    }
    payload = { ...payload, ip_address: ipAddress };

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

    try {
      switch (event.toLowerCase().trim()) {
        case "order completed":
          sendEvent(
            this.ecomEvents.PURCHASE,
            ecommEventPayload(event, message, this.deduplicationKey)
          );
          break;
        case "checkout started":
          sendEvent(
            this.ecomEvents.START_CHECKOUT,
            ecommEventPayload(event, message, this.deduplicationKey)
          );
          break;
        case "product added":
          sendEvent(
            this.ecomEvents.ADD_CART,
            ecommEventPayload(event, message, this.deduplicationKey)
          );
          break;
        case "payment info entered":
          sendEvent(
            this.ecomEvents.ADD_BILLING,
            ecommEventPayload(event, message, this.deduplicationKey)
          );
          break;
        case "promotion clicked":
          sendEvent(
            this.ecomEvents.AD_CLICK,
            ecommEventPayload(event, message, this.deduplicationKey)
          );
          break;
        case "promotion viewed":
          sendEvent(
            this.ecomEvents.AD_VIEW,
            ecommEventPayload(event, message, this.deduplicationKey)
          );
          break;
        case "product added to wishlist":
          sendEvent(
            this.ecomEvents.ADD_TO_WISHLIST,
            ecommEventPayload(event, message, this.deduplicationKey)
          );
          break;
        case "product viewed":
        case "product list viewed":
          sendEvent(
            this.ecomEvents.VIEW_CONTENT,
            ecommEventPayload(event, message, this.deduplicationKey)
          );
          break;
        case "products searched":
          sendEvent(
            this.ecomEvents.SEARCH,
            ecommEventPayload(event, message, this.deduplicationKey)
          );
          break;
        default:
          if (
            !this.trackEvents.includes(event.trim().toUpperCase()) &&
            !this.customEvents.includes(event.trim().toLowerCase())
          ) {
            logger.error("Event doesn't match with Snap Pixel Events!");
            return;
          }
          sendEvent(event, eventPayload(message, this.deduplicationKey));
          break;
      }
    } catch (err) {
      logger.error("[Snap Pixel] track failed with following error", err);
    }
  }

  page(rudderElement) {
    logger.debug("===In SnapPixel page===");

    const { message } = rudderElement;
    sendEvent("PAGE_VIEW", eventPayload(message, this.deduplicationKey));
  }
}

export default SnapPixel;
