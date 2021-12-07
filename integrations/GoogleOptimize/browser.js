import logger from "../../utils/logUtil";

import ScriptLoader from "../ScriptLoader";

class GoogleOptimize {
  constructor(config) {
    this.name = "GOOGLE_OPTIMIZE";
    this.ga = config.ga;
    this.trackingId = config.trackingId;
    this.containerId = config.containerId;
    this.async = config.async;
    this.aflicker = config.aflicker;
  }

  init() {
    logger.debug("===in init Google Optimize===");
    if (!this.containerId) {
      return;
    }
    // load optimize script first
    ScriptLoader(
      "Google Optimize",
      `https://www.googleoptimize.com/optimize.js?id=${this.containerId}`,
      this.async
    );
    if (this.ga) {
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
    }

    if (this.aflicker) {
      const flickerObj = {};
      flickerObj[`${this.containerId}`] = true;
      const flick = document.createElement("style");
      flick.innerHTML = ".async-hide { opacity: 0 !important}";
      const js = document.createElement("script");
      js.innerHTML = `(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};(a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;})(window,document.documentElement,'async-hide','dataLayer',4000,{'${this.containerId}':true});`;
      const e = document.getElementsByTagName("script")[0];
      e.parentNode.insertBefore(flick, e);
      e.parentNode.insertBefore(js, e);
    }
  }

  isLoaded() {
    logger.debug("=== in isLoaded Google Optimize===");
    return !!window.dataLayer;
  }

  isReady() {
    logger.debug("=== in isReady Google Optimize===");
    return !!window.dataLayer;
  }
}
export default GoogleOptimize;
