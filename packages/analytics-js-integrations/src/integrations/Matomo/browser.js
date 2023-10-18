/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
// Research Spec: https://www.notion.so/rudderstacks/Matomo-c5a76c7838b94190a3374887b94a176e
import { logger } from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Matomo/constants';
import {
  goalIdMapping,
  ecommerceEventsMapping,
  standardEventsMapping,
  checkCustomDimensions,
} from './util';
import { getHashFromArrayWithDuplicate } from '../../utils/commonUtils';
import { loadNativeSdk } from './nativeSdkLoader';

class Matomo {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.serverUrl = config.serverUrl;
    this.siteId = config.siteId;
    this.eventsMapToGoalId = config.eventsMapToGoalId;
    this.eventsToStandard = config.eventsToStandard;
    this.name = NAME;
    this.trackAllContentImpressions = config.trackAllContentImpressions;
    this.trackVisibleContentImpressions = config.trackVisibleContentImpressions;
    this.checkOnScroll = config.checkOnScroll;
    this.timeIntervalInMs = config.timeIntervalInMs;
    this.logAllContentBlocksOnPage = config.logAllContentBlocksOnPage;
    this.enableHeartBeatTimer = config.enableHeartBeatTimer;
    this.activeTimeInseconds = config.activeTimeInseconds;
    this.enableLinkTracking = config.enableLinkTracking;
    this.disablePerformanceTracking = config.disablePerformanceTracking;
    this.enableCrossDomainLinking = config.enableCrossDomainLinking;
    this.setCrossDomainLinkingTimeout = config.setCrossDomainLinkingTimeout;
    this.timeout = config.timeout;
    this.getCrossDomainLinkingUrlParameter = config.getCrossDomainLinkingUrlParameter;
    this.disableBrowserFeatureDetection = config.disableBrowserFeatureDetection;
    this.matomoVersion = config.matomoVersion;
    this.premiseUrl = config.premiseUrl;

    this.ecomEvents = {
      SET_ECOMMERCE_VIEW: 'SET_ECOMMERCE_VIEW',
      ADD_ECOMMERCE_ITEM: 'ADD_ECOMMERCE_ITEM',
      REMOVE_ECOMMERCE_ITEM: 'REMOVE_ECOMMERCE_ITEM',
      TRACK_ECOMMERCE_ORDER: 'TRACK_ECOMMERCE_ORDER',
      CLEAR_ECOMMERCE_CART: 'CLEAR_ECOMMERCE_CART',
      TRACK_ECOMMERCE_CART_UPDATE: 'TRACK_ECOMMERCE_CART_UPDATE',
    };
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadScript() {
    loadNativeSdk(this.matomoVersion, this.premiseUrl, this.serverUrl, this.siteId);
  }

  init() {
    logger.debug('===In init Matomo===');
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded Matomo===');
    return !!(window._paq && window._paq.push !== Array.prototype.push);
  }

  pushValues(condition, values) {
    if (condition) {
      window._paq.push(values);
    }
  }

  isReady() {
    logger.debug('===In isReady Matomo===');

    // Dashboard Event Settings
    if (window._paq && window._paq.push !== Array.prototype.push) {
      // Scans the entire DOM for all content blocks and tracks all impressions once the DOM ready event has been triggered.
      this.pushValues(this.trackAllContentImpressions, ['trackAllContentImpressions']);

      // Scans the entire DOM for all content blocks when the page is loaded. Tracks an impression only if a content block is actually visible.
      this.pushValues(
        this.trackVisibleContentImpressions && this.checkOnScroll && this.timeIntervalInMs,
        ['trackVisibleContentImpressions', this.checkOnScroll, this.timeIntervalInMs],
      );

      // Logs all content blocks found within a page to the console.
      this.pushValues(this.logAllContentBlocksOnPage, ['logAllContentBlocksOnPage']);

      // Installs a heart beat timer to send additional requests to Matomo to measure the time spent in the visit.
      this.pushValues(this.enableHeartBeatTimer && this.activeTimeInseconds, [
        'enableHeartBeatTimer',
        this.activeTimeInseconds,
      ]);

      //  Installs link tracking on all applicable link elements.
      this.pushValues(this.enableLinkTracking, ['enableLinkTracking', true]);

      // Disables page performance tracking.
      this.pushValues(this.disablePerformanceTracking, ['disablePerformanceTracking']);

      // Enables cross domain linking. It is useful if you own multiple domains and would like to track all the actions and
      // page views of a specific visitor into the same visit.
      this.pushValues(this.enableCrossDomainLinking, ['enableCrossDomainLinking']);

      // Sets the cross domain linking timeout (in seconds).
      this.pushValues(this.setCrossDomainLinkingTimeout && this.timeout, [
        'setCrossDomainLinkingTimeout',
        this.timeout,
      ]);

      // Gets the query parameter to append to the links to handle cross domain linking.
      this.pushValues(this.getCrossDomainLinkingUrlParameter, [
        'getCrossDomainLinkingUrlParameter',
      ]);

      // Disables the browser feature detection.
      this.pushValues(this.disableBrowserFeatureDetection, ['disableBrowserFeatureDetection']);
    }
    return false;
  }

  identify(rudderElement) {
    logger.debug('===In Matomo Identify===');
    const { anonymousId, userId } = rudderElement.message;
    const matomoUserId = userId || anonymousId;
    if (!matomoUserId) {
      logger.error('User parameter (anonymousId or userId) is required for identify call');
      return;
    }
    window._paq.push(['setUserId', matomoUserId]);
  }

  track(rudderElement) {
    logger.debug('===In Matomo track===');

    const { message } = rudderElement;
    const { event } = message;
    const goalListMap = getHashFromArrayWithDuplicate(this.eventsMapToGoalId);
    const standardEventsMap = getHashFromArrayWithDuplicate(this.eventsToStandard);
    const ecommerceMapping = new Map([
      ['product viewed', this.ecomEvents.SET_ECOMMERCE_VIEW],
      ['product added', this.ecomEvents.ADD_ECOMMERCE_ITEM],
      ['product removed', this.ecomEvents.REMOVE_ECOMMERCE_ITEM],
      ['order completed', this.ecomEvents.TRACK_ECOMMERCE_ORDER],
      ['cart cleared', this.ecomEvents.CLEAR_ECOMMERCE_CART],
      ['update cart', this.ecomEvents.TRACK_ECOMMERCE_CART_UPDATE],
    ]);

    if (!event) {
      logger.error('Event name not present');
      return;
    }

    // Checks for custom dimensions in the payload, if present makes appropriate calls
    checkCustomDimensions(message);

    const trimmedEvent = event.toLowerCase().trim();

    // For every type of track calls we consider the trackGoal function.
    if (goalListMap[trimmedEvent]) {
      goalIdMapping(trimmedEvent, goalListMap, message);
    }

    // Mapping Standard Events
    if (standardEventsMap[trimmedEvent]) {
      standardEventsMapping(trimmedEvent, standardEventsMap, message);
    }

    // Mapping Ecommerce Events
    if (ecommerceMapping.has(trimmedEvent)) {
      ecommerceEventsMapping(ecommerceMapping.get(trimmedEvent), message);
    } else {
      ecommerceEventsMapping('trackEvent', message);
    }
  }

  page(rudderElement) {
    logger.debug('=== In Matomo Page ===');
    window._paq.push(['trackPageView']);
  }
}

export default Matomo;
