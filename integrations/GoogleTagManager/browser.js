import logger from "../../utils/logUtil";

class GoogleTagManager {
  constructor(config) {
    this.containerID = config.containerID;
    this.name = "GOOGLETAGMANAGER";
  }

  init() {
    logger.debug("===in init GoogleTagManager===");
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s);
      const dl = l != "dataLayer" ? `&l=${l}` : "";
      j.async = true;
      j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", this.containerID);
  }

  identify(rudderElement) {
    logger.debug("[GTM] identify:: method not supported");
  }

  track(rudderElement) {
    logger.debug("===in track GoogleTagManager===");
    const rudderMessage = rudderElement.message;
    const props = {
      event: rudderMessage.event,
      userId: rudderMessage.userId,
      anonymousId: rudderMessage.anonymousId,
      ...rudderMessage.properties,
    };
    this.sendToGTMDatalayer(props);
  }

  page(rudderElement) {
    logger.debug("===in page GoogleTagManager===");
    const rudderMessage = rudderElement.message;
    const pageName = rudderMessage.name;
    const pageCategory = rudderMessage.properties
      ? rudderMessage.properties.category
      : undefined;

    let eventName;

    if (pageName) {
      eventName = `Viewed ${pageName} page`;
    }

    if (pageCategory && pageName) {
      eventName = `Viewed ${pageCategory} ${pageName} page`;
    }
    if (!eventName) {
      eventName = "Viewed a Page";
    }
    const props = {
      event: eventName,
      userId: rudderMessage.userId,
      anonymousId: rudderMessage.anonymousId,
      ...rudderMessage.properties,
    };

    this.sendToGTMDatalayer(props);
  }

  isLoaded() {
    return !!(
      window.dataLayer && Array.prototype.push !== window.dataLayer.push
    );
  }

  sendToGTMDatalayer(props) {
    window.dataLayer.push(props);
  }

  isReady() {
    return !!(
      window.dataLayer && Array.prototype.push !== window.dataLayer.push
    );
  }
}

export { GoogleTagManager };
