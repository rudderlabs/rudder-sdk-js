/* eslint-disable compat/compat */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import {
  MAX_WAIT_FOR_INTEGRATION_LOAD,
  INTEGRATION_LOAD_CHECK_INTERVAL,
} from '../../utils/constants';
import { NAME } from './constants';
import { loadNativeSdk } from './nativeSdkLoader';

class Comscore {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.c2ID = config.c2ID;
    this.analytics = analytics;
    this.comScoreBeaconParam = config.comScoreBeaconParam ? config.comScoreBeaconParam : {};
    this.isFirstPageCallMade = false;
    this.failed = false;
    this.comScoreParams = {};
    this.replayEvents = [];
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    logger.debug('===in init Comscore init===');
  }

  isLoaded() {
    logger.debug('in Comscore isLoaded');
    if (!this.isFirstPageCallMade) {
      return true;
    }
    return !!window.COMSCORE;
  }

  isReady() {
    return !!window.COMSCORE;
  }

  page(rudderElement) {
    logger.debug('in Comscore page');

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
        this.replayEvents.push(['page', rudderElement]);
        return;
      }
      window.COMSCORE.beacon(this.comScoreParams);
    }
  }

  loadConfig(rudderElement) {
    logger.debug('=====in loadConfig=====');
    this.comScoreParams = this.mapComscoreParams(rudderElement.message.properties);
    window._comscore = window._comscore || [];
    window._comscore.push(this.comScoreParams);
  }

  initAfterPage() {
    logger.debug('=====in initAfterPage=====');
    loadNativeSdk();

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
        resolve(instance);
      }
      if (time >= MAX_WAIT_FOR_INTEGRATION_LOAD) {
        this.failed = true;
        resolve(instance);
      }
      this.pause(INTEGRATION_LOAD_CHECK_INTERVAL).then(() =>
        this._isReady(instance, time + INTEGRATION_LOAD_CHECK_INTERVAL).then(resolve),
      );
    });
  }

  mapComscoreParams(properties) {
    logger.debug('=====in mapComscoreParams=====');
    const comScoreBeaconParamsMap = this.comScoreBeaconParam;

    const comScoreParams = {};

    Object.keys(comScoreBeaconParamsMap).forEach((property) => {
      if (property in properties) {
        const key = comScoreBeaconParamsMap[property];
        const value = properties[property];
        comScoreParams[key] = value;
      }
    });

    comScoreParams.c1 = '2';
    comScoreParams.c2 = this.c2ID;
    logger.debug('=====in mapComscoreParams=====', comScoreParams);
    return comScoreParams;
  }
}

export { Comscore };
