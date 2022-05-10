/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import {
  isDefinedAndNotNull,
  isNotEmpty,
  removeUndefinedAndNullValues,
} from "../utils/commonUtils";
import { NAME } from "./constants";
import {
  transformCustomVariable,
  appendProperties,
  isValidFlag,
} from "./utils";

class DCMFloodlight {
  constructor(config, analytics) {
    this.analytics = analytics;
    this.advertiserId = config.advertiserId;
    this.activityTag = config.activityTag;
    this.groupTag = config.groupTag;
    this.conversionEvents = config.conversionEvents;
    this.conversionLinker = config.conversionLinker;
    this.allowAdPersonalizationSignals = config.allowAdPersonalizationSignals;
    this.doubleclickId = config.doubleclickId;
    this.googleNetworkId = config.googleNetworkId;
    this.name = NAME;
  }

  /**
   * Ref - https://support.google.com/campaignmanager/answer/7554821
   */
  init() {
    logger.debug("===In init DCMFloodlight===");

    const sourceUrl = `https://www.googletagmanager.com/gtag/js?id=DC-${this.advertiserId}`;
    ScriptLoader("DCMFloodlight-integration", sourceUrl);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // disable ad personalization
    if (!this.allowAdPersonalizationSignals) {
      window.gtag("set", "allow_ad_personalization_signals", false);
    }

    window.gtag("js", new Date());

    if (this.conversionLinker) {
      window.gtag("config", `DC-${this.advertiserId}`);
    } else {
      window.gtag("config", `DC-${this.advertiserId}`, {
        conversion_linker: false,
      });
    }

    // Google's cookie matching functionality
    // Ref - https://developers.google.com/authorized-buyers/rtb/cookie-guide
    if (this.doubleclickId && this.googleNetworkId) {
      const image = document.createElement("img");
      image.src = `https://cm.g.doubleclick.net/pixel?google_nid=${
        this.googleNetworkId
      }&google_hm=${btoa(this.analytics.anonymousId)}`;
      document.getElementsByTagName("head")[0].appendChild(image);
    }
  }

  isLoaded() {
    logger.debug("===In isLoaded DCMFloodlight===");
    return window.dataLayer.push !== Array.prototype.push;
  }

  isReady() {
    logger.debug("===In isReady DCMFloodlight===");
    return window.dataLayer.push !== Array.prototype.push;
  }

  identify() {
    logger.debug("[DCM Floodlight] identify:: method not supported");
  }

  track(rudderElement) {
    logger.debug("===In DCMFloodlight track===");

    const { message } = rudderElement;
    let { event } = rudderElement.message;
    let payload;
    let customFloodlightVariable;
    let salesTag;

    const baseEndpoint = "https://ad.doubleclick.net/ddm/activity/";

    if (!event) {
      logger.error("[DCM Floodlight]:: event is required for track call");
      return;
    }

    // Specifies how conversions will be counted for a Floodlight activity
    let countingMethod = get(message, "properties.countingMethod");
    if (!countingMethod) {
      logger.error(
        "[DCM Floodlight]:: countingMethod is required for track call"
      );
      return;
    }
    countingMethod = countingMethod.trim().toLowerCase().replace(/\s+/g, "_");

    // find conversion event
    // some() stops execution if at least one condition is passed and returns bool
    event = event.trim().toLowerCase();
    const conversionEventFound = this.conversionEvents.some(
      (conversionEvent) => {
        if (
          conversionEvent &&
          conversionEvent.eventName &&
          conversionEvent.eventName.trim().toLowerCase() === event
        ) {
          if (
            isNotEmpty(conversionEvent.floodlightActivityTag) &&
            isNotEmpty(conversionEvent.floodlightGroupTag)
          ) {
            this.activityTag = conversionEvent.floodlightActivityTag.trim();
            this.groupTag = conversionEvent.floodlightGroupTag.trim();
          }
          salesTag = conversionEvent.salesTag;
          customFloodlightVariable = conversionEvent.customVariables || [];
          return true;
        }
        return false;
      }
    );

    if (!conversionEventFound) {
      logger.error("[DCM Floodlight]:: Conversion event not found");
      return;
    }

    customFloodlightVariable = transformCustomVariable(
      customFloodlightVariable
    );

    payload = {
      ord:
        get(message, "properties.orderId") ||
        get(message, "context.traits.order_id"),
      qty: get(message, "properties.quantity"),
      cost: get(message, "properties.revenue"),
      src: this.advertiserId,
      cat: this.activityTag,
      type: this.groupTag,
    };

    let eventSnippetPayload;
    if (salesTag) {
      // sums quantity from products array or fallback to properties.quantity
      const products = get(message, "properties.products");
      if (isNotEmpty(products) && Array.isArray(products)) {
        const quantities = products.reduce((accumulator, product) => {
          if (product.quantity) {
            return accumulator + product.quantity;
          }
          return accumulator;
        }, 0);
        if (quantities) {
          payload.qty = quantities;
        }
      }

      if (payload.cost && payload.ord) {
        eventSnippetPayload = {
          ...eventSnippetPayload,
          value: parseFloat(payload.cost),
          transaction_id: parseFloat(payload.ord),
        };
      }

      // Ref - https://support.google.com/campaignmanager/answer/7554821#zippy=%2Cfields-in-event-snippets-for-sales-tags
      switch (countingMethod) {
        case "transactions":
          payload.qty = 1;
          break;
        case "items_sold":
          if (payload.qty) {
            eventSnippetPayload = {
              ...eventSnippetPayload,
              quantity: parseFloat(payload.qty),
            };
          }
          break;
        default:
          logger.error("[DCM Floodlight] Sales Tag:: invalid counting method");
          return;
      }
    } else {
      // for counter tag
      payload.ord = get(message, "messageId");
      delete payload.qty;
      delete payload.cost;

      // Ref - https://support.google.com/campaignmanager/answer/7554821#zippy=%2Cfields-in-event-snippets-for-counter-tags
      switch (countingMethod) {
        case "standard":
          payload.ord = 1;
          break;
        case "unique":
          payload.ord = 1;
          payload.num = 1;
          break;
        case "per_session":
          payload.ord = get(message, "properties.sessionId");

          eventSnippetPayload = {
            ...eventSnippetPayload,
            session_id: get(message, "properties.sessionId"),
          };
          break;
        default:
          logger.error(
            "[DCM Floodlight] Counter Tag:: invalid counting method"
          );
          return;
      }
    }

    // COPPA, GDPR, npa must be provided inside integration object
    const { DCM_FLOODLIGHT } = this.analytics.loadOnlyIntegrations;

    if (DCM_FLOODLIGHT) {
      if (isDefinedAndNotNull(DCM_FLOODLIGHT.COPPA)) {
        payload.tag_for_child_directed_treatment = isValidFlag(
          "COPPA",
          DCM_FLOODLIGHT.COPPA
        );
      }

      if (isDefinedAndNotNull(DCM_FLOODLIGHT.GDPR)) {
        payload.tfua = isValidFlag("GDPR", DCM_FLOODLIGHT.GDPR);
      }

      if (isDefinedAndNotNull(DCM_FLOODLIGHT.npa)) {
        payload.npa = isValidFlag("npa", DCM_FLOODLIGHT.npa);
      }
    }

    // Ref - https://support.google.com/campaignmanager/answer/7554821?hl=en#zippy=%2Ccustom-fields
    let dcCustomParams = {
      ord: payload.ord,
      num: payload.num,
      tag_for_child_directed_treatment:
        payload.tag_for_child_directed_treatment,
      tfua: payload.tfua,
      npa: payload.name,
    };
    dcCustomParams = removeUndefinedAndNullValues(dcCustomParams);

    const matchId = get(message, "properties.matchId");
    if (matchId) {
      payload.match_id = [matchId];
    }

    eventSnippetPayload = {
      allow_custom_scripts: true,
      ...eventSnippetPayload,
      ...customFloodlightVariable,
      send_to: `DC-${this.advertiserId}/${this.groupTag}/${this.activityTag}+${countingMethod}`,
    };

    if (Object.keys(dcCustomParams).length > 0) {
      eventSnippetPayload.dc_custom_params = dcCustomParams;
    }
    eventSnippetPayload = removeUndefinedAndNullValues(eventSnippetPayload);

    // event snippet
    // Ref - https://support.google.com/campaignmanager/answer/7554821#zippy=%2Cfields-in-the-event-snippet---overview
    window.gtag("event", "conversion", eventSnippetPayload);

    payload = removeUndefinedAndNullValues(payload);
    customFloodlightVariable = removeUndefinedAndNullValues(
      customFloodlightVariable
    );

    let dcmEndpoint = appendProperties(baseEndpoint, payload);
    dcmEndpoint = appendProperties(dcmEndpoint, customFloodlightVariable)
      .slice(0, -1)
      .concat("?");

    // create noscript tag for
    const noscript = document.createElement("noscript");
    const image = document.createElement("img");
    image.src = dcmEndpoint;
    noscript.append(image);
    document.getElementsByTagName("head")[0].appendChild(noscript);
  }

  page(rudderElement) {
    logger.debug("===In DCMFloodlight page===");
    const { category } = rudderElement.message.properties;
    const { name } = rudderElement.message;

    if (category && name) {
      rudderElement.message.event = `Viewed ${category} ${name} Page`;
      rudderElement.message.type = "track";
      this.track(rudderElement);
    }

    // categorized pages
    if (category) {
      rudderElement.message.event = `Viewed ${category} Page`;
      rudderElement.message.type = "track";
      this.track(rudderElement);
    }

    // named pages
    if (name) {
      rudderElement.message.event = `Viewed ${name} Page`;
      rudderElement.message.type = "track";
      this.track(rudderElement);
    }
  }
}

export default DCMFloodlight;
