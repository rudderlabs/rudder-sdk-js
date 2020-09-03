/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
import ScriptLoader from "../ScriptLoader";
import logger from "../../utils/logUtil";

class TVSquared {
  constructor(config) {
    this.brandId = config.brandId;
    this.clientId = config.clientId;
    this.eventWhiteList = config.eventWhiteList || [];
    this.customMetrics = config.customMetrics || [];
    this.name = "TVSquared";
  }

  init() {
    logger.debug("===in init TVSquared===");
    window._tvq = window._tvq || [];
    let url = document.location.protocol === "https:" ? "https://" : "http://";
    url += `collector-${this.clientId}.tvsquared.com/`;
    window._tvq.push(["setSiteId", this.brandId]);
    window._tvq.push(["setTrackerUrl", `${url}tv2track.php`]);
    ScriptLoader("TVSquared-integration", `${url}tv2track.js`);
  }

  isLoaded = () => {
    logger.debug("in TVSqaured isLoaded");
    return !!(window._tvq && window._tvq.push !== Array.prototype.push);
  };

  isReady = () => {
    logger.debug("in TVSqaured isReady");
    return !!(window._tvq && window._tvq.push !== Array.prototype.push);
  };

  page = () => {
    window._tvq.push(["trackPageView"]);
  };

  track(rudderElement) {
    const { event, userId, anonymousId } = rudderElement.message;
    const {
      revenue,
      productType,
      category,
      order_id,
      promotion_id,
    } = rudderElement.message.properties;
    let i;
    let j;
    let whitelist = this.eventWhiteList.slice();
    whitelist = whitelist.filter((wl) => {
      return wl.event !== "";
    });
    for (i = 0; i < whitelist.length; i += 1) {
      if (event.toUpperCase() === whitelist[i].event.toUpperCase()) {
        break;
      }
      if (i === whitelist.length - 1) {
        return;
      }
    }

    const session = { user: userId || anonymousId || "" };
    const action = {
      rev: revenue ? this.formatRevenue(revenue) : "",
      prod: category || productType || "",
      id: order_id || "",
      promo: promotion_id || "",
    };
    let customMetrics = this.customMetrics.slice();
    customMetrics = customMetrics.filter((cm) => {
      return cm.propertyName !== "";
    });
    if (customMetrics.length) {
      for (j = 0; j < customMetrics.length; j += 1) {
        const key = customMetrics[j].propertyName;
        const value = rudderElement.message.properties[key];
        if (value) {
          action[key] = value;
        }
      }
    }
    window._tvq.push([
      function () {
        this.setCustomVariable(5, "session", JSON.stringify(session), "visit");
      },
    ]);
    if (event.toUpperCase() !== "RESPONSE") {
      window._tvq.push([
        function () {
          this.setCustomVariable(5, event, JSON.stringify(action), "page");
        },
      ]);
      window._tvq.push(["trackPageView"]);
    }
  };

  formatRevenue = (revenue) => {
    let rev = revenue;
    rev = parseFloat(rev.toString().replace(/^[^\d.]*/, ""));
    return rev;
  };
}
export default TVSquared;
