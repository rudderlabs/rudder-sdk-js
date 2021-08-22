/* eslint-disable class-methods-use-this */
import get from "get-value";
import sha256 from "crypto-js/sha256";
import Storage from "../../utils/storage";
import logger from "../../utils/logUtil";

import {
  isDefinedAndNotNull,
  isNotEmpty,
  removeUndefinedAndNullValues,
} from "../utils/commonUtils";

class SnapPixel {
  constructor(config) {
    this.pixelId = config.pixelId;
    this.hashMethod = config.hashMethod;
    this.name = "SNAP_PIXEL";

    this.snapPixelEventNames = [
      "SIGN_UP",
      "OPEN_APP",
      "PAGE_VIEW",
      "PURCHASE",
      "SAVE",
      "START_CHECKOUT",
      "ADD_CART",
      "VIEW_CONTENT",
      "ADD_BILLING",
      "SEARCH",
      "SUBSCRIBE",
      "AD_CLICK",
      "AD_VIEW",
      "COMPLETE_TUTORIAL",
      "INVITE",
      "LOGIN",
      "SHARE",
      "RESERVE",
      "ACHIEVEMENT_UNLOCKED",
      "ADD_TO_WISHLIST",
      "SPENT_CREDITS",
      "RATE",
      "START_TRIAL",
      "LIST_VIEW",
    ];

    this.customEvents = [
      config.customEvent1,
      config.customEvent2,
      config.customEvent3,
      config.customEvent4,
      config.customEvent5,
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
        "User parameter (email or phone number) not found in cookie"
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

    let payload = {
      price: get(message, "properties.price"),
      currency: get(message, "properties.currency"),
      transaction_id: get(message, "properties.transactionId"),
      item_ids: get(message, "properties.itemId"),
      item_category: get(message, "properties.category"),
      description: get(message, "properties.description"),
      search_string: get(message, "properties.search"),
      number_items: get(message, "properties.numberItems"),
      payment_info_available: get(message, "properties.paymentInfoAvailable"),
      sign_up_method: get(message, "properties.signUpMethod"),
      success: get(message, "properties.success"),
    };

    if (
      payload.payment_info_available !== 0 &&
      payload.payment_info_available !== 1
    ) {
      payload.payment_info_available = null;
    }
    if (payload.success !== 0 && payload.success !== 1) {
      payload.success = null;
    }

    payload = removeUndefinedAndNullValues(payload);

    switch (event.toLowerCase()) {
      case "order completed":
        if (isNotEmpty(payload)) {
          window.snaptr("track", "PURCHASE", payload);
        } else {
          window.snaptr("track", "PURCHASE");
        }
        break;
      case "checkout started":
        if (isNotEmpty(payload)) {
          window.snaptr("track", "START_CHECKOUT", payload);
        } else {
          window.snaptr("track", "START_CHECKOUT");
        }
        break;
      case "product added":
        if (isNotEmpty(payload)) {
          window.snaptr("track", "ADD_CART", payload);
        } else {
          window.snaptr("track", "ADD_CART");
        }
        break;
      case "payment info entered":
        if (isNotEmpty(payload)) {
          window.snaptr("track", "ADD_BILLING", payload);
        } else {
          window.snaptr("track", "ADD_BILLING");
        }
        break;
      case "promotion clicked":
        if (isNotEmpty(payload)) {
          window.snaptr("track", "AD_CLICK", payload);
        } else {
          window.snaptr("track", "AD_CLICK");
        }
        break;
      case "promotion viewed":
        if (isNotEmpty(payload)) {
          window.snaptr("track", "AD_VIEW", payload);
        } else {
          window.snaptr("track", "AD_VIEW");
        }
        break;
      case "product added to wishlist":
        if (isNotEmpty(payload)) {
          window.snaptr("track", "ADD_TO_WISHLIST", payload);
        } else {
          window.snaptr("track", "ADD_TO_WISHLIST");
        }
        break;
      default:
        if (
          !this.snapPixelEventNames.includes(event) &&
          !this.customEvents.includes(event)
        ) {
          logger.error("Event doesn't match with Snap Pixel Events!");
          return;
        }
        if (isNotEmpty(payload)) {
          window.snaptr("track", event, payload);
        } else {
          window.snaptr("track", event);
        }
        break;
    }
  }

  page(rudderElement) {
    logger.debug("===In SnapPixel page===");

    const { message } = rudderElement;

    let payload = {
      price: get(message, "properties.price"),
      currency: get(message, "properties.currency"),
      transaction_id: get(message, "properties.transactionId"),
      item_ids: get(message, "properties.itemId"),
      item_category: get(message, "properties.category"),
      description: get(message, "properties.description"),
      search_string: get(message, "properties.search"),
      number_items: get(message, "properties.numberItems"),
      payment_info_available: get(message, "properties.paymentInfoAvailable"),
      sign_up_method: get(message, "properties.signUpMethod"),
      success: get(message, "properties.success"),
    };

    if (
      payload.payment_info_available !== 0 &&
      payload.payment_info_available !== 1
    ) {
      payload.payment_info_available = null;
    }
    if (payload.success !== 0 && payload.success !== 1) {
      payload.success = null;
    }
    payload = removeUndefinedAndNullValues(payload);

    if (isNotEmpty(payload)) {
      window.snaptr("track", "PAGE_VIEW", payload);
    } else {
      window.snaptr("track", "PAGE_VIEW");
    }
  }
}

export default SnapPixel;
