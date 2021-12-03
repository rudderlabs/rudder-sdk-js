import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class GoogleOptimize {
  constructor(config) {
    this.name = "GOOGLE_OPTIMIZE";
    this.trackingId = config.trackingId;
    this.containerId = config.containerId;
    this.async = config.async;
  }

  init() {
    logger.debug("===in init Google Optimize===");
    if (!this.trackingId) {
      return;
    }
    ScriptLoader(
      "Google Tag Manager",
      `https://www.googletagmanager.com/gtag/js?id=${this.trackingId}`
    );
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", `${this.trackingId}`);

    if (!this.containerId) {
      return;
    }
    if (this.async) {
      ScriptLoader(
        "Google Optimize",
        `https://www.googleoptimize.com/optimize.js?id=${this.containerId}`
      );
    } else {
      const js = document.createElement("script");
      js.src = src;
      js.async = false;
      js.type = "text/javascript";
      js.id = id;
      const e = document.getElementsByTagName("script")[0];
      logger.debug("==parent script==", e);
      logger.debug("==adding script==", js);
      e.parentNode.insertBefore(js, e);
    }
  }
}
export default GoogleOptimize;
