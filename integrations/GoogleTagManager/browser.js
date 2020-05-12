import logger from "../../utils/logUtil";
class GoogleTagManager {
  constructor(config) {
    this.containerID = config.containerID;
    this.name = "GOOGLETAGMANAGER";
  }

  init() {
    logger.debug("===in init GoogleTagManager===");
    (function(w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", this.containerID);
  }

  identify(rudderElement) {
    logger.error("method not supported");
  }

  track(rudderElement) {
    logger.debug("===in track GoogleTagManager===");
    let rudderMessage = rudderElement.message;
    let props = {
      event: rudderMessage.event,
      userId: rudderMessage.userId,
      anonymousId: rudderMessage.anonymousId,
      ...rudderMessage.properties
    };
    this.sendToGTMDatalayer(props);
  }

  page(rudderElement) {
    logger.debug("===in page GoogleTagManager===");
    let rudderMessage = rudderElement.message;
    let pageName = rudderMessage.name;
    let pageCategory = rudderMessage.properties
      ? rudderMessage.properties.category
      : undefined;

    let eventName;

    if (pageName) {
      eventName = "Viewed " + pageName + " page";
    }

    if (pageCategory && pageName) {
      eventName = "Viewed " + pageCategory + " " + pageName + " page";
    }

    if(!eventName) {
      eventName = "Viewed a Page";
    }
    
    let props = {
      event: eventName,
      userId: rudderMessage.userId,
      anonymousId: rudderMessage.anonymousId,
      ...rudderMessage.properties
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
