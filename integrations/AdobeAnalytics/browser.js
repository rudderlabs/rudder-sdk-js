/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import each from "@ndhoule/each";
import { toIso, getHashFromArray, getDataFromContext } from "./util";
import ScriptLoader from "../ScriptLoader";
import logger from "../../utils/logUtil";
import _ from "lodash";

const dynamicKeys = [];

class AdobeAnalytics {
  constructor(config) {
    this.trackingServerUrl = config.trackingServerUrl || "";
    this.reportSuiteIds = config.reportSuiteIds;
    this.sslHeartbeat = config.sslHeartbeat;
    this.heartbeatTrackingServerUrl = config.heartbeatTrackingServerUrl || "";
    this.eventsToTypes = config.eventsToTypes || [];
    this.marketingCloudOrgId = config.marketingCloudOrgId || "";
    this.dropVisitorId = config.dropVisitorId;
    this.trackingServerSecureUrl = config.trackingServerSecureUrl || "";
    this.timestampOption = config.timestampOption;
    this.preferVisitorId = config.preferVisitorId;
    this.rudderEventsToAdobeEvents = config.rudderEventsToAdobeEvents || [];
    this.trackPageName = config.trackPageName;
    this.contextDataMapping = config.contextDataMapping || [];
    this.eVarMapping = config.eVarMapping || [];
    this.hierMapping = config.hierMapping || [];
    this.listMapping = config.listMapping || [];
    this.listDelimiter = config.listDelimiter || [];
    this.customPropsMapping = config.customPropsMapping || [];
    this.propsDelimiter = config.propsDelimiter || [];
    this.eventMerchEventToAdobeEvent = config.eventMerchEventToAdobeEvent || [];
    this.eventMerchProperties = config.eventMerchProperties || [];
    this.productMerchEventToAdobeEvent =
      config.productMerchEventToAdobeEvent || [];
    this.productMerchProperties = config.productMerchProperties || [];
    this.productMerchEvarsMap = config.productMerchEvarsMap || [];
    this.productIdentifier = config.productIdentifier;
    this.contextDataPrefix = config.contextDataPrefix || []; // to be added
    this.pageName = "";
    this.name = "ADOBE_ANALYTICS";
  }

  init() {
    // check if was already initialised. If yes then use already existing.
    window.s_account = window.s_account || this.reportSuiteIds;
    // update playhead value of a session
    window.rudderHBPlayheads = {};
    // load separately as heartbeat sdk is large and need not be required if this is off.
    if (this.heartbeatTrackingServerUrl) {
      ScriptLoader(
        "adobe-analytics-heartbeat",
        "https://cdn.rudderlabs.com/adobe-analytics-js/adobe-analytics-js-heartbeat.js"
      );
      this.setIntervalHandler = setInterval(
        this.initAdobeAnalyticsClient.bind(this),
        1000
      );
      // for heartbeat
      this.playhead = 0;
      this.qosData = {};
      this.adBreakCounts = {};
      this.mediaHeartbeats = {};
      this.adBreakProgress = false;
    } else {
      ScriptLoader(
        "adobe-analytics-heartbeat",
        "https://cdn.rudderlabs.com/adobe-analytics-js/adobe-analytics-js.js"
      );
      this.setIntervalHandler = setInterval(
        this.initAdobeAnalyticsClient.bind(this),
        1000
      );
    }
  }

  initAdobeAnalyticsClient() {
    const { s } = window;
    s.trackingServer = s.trackingServer || this.trackingServerUrl;
    s.trackingServerSecure =
      s.trackingServerSecure || this.trackingServerSecureUrl;
    if (
      this.marketingCloudOrgId &&
      window.Visitor &&
      typeof window.Visitor.getInstance === "function"
    ) {
      s.visitor = window.Visitor.getInstance(this.marketingCloudOrgId, {
        trackingServer: window.s.trackingServer || this.trackingServerUrl,
        trackingServerSecure:
          window.s.trackingServerSecure || this.trackingServerSecureUrl,
      });
    }
  }

  isLoaded() {
    logger.debug("in AdobeAnalytics isLoaded");
    return !!(window.s_gi && window.s_gi !== Array.prototype.push);
  }

  isReady() {
    logger.debug("in AdobeAnalytics isReady");
    return !!(window.s_gi && window.s_gi !== Array.prototype.push);
  }

  page(rudderElement) {
    // delete existing keys from widnow.s
    this.clearWindowSKeys(dynamicKeys);

    // The pageName variable typically stores the name of a given page
    let name;
    if (rudderElement.message.name) {
      name = rudderElement.message.name;
    } else if (rudderElement.message.properties) {
      name = rudderElement.message.properties.name;
    }

    this.pageName = name ? `Viewed Page ${name}` : "Viewed Page";

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
        if (this.timestampOption === "disabled") {
          window.s.visitorID = userId;
        }
        // If timestamp hybrid option and visitor id preferred is on visitorID is set
        if (this.timestampHybridOption === "hybrid" && this.preferVisitorId) {
          window.s.visitorID = userId;
        }
      }
    }
    // update values in window.s
    this.updateWindowSKeys(this.pageName, "events");
    this.updateWindowSKeys(url, "pageURL");
    this.updateCommonWindowSKeys(rudderElement);

    this.calculateTimestamp(rudderElement);

    // TODO: Mapping variables
    this.handleContextData(rudderElement);
    this.handleEVars(rudderElement);
    this.handleHier(rudderElement);
    this.handleLists(rudderElement);
    this.handleCustomProps(rudderElement);
    /** The t() method is an important core component to Adobe Analytics. It takes all Analytics variables defined on the page,
     *  compiles them into an image request, and sends that data to Adobe data collection servers.
     * */

    window.s.t();
  }

  track(rudderElement) {
    this.clearWindowSKeys(dynamicKeys);
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
      const rudderEventsToAdobeEventsHashmap = getHashFromArray(
        this.rudderEventsToAdobeEvents
      );
      if (rudderEventsToAdobeEventsHashmap[event.toLowerCase()]) {
        this.processEvent(
          rudderElement,
          rudderEventsToAdobeEventsHashmap[event.toLowerCase()].trim()
        );
      }
    }
  }
  // Handling Video Type Events
  // DOC: https://experienceleague.adobe.com/docs/media-analytics/using/sdk-implement/setup/setup-javascript/set-up-js-2.html?lang=en
  // DOC: https://experienceleague.adobe.com/docs/media-analytics/using/sdk-implement/track-av-playback/track-core-overview.html?lang=en

  initHeartbeat(rudderElement) {
    const that = this;
    const { va } = window.ADB;
    const { message } = rudderElement;
    const { properties, context } = message;
    const { channel, video_player, session_id } = properties;

    const mediaHeartbeatConfig = new va.MediaHeartbeatConfig();
    const mediaHeartbeatDelegate = new va.MediaHeartbeatDelegate();

    mediaHeartbeatConfig.trackingServer = this.heartbeatTrackingServerUrl;
    mediaHeartbeatConfig.channel = channel || "";
    mediaHeartbeatConfig.ovp = "unknown";
    mediaHeartbeatConfig.appVersion = context.app.version || "unknown";
    mediaHeartbeatConfig.playerName = video_player || "unknown";
    mediaHeartbeatConfig.ssl = this.sslHeartbeat;
    mediaHeartbeatConfig.debugLogging = !!window._enableHeartbeatDebugLogging;

    mediaHeartbeatDelegate.getCurrentPlaybackTime = () => {
      let playhead = that.playhead || 0;
      const sessions = window.rudderHBPlayheads || {};
      playhead = sessions[session_id] ? sessions[session_id] : playhead;
      return playhead;
    };

    mediaHeartbeatDelegate.getQoSObject = () => {
      return that.qosData;
    };

    this.mediaHeartbeats[session_id || "default"] = {
      hearbeat: new va.MediaHeartbeat(
        mediaHeartbeatDelegate,
        mediaHeartbeatConfig,
        window.s
      ),
      delegate: mediaHeartbeatDelegate,
      config: mediaHeartbeatConfig,
    };
    this.createQos(rudderElement);
    this.hearbeatSessionStart(rudderElement);
  }

  hearbeatSessionStart(rudderElement) {
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { livestream, title, asset_id, total_length, session_id } =
      properties;
    const streamType = livestream
      ? va.MediaHeartbeat.StreamType.LIVE
      : va.MediaHeartbeat.StreamType.VOD;
    const mediaObj = va.MediaHeartbeat.createMediaObject(
      title || "",
      asset_id || "unknown video id",
      total_length || 0,
      streamType
    );
    const contextData = this.handleContextData(rudderElement);
    this.standardVideoMetadata(rudderElement, mediaObj);

    this.mediaHeartbeats[session_id || "default"].hearbeat.trackSessionStart(
      mediaObj,
      contextData
    );
  }

  heartbeatVideoStart(rudderElement) {
    this.populatHeartbeat(rudderElement);
    const { properties } = rudderElement.message;
    const { va } = window.ADB;
    const { session_id, chapter_name, position, length, start_time } =
      properties;

    this.mediaHeartbeats[session_id || "default"].hearbeat.trackPlay();
    const contextData = this.handleContextData(rudderElement);

    if (!this.mediaHeartbeats[session_id || "default"].chapterInProgress) {
      const chapterObj = va.MediaHeartbeat.createChapterObject(
        chapter_name || "no chapter name",
        position || 1,
        length || 6000,
        start_time || 0
      );
      this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
        va.MediaHeartbeat.Event.ChapterStart,
        chapterObj,
        contextData
      );
      this.mediaHeartbeats[session_id || "default"].chapterInProgress = true;
    }
  }

  heartbeatVideoPaused(rudderElement) {
    this.populatHeartbeat(rudderElement);
    const { properties } = rudderElement.message;
    this.mediaHeartbeats[
      properties.session_id || "default"
    ].hearbeat.trackPause();
  }

  heartbeatVideoComplete(rudderElement) {
    this.populatHeartbeat(rudderElement);
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    this.mediaHeartbeats[properties.session_id || "defualt"].trackEvent(
      va.MediaHeartbeat.Event.ChapterComplete
    );
    this.mediaHeartbeats[
      properties.session_id || "default"
    ].chapterInProgress = false;
  }

  heartbeatSessionEnd(rudderElement) {
    this.populatHeartbeat(rudderElement);
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackComplete();
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackSessionEnd();

    delete this.mediaHeartbeats[session_id || "default"];
    delete this.adBreakCounts[session_id || "default"];
  }

  heartbeatAdStarted(rudderElement) {
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const {
      session_id,
      type,
      position,
      title,
      asset_id,
      total_length,
      content,
    } = properties;
    let adSessionCount = this.adBreakCounts[session_id || "deafult"];
    adSessionCount = adSessionCount
      ? this.adBreakCounts[session_id || "default"] + 1
      : (this.adBreakCounts[session_id || "default"] = 1);
    const adBreakObj = va.MediaHeartbeat.createAdBreakObject(
      type || "unknown",
      adSessionCount,
      position || 1
    );
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.AdBreakStart,
      adBreakObj
    );
    this.adBreakProgress = true;

    const adObject = va.MediaHeartbeat.createAdObject(
      title || "no title",
      asset_id.toString() || "default ad",
      position || 1,
      total_length || 0
    );
    this.standardVideoMetadata(rudderElement);
    this.mediaHeartbeats[session_id || "deafult"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.AdStart,
      adObject,
      content || {}
    );
  }

  heartbeatAdCompleted(rudderElement) {
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    if (!this.adBreakProgress) {
      this.heartbeatAdStarted(rudderElement);
    }
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.AdComplete
    );
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.AdBreakComplete
    );
    this.adBreakProgress = false;
  }

  heartbeatAdSkipped(rudderElement) {
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    if (!this.adBreakProgress) {
      this.heartbeatAdStarted(rudderElement);
    }
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.AdSkip
    );
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.AdBreakComplete
    );
    this.adBreakProgress = false;
  }

  heartbeatSeekStarted(rudderElement) {
    this.populatHeartbeat(rudderElement);
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.SeekStart
    );
  }

  heartbeatSeekCompleted(rudderElement) {
    this.populatHeartbeat(rudderElement);
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.SeekComplete
    );
  }

  heartbeatBufferStarted(rudderElement) {
    this.populatHeartbeat(rudderElement);
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.BufferStart
    );
  }

  heartbeatQualityUpdated(rudderElement) {
    this.createQos(rudderElement);
  }

  heartbeatUpdatePlayhead(rudderElement) {
    this.playhead = rudderElement.message.properties
      ? rudderElement.message.properties.position
      : null;
  }

  heartbeatBufferCompleted(rudderElement) {
    this.populatHeartbeat(rudderElement);
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.BufferComplete
    );
  }
  // End of Handling Video Type Events

  // Handling Ecomm Events

  productViewHandle(rudderElement) {
    this.clearWindowSKeys(dynamicKeys);
    this.processEvent(rudderElement, "prodView");
  }

  productAddedHandle(rudderElement) {
    this.clearWindowSKeys(dynamicKeys);
    this.processEvent(rudderElement, "scAdd");
  }

  productRemovedHandle(rudderElement) {
    this.clearWindowSKeys(dynamicKeys);
    this.processEvent(rudderElement, "scRemove");
  }

  orderCompletedHandle(rudderElement) {
    this.clearWindowSKeys(dynamicKeys);
    const { properties } = rudderElement.message;
    const { purchaseId, transactionId, order_id } = properties;
    this.updateWindowSKeys(purchaseId || order_id, "purchaseID");
    this.updateWindowSKeys(transactionId || order_id, "transactionID");

    this.processEvent(rudderElement, "purchase");
  }

  cartViewedHandle(rudderElement) {
    this.clearWindowSKeys(dynamicKeys);
    this.processEvent(rudderElement, "scView");
  }

  cartOpenedHandle(rudderElement) {
    this.clearWindowSKeys(dynamicKeys);
    this.processEvent(rudderElement, "scOpen");
  }
  // End of handling Ecomm Events

  // Custom functions

  /**
   * @param  {} rudderElement
   * @param  {} adobeEventName
   *
   * Update window variables and do adobe track calls
   */
  processEvent(rudderElement, adobeEventName) {
    const { properties, event } = rudderElement.message;
    const { currency } = properties;

    this.updateCommonWindowSKeys(rudderElement);
    this.calculateTimestamp(rudderElement);
    // useful for setting evar as amount value if this is set
    if (currency !== "USD") {
      this.updateWindowSKeys(currency, "currencyCode");
    }
    this.setEventsString(event, properties, adobeEventName);
    this.setProductString(event, properties);

    this.handleContextData(rudderElement);
    this.handleEVars(rudderElement);
    this.handleHier(rudderElement);
    this.handleLists(rudderElement);
    this.handleCustomProps(rudderElement);

    /**
     * The s.linkTrackVars variable is a string containing a comma-delimited list of variables that you want to
     * include in link tracking image requests
     */

    window.s.linkTrackVars = dynamicKeys.join(",");

    /**
     * The tl() method is an important core component to Adobe Analytics.
     * It takes all Analytics variables defined on the page, compiles them into an image request,
     * and sends that data to Adobe data collection servers. It works similarly to the t() method,
     * however this method does not increment page views.
     * It is useful for tracking links and other elements that wouldn’t be considered a full page load.
     */
    window.s.tl(true, "o", event);
  }

  /**
   *
   * @param {} rudderElement
   * Quality of experience tracking includes quality of service (QoS) and error tracking, both are optional elements
   *  and are not required for core media tracking implementations.
   *
   * DOC: https://experienceleague.adobe.com/docs/media-analytics/using/sdk-implement/track-qos/track-qos-overview.html?lang=en
   * DOC: https://experienceleague.adobe.com/docs/media-analytics/using/sdk-implement/track-qos/track-qos-js/track-qos-js.html?lang=en
   */

  createQos(rudderElement) {
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { bitrate, startupTime, fps, droppedFrames } = properties;

    this.qosData = va.MediaHeartbeat.createQoSObject(
      bitrate || 0,
      startupTime || 0,
      fps || 0,
      droppedFrames || 0
    );
  }

  // Begin heartbeat implementation

  populatHeartbeat(rudderElement) {
    const { properties } = rudderElement.message;
    const { session_id, channel, video_player } = properties;
    const mediaHeartbeat = this.mediaHeartbeats[session_id || "default"];

    if (!mediaHeartbeat) {
      this.initHeartbeat(rudderElement);
    } else {
      const mediaHeartbeatConfig = mediaHeartbeat.config;
      mediaHeartbeatConfig.channel = channel || mediaHeartbeatConfig.channel;
      mediaHeartbeatConfig.playerName =
        video_player || mediaHeartbeatConfig.playerName;
    }
  }

  /**
   *
   * @param {*} rudderElement
   * @param {*} mediaObj
   *
   * DOC: https://experienceleague.adobe.com/docs/media-analytics/using/sdk-implement/track-ads/impl-std-ad-metadata/impl-std-ad-md-js/impl-std-ad-metadata-js.html?lang=en
   */

  standardVideoMetadata(rudderElement, mediaObj) {
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const metaKeys = va.MediaHeartbeat.VideoMetadataKeys;
    const {
      SHOW,
      SEASON,
      EPISODE,
      ASSET_ID,
      GENRE,
      FIRST_AIR_DATE,
      ORIGINATOR,
      NETWORK,
      RATING,
    } = metaKeys;
    const stdVidMeta = {};
    const rudderAdbMap = {
      program: SHOW,
      season: SEASON,
      episode: EPISODE,
      assetId: ASSET_ID,
      contentAssetId: ASSET_ID,
      genre: GENRE,
      airdate: FIRST_AIR_DATE,
      publisher: ORIGINATOR,
      channel: NETWORK,
      rating: RATING,
    };

    Object.keys(rudderAdbMap).forEach((value) => {
      stdVidMeta[rudderAdbMap[value]] =
        properties[value] || `no ${rudderAdbMap[value]}`;
    });

    mediaObj.setValue(
      va.MediaHeartbeat.MediaObjectKey.StandardVideoMetadata,
      stdVidMeta
    );
  }

  // clear the previously set keys for adobe analytics

  clearWindowSKeys(presentKeys) {
    each((keys) => {
      delete window.s[keys];
    }, presentKeys);
    presentKeys.length = 0;
  }

  // update window keys for adobe analytics

  updateWindowSKeys(value, key) {
    if (key && value !== undefined && value !== null && value !== "") {
      dynamicKeys.push(key);
      window.s[key] = value;
    }
  }

  // update all the keys for adobe analytics which are common for all calls.

  updateCommonWindowSKeys(rudderElement) {
    const { properties, type, context } = rudderElement.message;
    let campaign;
    if (context && context.campaign) {
      campaign = context.campaign.name;
    } else {
      campaign = properties.campaign;
    }
    const channel = rudderElement.message.channel || properties.channel;
    const { state, zip } = properties;

    this.updateWindowSKeys(channel, "channel");
    this.updateWindowSKeys(campaign, "campaign");
    this.updateWindowSKeys(state, "state");
    this.updateWindowSKeys(zip, "zip");
    const name = context.page ? context.page.name : undefined;

    if (this.trackPageName && type === "track") {
      this.updateWindowSKeys(
        properties.pageName || this.pageName || name,
        "pageName"
      );
    }
  }
  // TODO: Need to check why timestamp not setting
  // DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/timestamp.html?lang=en

  calculateTimestamp(rudderElement) {
    const { properties, originalTimestamp, timestamp } = rudderElement.message;
    let timestampVal =
      originalTimestamp ||
      timestamp ||
      properties.originalTimestamp ||
      properties.timestamp;
    // The s.timestamp variable is a string containing the date and time of the hit. Valid timestamp formats include ISO 8601 and Unix time.
    if (timestampVal) {
      if (typeof timestampVal !== "string") {
        timestampVal = toIso(timestampVal);
      }
      if (
        (this.timestampOption === "hybrid" && !this.preferVisitorId) ||
        this.timestampOption === "enabled"
      ) {
        this.updateWindowSKeys(timestampVal, "timestamp");
      }
    }
  }

  /**
   * @param  {} rudderElement
   * Context data variables let you define custom variables on each page that processing rules can read.
   * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/contextdata.html?lang=en
   */

  handleContextData(rudderElement) {
    window.s.contextData = {};
    const { properties } = rudderElement.message;
    const contextDataPrefixValue = this.contextDataPrefix
      ? `${this.contextDataPrefix}.`
      : "";
    if (properties) {
      each((value, key) => {
        this.setContextData(contextDataPrefixValue + key, value);
      }, properties);
    }

    const contextDataMappingHashmap = getHashFromArray(this.contextDataMapping);
    const keyValueContextData = getDataFromContext(
      contextDataMappingHashmap,
      rudderElement
    );
    if (keyValueContextData) {
      each((value, key) => {
        if (!key && value !== undefined && value !== null && value !== "") {
          this.setContextData(key, value);
        }
      }, keyValueContextData);
    }
  }

  /**
   * @param  {} contextDataKey
   * @param  {} contextDataValue
   * Context data variables let you define custom variables on each page that processing rules can read.
   * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/contextdata.html?lang=en
   */

  setContextData(contextDataKey, contextDataValue) {
    window.s.contextData[contextDataKey] = contextDataValue;
    dynamicKeys.push(`contextData.${contextDataKey}`);
  }
  /**
   * @param  {} rudderElement
   * eVars are custom variables that you can use however you’d like.
   * Updates eVar variable of window.s
   * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/evar.html?lang=en
   */

  handleEVars(rudderElement) {
    const { properties } = rudderElement.message;
    const eVarMappingHashmap = getHashFromArray(this.eVarMapping);
    const eVarHashmapMod = {};
    Object.keys(eVarMappingHashmap).forEach((value) => {
      eVarHashmapMod[value] = `eVar${eVarMappingHashmap[value]}`;
    });
    if (eVarHashmapMod) {
      each((value, key) => {
        if (eVarHashmapMod[key]) {
          this.updateWindowSKeys(value.toString(), eVarHashmapMod[key]);
        }
      }, properties);
    }
  }
  /**
   * @param  {} rudderElement
   * Hierarchy variables are custom variables that let you see a site’s structure.
   * Updates hier varaible of window.s
   *
   * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/hier.html?lang=en
   */

  handleHier(rudderElement) {
    const { properties } = rudderElement.message;
    const hierMappingHashmap = getHashFromArray(this.hierMapping);
    const hierHashmapMod = {};
    Object.keys(hierMappingHashmap).forEach((value) => {
      hierHashmapMod[value] = `hier${hierMappingHashmap[value]}`;
    });
    if (hierHashmapMod) {
      each((value, key) => {
        if (hierHashmapMod[key]) {
          this.updateWindowSKeys(value.toString(), hierHashmapMod[key]);
        }
      }, properties);
    }
  }

  /**
   * @param  {} rudderElement
   * List variables are custom variables that you can use however you’d like.
   * They work similarly to eVars, except they can contain multiple values in the same hit.
   *
   * If there are many values to be appended in a particular list it will be separated by
   * the delimiter set.
   *
   * Sets list variable of window.s
   * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/list.html?lang=en
   */

  handleLists(rudderElement) {
    const { properties } = rudderElement.message;
    const listMappingHashmap = getHashFromArray(this.listMapping);
    const listDelimiterHashmap = getHashFromArray(this.listDelimiter);
    if (properties) {
      each((value, key) => {
        if (listMappingHashmap[key] && listDelimiterHashmap[key]) {
          if (typeof value !== "string" && !Array.isArray(value)) {
            logger.error("list variable is neither a string nor an array");
            return;
          }
          const delimiter = listDelimiterHashmap[key];
          const listValue = `list${listMappingHashmap[key]}`;
          if (typeof value === "string") {
            value = value.replace(/\s*,+\s*/g, delimiter);
          } else {
            value = value.join(delimiter);
          }
          this.updateWindowSKeys(value.toString(), listValue);
        }
      }, properties);
    }
  }

  /**
   * @param  {} rudderElement
   * @description Props are custom variables that you can use however you’d like.
   * They do not persist beyond the hit that they are set.
   * prop variable of window.s is updated
   * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/prop.html?lang=en
   */

  handleCustomProps(rudderElement) {
    const { properties } = rudderElement.message;
    const customPropsMappingHashmap = getHashFromArray(this.customPropsMapping);
    const propsDelimiterHashmap = getHashFromArray(this.propsDelimiter);
    if (properties) {
      each((value, key) => {
        if (customPropsMappingHashmap[key]) {
          if (typeof value !== "string" && !Array.isArray(value)) {
            logger.error("list variable is neither a string nor an array");
            return;
          }
          const delimiter = propsDelimiterHashmap[key]
            ? propsDelimiterHashmap[key]
            : "|";
          const propValue = `prop${customPropsMappingHashmap[key]}`;
          if (typeof value === "string") {
            value = value.replace(/\s*,+\s*/g, delimiter);
          } else {
            value = value.join(delimiter);
          }
          this.updateWindowSKeys(value.toString(), propValue);
        }
      }, properties);
    }
  }

  /**
   * @param  {} event
   * @param  {} properties
   * @description Function to set event string of Ecomm events
   * Updates the "events" property of window.s
   */

  setEventsString(event, properties, adobeEventName) {
    // adobe events are taken as comma separated string
    let adobeEventArray = adobeEventName ? adobeEventName.split(",") : [];

    const merchMap = this.mapMerchEvents(event, properties);
    adobeEventArray = adobeEventArray.concat(merchMap);
    adobeEventArray = adobeEventArray.filter((item) => {
      return !!item;
    });
    const adobeEvent = adobeEventArray.join(",");
    this.updateWindowSKeys(adobeEvent, "events");

    /**
     * The s.linkTrackEvents variable is a string containing a comma-delimited list of
     *  events that you want to include in link tracking image requests
     */
    window.s.linkTrackEvents = adobeEvent;
  }

  mapMerchEvents(event, properties) {
    const eventMerchEventToAdobeEventHashmap = getHashFromArray(
      this.eventMerchEventToAdobeEvent
    );

    let merchMap = [];
    if (
      !eventMerchEventToAdobeEventHashmap[event.toLowerCase()] ||
      !this.eventMerchProperties
    ) {
      return merchMap;
    }
    const adobeEvent =
      eventMerchEventToAdobeEventHashmap[event.toLowerCase()].split(",");

    let eventString;
    each((rudderProp) => {
      if (rudderProp.eventMerchProperties in properties) {
        each((value) => {
          if (properties[rudderProp.eventMerchProperties])
            eventString = `${value}=${
              properties[rudderProp.eventMerchProperties]
            }`;
          merchMap.push(eventString);
        }, adobeEvent);
      } else {
        merchMap = merchMap.concat(adobeEvent);
      }
    }, this.eventMerchProperties);
    return merchMap;
  }

  /**
   * @param  {} event
   * @param  {} properties
   * @description Function to set product string for product level of Ecomm events
   */

  setProductString(event, properties) {
    const productMerchEventToAdobeEventHashmap = getHashFromArray(
      this.productMerchEventToAdobeEvent
    );

    const adobeEvent =
      productMerchEventToAdobeEventHashmap[event.toLowerCase()];
    if (adobeEvent) {
      const isSingleProdEvent =
        adobeEvent === "scAdd" ||
        adobeEvent === "scRemove" ||
        (adobeEvent === "prodView" &&
          event.toLowerCase() !== "product list viewed") ||
        !Array.isArray(properties.products);
      const prodFields = isSingleProdEvent ? [properties] : properties.products;
      this.mapProducts(event, prodFields, adobeEvent);
    }
  }

  /**
   * @param  {} event
   * @param  {} prodFields
   * @param  {} adobeEvent
   * @description set products key for window.s
   * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/products.html?lang=en
   */

  mapProducts(event, prodFields, adobeEvent) {
    const prodString = [];
    prodFields.forEach((value) => {
      const category = value.category || "";
      const quantity = value.quantity || 1;
      const total = value.price ? (value.price * quantity).toFixed(2) : 0;
      let item;
      if (this.productIdentifier === "id") {
        item = value.product_id || value.id;
      } else {
        item = value[this.productIdentifier];
      }
      const eventString = this.mapMerchProductEvents(
        event,
        value,
        adobeEvent
      ).join("|");
      const prodEVarsString = this.mapMerchProductEVars(value);
      if (eventString !== "" || prodEVarsString !== "") {
        const test = [
          category,
          item,
          quantity,
          total,
          eventString,
          prodEVarsString,
        ].map((val) => {
          if (val == null) {
            return String(val);
          }
          return val;
        });
        prodString.push(test.join(";"));
      } else {
        const test = [category, item, quantity, total]
          .map((val) => {
            if (val === null) {
              return String(val);
            }
            return val;
          })
          .join(";");
        prodString.push(test);
      }
    });
    this.updateWindowSKeys(prodString, "products");
  }

  /**
   * @param  {} event
   * @param  {} properties
   * @param  {} adobeEvent
   * @description Creates the merchendising product eventsString for each product which will be added to the
   * key products along with the evars as set.
   * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/products.html?lang=en
   * @returns [] merchMap
   */

  mapMerchProductEvents(event, properties, adobeEvent) {
    const productMerchEventToAdobeEventHashmap = getHashFromArray(
      this.productMerchEventToAdobeEvent
    );
    // converting string to array if more than 1 event is there.
    adobeEvent = adobeEvent.split(",");
    const merchMap = [];
    let eventString;
    if (
      !productMerchEventToAdobeEventHashmap[event.toLowerCase()] ||
      !this.productMerchProperties
    ) {
      return merchMap;
    }

    each((rudderProp) => {
      // if property mapped with products. as starting handle differently
      if (rudderProp.productMerchProperties.startsWith("products.")) {
        const key = rudderProp.productMerchProperties.split(".");
        // take the keys after products. and find the value in properties
        const value = _.get(properties, key[1]);
        if (value && value !== "undefined") {
          each((val) => {
            eventString = `${val}=${value}`;
            merchMap.push(eventString);
          }, adobeEvent);
        }
      } else if (rudderProp.productMerchProperties in properties) {
        each((val) => {
          eventString = `${val}=${
            properties[rudderProp.productMerchProperties]
          }`;
          merchMap.push(eventString);
        }, adobeEvent);
      }
    }, this.productMerchProperties);
    return merchMap;
  }

  /**
   * @param  {} properties
   * @description set eVars for product level properties
   * DOC: https://experienceleague.adobe.com/docs/analytics/implementation/vars/page-vars/evar-merchandising.html?lang=en
   * @returns eVars as a string with delimiter "|"
   */

  mapMerchProductEVars(properties) {
    const productMerchEvarsMapHashmap = getHashFromArray(
      this.productMerchEvarsMap
    );
    const eVars = [];
    each((value, key) => {
      // if property mapped with products. as starting handle differently
      if (key.startsWith("products.")) {
        key = key.split(".");
        // take the keys after products. and find the value in properties
        const productValue = _.get(properties, key[1]);
        if (productValue && productValue !== "undefined") {
          eVars.push(`eVar${value}=${productValue}`);
        }
      } else if (key in properties) {
        eVars.push(`eVar${value}=${[properties[key]]}`);
      }
    }, productMerchEvarsMapHashmap);
    return eVars.join("|");
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
      case "product viewed":
      case "product list viewed":
        this.productViewHandle(rudderElement);
        break;
      case "product added":
        this.productAddedHandle(rudderElement);
        break;
      case "product removed":
        this.productRemovedHandle(rudderElement);
        break;
      case "order completed":
        this.orderCompletedHandle(rudderElement);
        break;
      case "cart viewed":
        this.cartViewedHandle(rudderElement);
        break;
      case "checkout started":
        this.checkoutStartedHandle(rudderElement);
        break;
      case "cart opened":
      case "opened cart":
        this.cartOpenedHandle(rudderElement);
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
        case "initHeartbeat":
          this.initHeartbeat(rudderElement);
          break;
        case "heartbeatVideoStart":
          this.heartbeatVideoStart(rudderElement);
          break;
        case "heartbeatVideoPaused":
          this.heartbeatVideoPaused(rudderElement);
          break;
        case "heartbeatVideoComplete":
          this.heartbeatVideoComplete(rudderElement);
          break;
        case "heartbeatSessionEnd":
          this.heartbeatSessionEnd(rudderElement);
          break;
        case "heartbeatAdStarted":
          this.heartbeatAdStarted(rudderElement);
          break;
        case "heartbeatAdCompleted":
          this.heartbeatAdCompleted(rudderElement);
          break;
        case "heartbeatAdSkipped":
          this.heartbeatAdSkipped(rudderElement);
          break;
        case "heartbeatSeekStarted":
          this.heartbeatSeekStarted(rudderElement);
          break;
        case "heartbeatSeekCompleted":
          this.heartbeatSeekCompleted(rudderElement);
          break;
        case "heartbeatBufferStarted":
          this.heartbeatBufferStarted(rudderElement);
          break;
        case "heartbeatBufferCompleted":
          this.heartbeatBufferCompleted(rudderElement);
          break;
        case "heartbeatQualityUpdated":
          this.heartbeatQualityUpdated(rudderElement);
          break;
        case "heartbeatUpdatePlayhead":
          this.heartbeatUpdatePlayhead(rudderElement);
          break;
        default:
          logger.error("No heartbeat function for this event");
      }
    }
  }
}

export default AdobeAnalytics;
