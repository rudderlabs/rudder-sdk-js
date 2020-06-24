import logger from "../../utils/logUtil";
import {
  MAX_WAIT_FOR_INTEGRATION_LOAD,
  INTEGRATION_LOAD_CHECK_INTERVAL,
} from "../../utils/constants";

class Comscore {
  constructor(config, analytics) {
    this.c2ID = config.c2ID;
    this.analytics = analytics;
    this.comScoreBeaconParam = config.comScoreBeaconParam
      ? config.comScoreBeaconParam
      : {};
    this.isFirstPageCallMade = false;
    this.failed = false;
    this.comScoreParams = {};
    this.replayEvents = [];
    this.name = "COMSCORE";
  }

  init() {
    logger.debug("===in init Comscore init===");
  }

  identify(rudderElement) {
    logger.debug("in Comscore identify");
  }

  track(rudderElement) {
    logger.debug("in Comscore track");
  }

  page(rudderElement) {
    logger.debug("in Comscore page");

    this.loadConfig(rudderElement);

    if (!this.isFirstPageCallMade) {
      this.isFirstPageCallMade = true;
      this.initAfterPage();
    } else {
      if (this.failed) {
        this.replayEvents = [];
        return;
      }
      if (!this.isLoaded() && !this.failed) {
        this.replayEvents.push(["page", rudderElement]);
        return;
      }
      const { properties } = rudderElement.message;
      // window.COMSCORE.beacon({c1:"2", c2: ""});
      // this.comScoreParams = this.mapComscoreParams(properties);
      window.COMSCORE.beacon(this.comScoreParams);
    }
  }

  loadConfig(rudderElement) {
    logger.debug("=====in loadConfig=====");
    this.comScoreParams = this.mapComscoreParams(
      rudderElement.message.properties
    );
    window._comscore = window._comscore || [];
    window._comscore.push(this.comScoreParams);
  }

  initAfterPage() {
    logger.debug("=====in initAfterPage=====");
    (function () {
      const s = document.createElement("script");
      const el = document.getElementsByTagName("script")[0];
      s.async = true;
      s.src = `${
        document.location.protocol == "https:" ? "https://sb" : "http://b"
      }.scorecardresearch.com/beacon.js`;
      el.parentNode.insertBefore(s, el);
    })();

    this._isReady(this).then((instance) => {
      instance.replayEvents.forEach((event) => {
        instance[event[0]](event[1]);
      });
    });
  }

  pause(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }

  _isReady(instance, time = 0) {
    return new Promise((resolve) => {
      if (this.isLoaded()) {
        this.failed = false;
        instance.analytics.emit("ready");
        return resolve(instance);
      }
      if (time >= MAX_WAIT_FOR_INTEGRATION_LOAD) {
        this.failed = true;
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

  mapComscoreParams(properties) {
    logger.debug("=====in mapComscoreParams=====");
    const comScoreBeaconParamsMap = this.comScoreBeaconParam;

    const comScoreParams = {};

    Object.keys(comScoreBeaconParamsMap).forEach(function (property) {
      if (property in properties) {
        const key = comScoreBeaconParamsMap[property];
        const value = properties[property];
        comScoreParams[key] = value;
      }
    });

    comScoreParams.c1 = "2";
    comScoreParams.c2 = this.c2ID;
    /* if (this.options.comscorekw.length) {
      comScoreParams.comscorekw = this.options.comscorekw;
    } */
    logger.debug("=====in mapComscoreParams=====", comScoreParams);
    return comScoreParams;
  }

  isLoaded() {
    logger.debug("in Comscore isLoaded");
    if (!this.isFirstPageCallMade) {
      return true;
    }
    return !!window.COMSCORE;
  }

  isReady() {
    return !!window.COMSCORE;
  }
}

export { Comscore };
