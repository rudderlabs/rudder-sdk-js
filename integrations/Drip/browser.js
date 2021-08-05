import get from "get-value";
import logger from "../../utils/logUtil";
import { removeUndefinedAndNullValues } from "../utils/commonUtils";
import { getDestinationExternalID } from "./utils";

class Drip {
  constructor(config) {
    this.accountId = config.accountId;
    this.campaignId = config.campaignId;
    this.name = "DRIP";
  }

  init() {
    logger.debug("===In init Drip===");

    window._dcq = _dcq || [];
    window._dcs = _dcs || {};
    window._dcs.account = this.accountId;

    (function () {
      var dc = document.createElement("script");
      dc.type = "text/javascript";
      dc.async = true;
      dc.src = `//tag.getdrip.com/${this.accountId}.js`;
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(dc, s);
    })();
  }

  isLoaded() {
    logger.debug("===In isLoaded Drip===");
    return !!(window._dcq && window._dcq.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug("===In isReady Drip===");
    return !!(window._dcq && window._dcq.push !== Array.prototype.push);
  }

  identify(rudderElement) {
    logger.debug("===In Drip identify===");

    const { message } = rudderElement;
    if (!message.context) {
      logger.error("user context not present");
      return;
    }

    if (!message.context.traits) {
      logger.error("user traits not present");
      return;
    }

    const email = get(message, "context.traits.email");
    if (!email) {
      logger.error("email is required for identify");
      return;
    }

    const euConsent = get(message, "context.traits.euConsent");
    if (
      euConsent &&
      !(
        euConsent.toLowercase() === "granted" ||
        euConsent.toLowercase() === "denied"
      )
    ) {
      euConsent = null;
    }

    let payload = {
      email: email,
      new_email: get(message, "context.traits.newEmail"),
      user_id: get(message, "userId") || get(message, "anonymousId"),
      tags: get(message, "context.traits.tags"),
      remove_tags: get(message, "context.traits.removeTags"),
      prospect: get(message, "context.traits.prospect"),
      eu_consent: euConsent,
      eu_consent_message: get(message, "context.traits.euConsentMessage"),
      success: (response) => {
        // Call a method with the response object
        // Success callback is optional
        logger.debug("identify call was success");
      },
    };
    payload = removeUndefinedAndNullValues(payload);
    window._dcq.push(["identify", payload]);

    const campaignId =
      getDestinationExternalID(message, "dripCampaignId") || this.campaignId;

    if (campaignId) {
      const fields = get(message, "context.traits");
      delete fields.campaignId;
      delete fields.doubleOptin;

      let campaign_payload = {
        campaign_id: campaignId,
        fields: fields,
        double_optin: get(message, "context.traits.doubleOptin"),
        success: (response) => {
          // Call a method with the response object
          // Success callback is optional
          logger.debug("Subscription to an Email Series Campaign was success");
        },
      };
      campaign_payload = removeUndefinedAndNullValues(campaign_payload);

      window._dcq.push(["subscribe", campaign_payload]);
    }
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
        success: (response) => {
          // Call a method with the response object
          // Success callback is optional
          logger.debug("track call was success");
        },
      };

      payload = removeUndefinedAndNullValues(payload);
      window._dcq.push(["track", "Viewed a Product", payload]);
    } else {
      payload = {
        value: get(message, "properties.value"),
        occurred_at:
          get(message, "occurredAt") ||
          get(message, "timestamp") ||
          get(message, "originalTimestamp"),
        success: (response) => {
          // Call a method with the response object
          // Success callback is optional
          logger.debug("track call was success");
        },
      };

      payload = removeUndefinedAndNullValues(payload);
      window._dcq.push(["track", event, payload]);
    }
  }
}

export default Drip;
