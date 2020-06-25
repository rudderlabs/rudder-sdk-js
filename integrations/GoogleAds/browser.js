import logger from "../../utils/logUtil";

class GoogleAds {
  constructor(config) {
    // this.accountId = config.accountId;//AW-696901813
    this.conversionId = config.conversionID;
    this.pageLoadConversions = config.pageLoadConversions;
    this.clickEventConversions = config.clickEventConversions;
    this.defaultPageConversion = config.defaultPageConversion;

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
    window.gtag("config", this.conversionId);

    logger.debug("===in init Google Ads===");
  }

  identify(rudderElement) {
    logger.debug("[GoogleAds] identify:: method not supported");
  }

  // https://developers.google.com/gtagjs/reference/event
  track(rudderElement) {
    logger.debug("in GoogleAdsAnalyticsManager track");
    const conversionData = this.getConversionData(
      this.clickEventConversions,
      rudderElement.message.event
    );
    if (conversionData.conversionLabel) {
      const { conversionLabel } = conversionData;
      const { eventName } = conversionData;
      const sendToValue = `${this.conversionId}/${conversionLabel}`;
      const properties = {};
      if (rudderElement.properties) {
        properties.value = rudderElement.properties.revenue;
        properties.currency = rudderElement.properties.currency;
        properties.transaction_id = rudderElement.properties.order_id;
      }
      properties.send_to = sendToValue;
      window.gtag("event", eventName, properties);
    }
  }

  page(rudderElement) {
    logger.debug("in GoogleAdsAnalyticsManager page");
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
