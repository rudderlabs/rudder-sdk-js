import logger from "../../utils/logUtil";

class BingAds {
  constructor(config) {
    this.tagID = config.tagID;
    this.name = "BINGADS";
  }

  loadBingadsScript = () => {
    ((w, d, t, r, u) => {
      let f, n, i;
      w[u] = w[u] || [], f = () => {
        let o = {
          ti: this.tagID
        };
        o.q = w[u], w[u] = new UET(o);
      }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function() {
        let s = this.readyState;
        s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null)
      }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i)
    })(window, document, "script", "https://bat.bing.com/bat.js", "uetq");
  }

  init = () => {
    this.loadBingadsScript();
    logger.debug("===in init BingAds===");
  }

  isLoaded = () => {
    logger.debug("in BingAds isLoaded");
    return (!!window.uetq && window.uetq.push !== Array.prototype.push);
  }

  isReady = () => {
    logger.debug("in BingAds isReady");
    return !!(window.uetq && window.uetq.push !== Array.prototype.push);
  }

  /*
    Visit here(for details Parameter details): https://help.ads.microsoft.com/#apex/3/en/53056/2
    Under: What data does UET collect once I install it on my website?
    It conatins info about parameters ea,ec,gc,gv,el
  */

  track = (rudderElement) => {
    const { type, properties, event } = rudderElement.message;
    const { category, currency, value, revenue, total } = properties;
    const payload = {
      ea: type,
      el: event
    };
    if (category) {
      payload.ec = category;
    }
    if (currency) {
      payload.gc = currency;
    }
    if (value) {
      payload.gv = value;
    }
    if (revenue) {
      payload.gv = revenue;
    }
    if (total) {
      payload.gv = total;
    }
    window.uetq.push(payload);
  }

  page = () => {
    window.uetq.push('pageLoad');
  }
}

export { BingAds };
