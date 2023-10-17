/* eslint-disable class-methods-use-this */
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/AdobeAnalytics/constants';
import Logger from '../../utils/logger';
import * as utils from './util';
import * as ecommUtils from './eCommHandle';
import * as heartbeatUtils from './heartbeatHandle';
import { getHashFromArray } from '../../utils/commonUtils';

const logger = new Logger(DISPLAY_NAME);

class AdobeAnalytics {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.trackingServerUrl = config.trackingServerUrl || '';
    this.reportSuiteIds = config.reportSuiteIds;
    this.heartbeatTrackingServerUrl = config.heartbeatTrackingServerUrl || '';
    this.eventsToTypes = config.eventsToTypes || [];
    this.marketingCloudOrgId = config.marketingCloudOrgId || '';
    this.dropVisitorId = config.dropVisitorId;
    this.trackingServerSecureUrl = config.trackingServerSecureUrl || '';
    this.timestampOption = config.timestampOption;
    this.preferVisitorId = config.preferVisitorId;
    this.rudderEventsToAdobeEvents = config.rudderEventsToAdobeEvents || [];
    this.proxyNormalUrl = config.proxyNormalUrl;
    this.proxyHeartbeatUrl = config.proxyHeartbeatUrl;
    this.pageName = '';
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
    utils.setConfig(config);
  }

  init() {
    // check if was already initialised. If yes then use already existing.
    window.s_account = window.s_account || this.reportSuiteIds;
    // update playhead value of a session
    window.rudderHBPlayheads = {};
    // load separately as heartbeat sdk is large and need not be required if this is off.
    const heartbeatUrl =
      this.proxyHeartbeatUrl ||
      'https://cdn.rudderlabs.com/adobe-analytics-js/adobe-analytics-js-heartbeat.js';
    const normalUrl =
      this.proxyNormalUrl || 'https://cdn.rudderlabs.com/adobe-analytics-js/adobe-analytics-js.js';
    if (this.heartbeatTrackingServerUrl) {
      ScriptLoader('adobe-analytics-heartbeat', heartbeatUrl);
      this.setIntervalHandler = setInterval(this.initAdobeAnalyticsClient.bind(this), 1000);
    } else {
      ScriptLoader('adobe-analytics-heartbeat', normalUrl);
      this.setIntervalHandler = setInterval(this.initAdobeAnalyticsClient.bind(this), 1000);
    }
  }

  initAdobeAnalyticsClient() {
    const { s, Visitor } = window;
    s.trackingServer = s.trackingServer || this.trackingServerUrl;
    s.trackingServerSecure = s.trackingServerSecure || this.trackingServerSecureUrl;
    if (this.marketingCloudOrgId && Visitor && typeof Visitor.getInstance === 'function') {
      s.visitor = Visitor.getInstance(this.marketingCloudOrgId, {
        trackingServer: s.trackingServer || this.trackingServerUrl,
        trackingServerSecure: s.trackingServerSecure || this.trackingServerSecureUrl,
      });
    }
  }

  isLoaded() {
    return !!(window.s_gi && window.s_gi !== Array.prototype.push);
  }

  isReady() {
    return this.isLoaded();
  }

  page(rudderElement) {
    // delete existing keys from widnow.s
    utils.clearWindowSKeys(utils.getDynamicKeys());
    // The pageName variable typically stores the name of a given page
    let name;
    if (rudderElement.message.name) {
      name = rudderElement.message.name;
    } else if (rudderElement.message.properties) {
      name = rudderElement.message.properties.name;
    }

    this.pageName = name ? `Viewed Page ${name}` : 'Viewed Page';

    window.s.pageName = this.pageName;

    // The referrer variable overrides the automatically collected referrer in reports.
    let referrer;
    let url;
    if (rudderElement.message.context && rudderElement.message.context.page) {
      referrer = rudderElement.message.context.page.referrer;
      url = rudderElement.message.context.page.url;
    } else if (rudderElement.message.properties) {
      referrer = rudderElement.message.properties.referrer;
      url = rudderElement.message.properties.url;
    }

    window.s.referrer = referrer;

    // if dropVisitorId is true visitorID will not be set
    /** Cross-device visitor identification uses the visitorID variable to associate a user across devices.
     *  The visitorID variable takes the highest priority when identifying unique visitors.
     * Visitor deduplication is not retroactive: */
    if (!this.dropVisitorId) {
      const { userId } = rudderElement.message;
      if (userId) {
        if (this.timestampOption === 'disabled') {
          window.s.visitorID = userId;
        }
        // If timestamp hybrid option and visitor id preferred is on visitorID is set
        if (this.timestampOption === 'hybrid' && this.preferVisitorId) {
          window.s.visitorID = userId;
        }
      }
    }
    // update values in window.s
    utils.updateWindowSKeys(this.pageName, 'events');
    utils.updateWindowSKeys(url, 'pageURL');
    utils.updateCommonWindowSKeys(rudderElement, this.pageName);

    utils.calculateTimestamp(rudderElement);

    utils.handleContextData(rudderElement);
    utils.handleEVars(rudderElement);
    utils.handleHier(rudderElement);
    utils.handleLists(rudderElement);
    utils.handleCustomProps(rudderElement);
    /** The t() method is an important core component to Adobe Analytics. It takes all Analytics variables defined on the page,
     *  compiles them into an image request, and sends that data to Adobe data collection servers.
     * */

    window.s.t();
  }

  track(rudderElement) {
    utils.clearWindowSKeys(utils.getDynamicKeys());
    const { event } = rudderElement.message;
    if (this.heartbeatTrackingServerUrl) {
      const eventsToTypesHashmap = getHashFromArray(this.eventsToTypes);
      const heartBeatFunction = eventsToTypesHashmap[event.toLowerCase()];
      // process mapped video events

      this.processHeartbeatMappedEvents(heartBeatFunction, rudderElement);
    }
    // process unmapped ecomm events
    const isProcessed = this.checkIfRudderEcommEvent(rudderElement);
    // process mapped events
    if (!isProcessed) {
      const rudderEventsToAdobeEventsHashmap = getHashFromArray(this.rudderEventsToAdobeEvents);
      if (rudderEventsToAdobeEventsHashmap[event.toLowerCase()]) {
        utils.processEvent(
          rudderElement,
          rudderEventsToAdobeEventsHashmap[event.toLowerCase()].trim(),
          this.pageName,
        );
      }
    }
  }

  /**
   * @param  {} rudderElement
   * @description Checks if the incoming rudder event is an Ecomm Event. Return true or false accordingly.
   * DOC: https://docs.rudderstack.com/rudderstack-api-spec/rudderstack-ecommerce-events-specification
   * @returns ret
   */

  checkIfRudderEcommEvent(rudderElement) {
    const { event } = rudderElement.message;
    let ret = true;
    switch (event.toLowerCase()) {
      case 'product viewed':
      case 'product list viewed':
        ecommUtils.productViewHandle(rudderElement, this.pageName);
        break;
      case 'product added':
        ecommUtils.productAddedHandle(rudderElement, this.pageName);
        break;
      case 'product removed':
        ecommUtils.productRemovedHandle(rudderElement, this.pageName);
        break;
      case 'order completed':
        ecommUtils.orderCompletedHandle(rudderElement, this.pageName);
        break;
      case 'cart viewed':
        ecommUtils.cartViewedHandle(rudderElement, this.pageName);
        break;
      case 'checkout started':
        ecommUtils.checkoutStartedHandle(rudderElement, this.pageName);
        break;
      case 'cart opened':
      case 'opened cart':
        ecommUtils.cartOpenedHandle(rudderElement, this.pageName);
        break;
      default:
        ret = false;
    }
    return ret;
  }

  /**
   * @param  {} heartBeatFunction
   * @param  {} rudderElement
   *
   * @description Function to process mapped video events in webapp with adobe video events.
   */

  processHeartbeatMappedEvents(heartBeatFunction, rudderElement) {
    if (heartBeatFunction) {
      switch (heartBeatFunction) {
        case 'initHeartbeat':
          heartbeatUtils.initHeartbeat(rudderElement);
          break;
        case 'heartbeatPlaybackStarted':
        case 'heartbeatPlaybackResumed':
        case 'heartbeatContentStarted':
        case 'heartbeatVideoStart':
          heartbeatUtils.heartbeatVideoStart(rudderElement);
          break;
        case 'heartbeatPlaybackPaused':
        case 'heartbeatPlaybackInterrupted':
        case 'heartbeatVideoPaused':
          heartbeatUtils.heartbeatVideoPaused(rudderElement);
          break;
        case 'heartbeatContentComplete':
        case 'heartbeatVideoComplete':
          heartbeatUtils.heartbeatVideoComplete(rudderElement);
          break;
        case 'heartbeatSessionEnd':
        case 'heartbeatPlaybackCompleted':
          heartbeatUtils.heartbeatSessionEnd(rudderElement);
          break;
        case 'heartbeatAdStarted':
        case 'heartbeatAdBreakStarted':
          heartbeatUtils.heartbeatAdStarted(rudderElement);
          break;
        case 'heartbeatAdCompleted':
        case 'heartbeatAdBreakCompleted':
          heartbeatUtils.heartbeatAdCompleted(rudderElement);
          break;
        case 'heartbeatAdSkipped':
          heartbeatUtils.heartbeatAdSkipped(rudderElement);
          break;
        case 'heartbeatSeekStarted':
          heartbeatUtils.heartbeatSeekStarted(rudderElement);
          break;
        case 'heartbeatSeekCompleted':
          heartbeatUtils.heartbeatSeekCompleted(rudderElement);
          break;
        case 'heartbeatBufferStarted':
          heartbeatUtils.heartbeatBufferStarted(rudderElement);
          break;
        case 'heartbeatBufferCompleted':
          heartbeatUtils.heartbeatBufferCompleted(rudderElement);
          break;
        case 'heartbeatQualityUpdated':
          heartbeatUtils.heartbeatQualityUpdated(rudderElement);
          break;
        case 'heartbeatUpdatePlayhead':
          heartbeatUtils.heartbeatUpdatePlayhead(rudderElement);
          break;
        default:
          logger.error('No heartbeat function for this event');
      }
    }
  }
}

export default AdobeAnalytics;
