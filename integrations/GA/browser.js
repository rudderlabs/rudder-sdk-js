import logger from "../../utils/logUtil";
import { Cookie } from "../../utils/storage/cookie";

class GA {
  constructor(config) {
    this.trackingID = config.trackingID;
    // config.allowLinker = true;
    this.allowLinker = config.allowLinker || false;
    this.name = "GA";
  }

  init() {
    (function(i, s, o, g, r, a, m) {
      i["GoogleAnalyticsObject"] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      "script",
      "https://www.google-analytics.com/analytics.js",
      "ga"
    );

    //window.ga_debug = {trace: true};

    ga("create", this.trackingID, "auto", "rudder_ga", {
      allowLinker: this.allowLinker,
    });

    var userId = Cookie.get('rl_user_id');
    if (userId && userId !== '') {
      ga("rudder_ga.set", "userId", userId);
    }
    //ga("send", "pageview");

    logger.debug("===in init GA===");
  }

  identify(rudderElement) {
    var userId = rudderElement.message.userId !== ''
      ? rudderElement.message.userId
      : rudderElement.message.anonymousId
    ga("rudder_ga.set", "userId", userId);
    logger.debug("in GoogleAnalyticsManager identify");
  }

  track(rudderElement) {
    var eventCategory = rudderElement.message.event;
    var eventAction = rudderElement.message.event;
    var eventLabel = rudderElement.message.event;
    var eventValue = "";
    if (rudderElement.message.properties) {
      eventValue = rudderElement.message.properties.value
        ? rudderElement.message.properties.value
        : rudderElement.message.properties.revenue;
      eventCategory = rudderElement.message.properties.category
        ? rudderElement.message.properties.category
        : eventCategory;
      eventLabel = rudderElement.message.properties.label
        ? rudderElement.message.properties.label
        : eventLabel;
    }

    var payLoad = {
      hitType: "event",
      eventCategory: eventCategory,
      eventAction: eventAction,
      eventLabel: eventLabel,
      eventValue: eventValue
    };
    ga("rudder_ga.send", "event", payLoad);
    logger.debug("in GoogleAnalyticsManager track");
  }

  page(rudderElement) {
    logger.debug("in GoogleAnalyticsManager page");
    var path =
      rudderElement.message.properties && rudderElement.message.properties.path
        ? rudderElement.message.properties.path
        : undefined;
    var title = rudderElement.message.properties && rudderElement.message.properties.title
        ? rudderElement.message.properties.title
        : undefined;
    var location = rudderElement.message.properties && rudderElement.message.properties.url
        ? rudderElement.message.properties.url
        : undefined;

    if (path) {
      ga("rudder_ga.set", "page", path);
    }

    if (title) {
      ga("rudder_ga.set", "title", title);
    }

    if (location) {
      ga("rudder_ga.set", "location", location);
    }
    ga("rudder_ga.send", "pageview");
    
  }

  isLoaded() {
    logger.debug("in GA isLoaded");
    return !!window.gaplugins;
  }

  isReady() {
    return !!window.gaplugins;
  }
}

export { GA };
