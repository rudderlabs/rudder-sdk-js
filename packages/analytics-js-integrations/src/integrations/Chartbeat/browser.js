/* eslint-disable compat/compat */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import onBody from 'on-body';
import {
  MAX_WAIT_FOR_INTEGRATION_LOAD,
  INTEGRATION_LOAD_CHECK_INTERVAL,
} from '@rudderstack/analytics-js-legacy-utilities/constants';
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class Chartbeat {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics; // use this to modify failed integrations or for passing events from callback to other destinations
    window._sf_async_config = window._sf_async_config || {};
    window._sf_async_config.useCanonical = true;
    window._sf_async_config.uid = config.uid;
    window._sf_async_config.domain = config.domain;
    this._sf_async_config = window._sf_async_config;
    this.isVideo = !!config.video;
    this.sendNameAndCategoryAsTitle = config.sendNameAndCategoryAsTitle || true;
    this.subscriberEngagementKeys = config.subscriberEngagementKeys || [];
    this.replayEvents = [];
    this.failed = false;
    this.isFirstPageCallMade = false;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {}

  isLoaded() {
    if (!this.isFirstPageCallMade) {
      return true;
    }
    return !!window.pSUPERFLY;
  }

  isFailed() {
    return this.failed;
  }

  isReady() {
    return !!window.pSUPERFLY;
  }

  page(rudderElement) {
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
      const { properties } = rudderElement.message;
      window.pSUPERFLY.virtualPage(properties.path);
    }
  }

  loadConfig(rudderElement) {
    const { properties } = rudderElement.message;
    const category = properties ? properties.category : undefined;
    const { name } = rudderElement.message;
    const author = properties ? properties.author : undefined;
    let title;
    if (this.sendNameAndCategoryAsTitle) {
      title = category && name ? `${category} ${name}` : name;
    }
    if (category) window._sf_async_config.sections = category;
    if (author) window._sf_async_config.authors = author;
    if (title) window._sf_async_config.title = title;

    window._cbq = window._cbq || [];
    const { _cbq: cbq } = window;

    Object.keys(properties)
      .filter(
        key =>
          Object.prototype.hasOwnProperty.call(properties, key) &&
          this.subscriberEngagementKeys.includes(key),
      )
      .forEach(key => {
        cbq.push([key, properties[key]]);
      });
  }

  initAfterPage() {
    onBody(() => {
      const script = this.isVideo ? 'chartbeat_video.js' : 'chartbeat.js';
      loadNativeSdk(script);
    });

    this._isReady(this).then(instance => {
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
}

export default Chartbeat;
