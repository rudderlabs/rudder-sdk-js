import logger from "../../utils/logUtil";
import onBody from "on-body";
import {
  MAX_WAIT_FOR_INTEGRATION_LOAD,
  INTEGRATION_LOAD_CHECK_INTERVAL
} from "../../utils/constants";

class Chartbeat {
  constructor(config, analytics) {
    this.analytics = analytics; // use this to modify failed integrations or for passing events from callback to other destinations
    this._sf_async_config = window._sf_async_config =
      window._sf_async_config || {};
    window._sf_async_config.useCanonical = true;
    window._sf_async_config.uid = config.uid;
    window._sf_async_config.domain = config.domain;
    this.isVideo = config.video ? true : false;
    this.sendNameAndCategoryAsTitle = config.sendNameAndCategoryAsTitle || true;
    this.subscriberEngagementKeys = config.subscriberEngagementKeys || [];
    this.replayEvents = [];
    this.failed = false;
    this.isFirstPageCallMade = false;
    this.name = "CHARTBEAT";
  }

  init() {
    logger.debug("===in init Chartbeat===");
  }

  identify(rudderElement) {
    logger.debug("in Chartbeat identify");
  }

  track(rudderElement) {
    logger.debug("in Chartbeat track");
  }

  page(rudderElement) {
    logger.debug("in Chartbeat page");
    this.loadConfig(rudderElement);

    if (!this.isFirstPageCallMade) {
      this.isFirstPageCallMade = true;
      this.initAfterPage();
    } else {
      if (this.failed) {
        logger.debug("===ignoring cause failed integration===");
        this.replayEvents = [];
        return;
      }
      if (!this.isLoaded() && !this.failed) {
        logger.debug("===pushing to replay queue for chartbeat===");
        this.replayEvents.push(["page", rudderElement]);
        return;
      }
      logger.debug("===processing page event in chartbeat===");
      let properties = rudderElement.message.properties;
      window.pSUPERFLY.virtualPage(properties.path);
    }
  }

  isLoaded() {
    logger.debug("in Chartbeat isLoaded");
    if (!this.isFirstPageCallMade) {
      return true;
    } else {
      return !!window.pSUPERFLY;
    }
  }

  isFailed() {
    return this.failed;
  }

  isReady() {
    return !!window.pSUPERFLY;
  }

  loadConfig(rudderElement) {
    let properties = rudderElement.message.properties;
    let category = properties ? properties.category : undefined;
    let name = rudderElement.message.name;
    let author = properties ? properties.author : undefined;
    let title;
    if (this.sendNameAndCategoryAsTitle) {
      title = category && name ? category + " " + name : name;
    }
    if (category) window._sf_async_config.sections = category;
    if (author) window._sf_async_config.authors = author;
    if (title) window._sf_async_config.title = title;

    var _cbq = (window._cbq = window._cbq || []);

    for (var key in properties) {
      if (!properties.hasOwnProperty(key)) continue;
      if (this.subscriberEngagementKeys.indexOf(key) > -1) {
        _cbq.push([key, properties[key]]);
      }
    }
  }

  initAfterPage() {
    onBody(() => {
      var script = this.isVideo ? "chartbeat_video.js" : "chartbeat.js";
      function loadChartbeat() {
        var e = document.createElement("script");
        var n = document.getElementsByTagName("script")[0];
        e.type = "text/javascript";
        e.async = true;
        e.src = "//static.chartbeat.com/js/" + script;
        n.parentNode.insertBefore(e, n);
      }
      loadChartbeat();
    });

    this._isReady(this).then(instance => {
      logger.debug("===replaying on chartbeat===");
      instance.replayEvents.forEach(event => {
        instance[event[0]](event[1]);
      });
    });
  }

  pause(time) {
    return new Promise(resolve => {
      setTimeout(resolve, time);
    });
  }

  _isReady(instance, time = 0) {
    return new Promise(resolve => {
      if (this.isLoaded()) {
        this.failed = false;
        logger.debug("===chartbeat loaded successfully===");
        instance.analytics.emit("ready");
        return resolve(instance);
      }
      if (time >= MAX_WAIT_FOR_INTEGRATION_LOAD) {
        this.failed = true;
        logger.debug("===chartbeat failed===");
        return resolve(instance);
      }
      this.pause(INTEGRATION_LOAD_CHECK_INTERVAL).then(() => {
        return this._isReady(
          instance,
          time + INTEGRATION_LOAD_CHECK_INTERVAL
        ).then(resolve);
      });
    });
  }
}

export { Chartbeat };
