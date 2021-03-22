import logger from "../../utils/logUtil";

class BingAds {
  constructor(config) {
    this.apikey = config.apikey;
  }

  loadBingadsScript = () => {
    ((w, d, t, r, u) => {
      let f, n, i;
      w[u] = w[u] || [], f = () => {
        let o = {
          ti: this.apikey
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
    const { type, properties } = rudderElement.message;
    const { category, currency, value, label } = properties;
    let event = {
      ea: type
    };
    if (category) {
      event.ec = category;
    }
    if (currency) {
      event.gc = currency;
    }
    if (value) {
      event.gv = value;
    }
    if (label) {
      event.el = label;
    }
    window.uetq.push(event);
  }

  page = () => {
    window.uetq.push('pageLoad');
  }
}

export { BingAds };
