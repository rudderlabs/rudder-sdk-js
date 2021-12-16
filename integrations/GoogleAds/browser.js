/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import { extractCustomFields } from "../../utils/utils";
import { removeUndefinedAndNullValues } from "../utils/commonUtils";

class GoogleAds {
  constructor(config) {
    // this.accountId = config.accountId;//AW-696901813
    this.conversionId = config.conversionID;
    this.pageLoadConversions = config.pageLoadConversions;
    this.clickEventConversions = config.clickEventConversions;
    this.defaultPageConversion = config.defaultPageConversion;
    this.dynamicRemarketing = config.dynamicRemarketing;
    this.sendPageView = config.sendPageView || true;
    this.conversionLinker = config.conversionLinker || true;
    this.disableAdPersonalization = config.disableAdPersonalization || false;
    this.name = "GOOGLEADS";
  }

  init() {
    const sourceUrl = `https://www.googletagmanager.com/gtag/js?id=${this.conversionId}`;
    (function (id, src, document) {
      logger.debug(`in script loader=== ${id}`);
      const js = document.createElement("script");
      js.src = src;
      js.async = 1;
      js.type = "text/javascript";
      js.id = id;
      const e = document.getElementsByTagName("head")[0];
      logger.debug("==script==", e);
      e.appendChild(js);
    })("googleAds-integration", sourceUrl, document);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());

    // Additional Settings

    const config = {};
    config.send_page_view = this.sendPageView;
    config.conversion_linker = this.conversionLinker;

    if (this.disableAdPersonalization) {
      window.gtag("set", "allow_ad_personalization_signals", false);
    }

    window.gtag("config", this.conversionId, config);

    logger.debug("===in init Google Ads===");
  }

  identify() {
    logger.debug("[GoogleAds] identify:: method not supported");
  }

  // https://developers.google.com/gtagjs/reference/event
  track(rudderElement) {
    logger.debug("in GoogleAdsAnalyticsManager track");

    // Dynamic remarketing disabled
    if (!this.dynamicRemarketing) {
      const conversionData = this.getConversionData(
        this.clickEventConversions,
        rudderElement.message.event
      );
      if (conversionData.conversionLabel) {
        const { conversionLabel } = conversionData;
        const { eventName } = conversionData;
        const sendToValue = `${this.conversionId}/${conversionLabel}`;
        let properties = {};
        if (rudderElement.message.properties) {
          // mapping value from (revenue or value) as value data is generic during
          // dynamic remarketing and current user does not get mixed with it
          properties.value =
            rudderElement.message.properties.revenue ||
            rudderElement.message.properties.value;
          properties.currency = rudderElement.message.properties.currency;
          properties.transaction_id = rudderElement.message.properties.order_id;
        }
        properties.send_to = sendToValue;
        properties = removeUndefinedAndNullValues(properties);
        window.gtag("event", eventName, properties);
      }
    } else {
      const { event } = rudderElement.message;
      if (!event) {
        logger.error("Event name not present");
        return;
      }

      let payload = {};
      if (rudderElement.message.properties) {
        const sendToValue = this.conversionId;
        payload.value =
          rudderElement.message.properties.revenue ||
          rudderElement.message.properties.value;

        // extracting all properties excluding existing data
        let extraFields = {};
        try {
          extraFields = extractCustomFields(
            rudderElement.message,
            extraFields,
            ["properties"],
            ["revenue", "value"]
          );
        } catch (err) {
          logger.debug(`Error occured at extractCustomFields ${err}`);
        }

        payload = { ...payload, ...extraFields };
        payload.send_to = sendToValue;
        payload = removeUndefinedAndNullValues(payload);
      }

      window.gtag("event", event, payload);
    }
  }

  page(rudderElement) {
    logger.debug("in GoogleAdsAnalyticsManager page");

    // Dynamic re-marketing is disabled
    if (!this.dynamicRemarketing) {
      const conversionData = this.getConversionData(
        this.pageLoadConversions,
        rudderElement.message.name
      );
      if (conversionData.conversionLabel) {
        const { conversionLabel } = conversionData;
        const { eventName } = conversionData;
        window.gtag("event", eventName, {
          send_to: `${this.conversionId}/${conversionLabel}`,
        });
      }
    } else {
      const event = rudderElement.message.name;
      if (!event) {
        logger.error("Event name not present");
        return;
      }

      let payload = {};
      if (rudderElement.message.properties) {
        const sendToValue = this.conversionId;
        payload = rudderElement.message.properties;
        payload.send_to = sendToValue;
        payload = removeUndefinedAndNullValues(payload);
      }

      window.gtag("event", event, payload);
    }
  }

  getConversionData(eventTypeConversions, eventName) {
    const conversionData = {};
    if (eventTypeConversions) {
      if (eventName) {
        eventTypeConversions.forEach((eventTypeConversion) => {
          if (
            eventTypeConversion.name.toLowerCase() === eventName.toLowerCase()
          ) {
            // rudderElement["message"]["name"]
            conversionData.conversionLabel =
              eventTypeConversion.conversionLabel;
            conversionData.eventName = eventTypeConversion.name;
          }
        });
      } else if (this.defaultPageConversion) {
        conversionData.conversionLabel = this.defaultPageConversion;
        conversionData.eventName = "Viewed a Page";
      }
    }
    return conversionData;
  }

  isLoaded() {
    return window.dataLayer.push !== Array.prototype.push;
  }

  isReady() {
    return window.dataLayer.push !== Array.prototype.push;
  }
}

export { GoogleAds };
