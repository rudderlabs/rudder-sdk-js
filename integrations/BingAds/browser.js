import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class BingAds {
  constructor(config) {
    this.apikey = config.apikey;
  }

  loadBingadsScript() {
    var apikey = this.apikey;
    (function(w, d, t, r, u) {
      var f, n, i;
      w[u] = w[u] || [], f = function() {
        var o = {
          ti: apikey
        };
        o.q = w[u], w[u] = new UET(o);
      }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function() {
        var s = this.readyState;
        s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
      }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)
    })(window, document, "script", "https://bat.bing.com/bat.js", "uetq");
  }

  init() {
    logger.debug("===in init BingAds===");
    console.log(window);
    this.loadBingadsScript();
  }

  isLoaded() {
    logger.debug("in Bingads isLoaded");
    return (!!window.uetq && window.uetq.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug("in Bingads isReady");
    return !!(window.uetq && window.uetq.push !== Array.prototype.push);
  }

  /*
    Visit here(for details Parameter details): https://help.ads.microsoft.com/#apex/3/en/53056/2
    Under: What data does UET collect once I install it on my website?
    It conatins info about parameters ea,ec,gc,gv,el

  */

  track(rudderElement) {
    const typeofcall = rudderElement.message.type;
    const properties = rudderElement.message.properties;
    var event = {
      ea: typeofcall
    };
    if (properties.category) event.ec = properties.category;
    if (properties.currency) event.gc = properties.currency;
    if (properties.value) event.gv = properties.value;
    if (properties.label) event.el = properties.label;
    window.uetq.push(event);
  }

  page(rudderElement) {
    window.uetq.push('pageLoad');
  }
}

export { BingAds };