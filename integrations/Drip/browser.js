import get from "get-value";
import logger from "../../utils/logUtil";
import { removeUndefinedAndNullValues } from "../utils/commonUtils";

class Drip {
  constructor(config) {
    this.accountId = config.accountId;
    this.campaignId = config.campaignId;
    this.name = "DRIP";
  }

  init() {
    logger.debug("===In init Drip===");

    var _dcq = _dcq || [];
    var _dcs = _dcs || {};
    _dcs.account = this.accountId;

    (function () {
      var dc = document.createElement("script");
      dc.type = "text/javascript";
      dc.async = true;
      dc.src = `//tag.getdrip.com/${this.accountId}.js`;
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(dc, s);
    })();
  }

  identify(rudderElement) {
    logger.debug("===In Drip identify===");

    const { message } = rudderElement;
    if (!message.context.traits) {
      logger.error("user traits not present");
      return;
    }

    const email = message.context.traits;
    if (!email) {
      logger.error("email is required for the call");
      return;
    }

    const euConsent = message.context.traits;
    if (
      !(
        euConsent.toLowercase() === "granted" ||
        euConsent.toLowercase() === "denied"
      )
    ) {
      euConsent = "";
    }

    let payload = {
      email: email,
      new_email: get(message, "context.traits.newEmail"),
      user_id: get(message, "userId"),
      tags: get(message, "context.traits.tags"),
      remove_tags: get(message, "context.traits.removeTags"),
      prospect: get(message, "context.traits.prospect"),
      eu_consent: euConsent,
      eu_consent_message: get(message, "context.traits.euConsentMessage"),
      success: function (response) {
        // Call a method with the response object
        // Success callback is optional
        logger.debug("identify call was success");
      },
    };
    payload = removeUndefinedAndNullValues(payload);

    const campaignId = message.context.traits;

    if (campaignId) {
      if (this.campaignId == campaignId) {
        let campaign_payload = {
          campaign_id: campaignId,
          fields: get(message, "context.traits.fields"),
          double_optin: get(message, "context.traits.doubleOptin"),
          success: function (response) {
            // Call a method with the response object
            // Success callback is optional
            logger.debug(
              "Subscription to an Email Series Campaign was success"
            );
          },
        };
        campaign_payload = removeUndefinedAndNullValues(campaign_payload);

        _dcq.push(["identify", payload]);
        _dcq.push(["subscribe", campaign_payload]);
      } else {
        logger.error(
          "config campaignId doesn't match with user traits campaignId"
        );
        return;
      }
    }

    _dcq.push(["identify", payload]);
  }

  track(rudderElement) {
    logger.debug("===In Drip track===");

    const { message } = rudderElement;
    const { event } = rudderElement.message;

    if (!event) {
      logger.error("Event name not present");
      return;
    }

    let payload;

    if (event.toLowercase() === "product viewed") {
      payload = {
        product_id: get(message, "properties.productId"),
        product_variant_id: get(message, "properties.productVariantId"),
        sku: get(message, "properties.sku"),
        name: get(message, "properties.name"),
        brand: get(message, "properties.brand"),
        categories: get(message, "properties.categories"),
        price: get(message, "properties.price"),
        success: function (response) {
          // Call a method with the response object
          // Success callback is optional
          logger.debug("track call was success");
        },
      };

      payload = removeUndefinedAndNullValues(payload);

      _dcq.push(["track", "Viewed a Product", payload]);
    } else {
      payload = {
        value: get(message, "properties.value"),
        occurred_at:
          get(message, "occurredAt") ||
          get(message, "timestamp") ||
          get(message, "originalTimestamp"),
        success: function (response) {
          // Call a method with the response object
          // Success callback is optional
          logger.debug("track call was success");
        },
      };

      payload = removeUndefinedAndNullValues(payload);

      _dcq.push(["track", event, payload]);
    }
  }

  isLoaded() {
    logger.debug("===In isLoaded Drip===");
    return !!(window._dcq && window._dcq.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug("===In isReady Drip===");
    return !!(window._dcq && window._dcq.push !== Array.prototype.push);
  }
}

export { Drip };
