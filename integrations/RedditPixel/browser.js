import logger from "../../utils/logUtil";

class RedditPixel {
  constructor(config) {
    this.advertiserId = config.advertiserId;

    this.name = "REDDITPIXEL";
  }

  init() {
    logger.debug("===In init RedditPixel===");

    !(function (w, d) {
      if (!w.rdt) {
        var p = (w.rdt = function () {
          p.sendEvent
            ? p.sendEvent.apply(p, arguments)
            : p.callQueue.push(arguments);
        });
        p.callQueue = [];
        var t = d.createElement("script");
        (t.src = "https://www.redditstatic.com/ads/pixel.js"), (t.async = !0);
        var s = d.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(t, s);
      }
    })(window, document);

    rdt("init", "${this.advertiserId}");
  }

  isLoaded() {
    logger.debug("===In isLoaded RedditPixel===");

    return !!(window.rdt && window.rdt.advertiserID === this.advertiserId);
  }

  isReady() {
    logger.debug("===In isReady RedditPixel===");

    return !!(window.rdt && window.rdt.advertiserID === this.advertiserId);
  }

  identify(rudderElement) {
    logger.debug("In RedditPixel identity");

    window.rdt("track", "SignUp");
  }

  track(rudderElement) {
    logger.debug("In RedditPixel track");

    const { event } = rudderElement.message;
    switch (event.toLowerCase()) {
      case "product added":
        window.rdt("track", "AddToCart");
        break;
      case "product added to wishlist":
        window.rdt("track", "AddToWishlist");
        break;
      case "order completed":
        window.rdt("track", "Purchase");
        break;
      case "lead":
        window.rdt("track", "Lead");
        break;
      case "view content":
        window.rdt("track", "ViewContent");
        break;
      case "search":
        window.rdt("track", "Search");
        break;
      default:
        break;
    }
  }

  page(rudderElement) {
    logger.debug("In RedditPixel page");

    window.rdt("track", "PageVisit");
  }
}

export default RedditPixel;
