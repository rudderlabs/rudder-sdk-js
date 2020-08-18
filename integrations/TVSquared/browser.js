import ScriptLoader from "../ScriptLoader";

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
    window._tvq = window._tvq = [];
    var url = document.location.protocol == "https:" ? "https://" : "http://";
    url += "collector-" + this.clientId + ".tvsquared.com/";
    window._tvq.push(["setSiteId", this.brandId]);
    window._tvq.push(["setTrackerUrl", url + "tv2track.php"]);
    ScriptLoader("TVSquared-integration", url + "tv2track.js");
    window._tvq.push([
      function () {
        this.deleteCustomVariable(5, "page");
      },
    ]);
  }

  isLoaded() {
    logger.debug("in TVSqaured isLoaded");
    return !!window_tvq;
  }

  isReady() {
    logger.debug("in TVSqaured isReady");

    return !!window_tvq;
  }

  page() {
    window._tvq.push(["trackPageView"]);
  }

  track(rudderElement) {
    const { event, userId, anonymousId } = rudderElement.message;
    const {
      revenue,
      productType,
      order_id,
      promotion_id,
    } = rudderElement.message.properties;
    let i, j;
    var whitelist = eventWhiteList.slice();
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

    var session = { user: userId || anonymousId || "" };
    var action = {
      rev: this.formatRevenue(revenue) || "",
      prod: productType || "",
      id: order_id || "",
      promo: promotion_id || "",
    };
    var customMetrics = this.customMetrics.slice();
    customMetrics = customMetrics.filter((cm) => {
      return cm.propertyName !== "";
    });
    if (customMetrics.length) {
      for (j = 0; j < customMetrics.length; j += 1) {
        var key = customMetrics[j].propertyName;
        var value = rudderElement.message.properties[key];
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
    if (event !== "Response") {
      window._tvq.push([
        function () {
          this.setCustomVariable(5, event, JSON.stringify(action), "page");
        },
      ]);
      window._tvq.push(["trackPageView"]);
    }
  }

  formatRevenue(revenue) {
    revenue = parseFloat(revenue.replace(/^[^\d\.]*/, ""));
    return revenue;
  }
}
export { TVSquared };
