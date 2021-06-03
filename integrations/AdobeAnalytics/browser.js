import each from "@ndhoule/each";
import { toIso, getHashFromArray, getDataFromContext } from "./util";
import ScriptLoader from "../ScriptLoader";
import logger from "../../utils/logUtil";

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
    this.trackPageName = config.trackPageName; // to be added
    this.contextDataMapping = config.contextDataMapping || []; // to be added
    this.eVarMapping = config.eVarMapping || []; // to be added
    this.hierMapping = config.hierMapping || []; // to be added
    this.pageName = "";
    this.name = "ADOBE_ANALYTICS";
  }

  init() {
    // check if was already initialised. If yes then use already existing.
    window.s_account = window.s_account || this.reportSuiteIds;
    window.rudderHBPlayheads = {};
    if (this.heartbeatTrackingServerUrl) {
      ScriptLoader(
        "adobe-analytics-heartbeat",
        "https://cdn.rudderlabs.com/adobe-analytics-js/adobe-analytics-js-heartbeat.js"
      );
      this.setIntervalHandler = setInterval(
        this.initAdobeAnalyticsClient.bind(this),
        1000
      );
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
    s.trackingServer = s.trackingServer || this.trackingServerUrl; // need to add tracking server secure url
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

  processEvent(rudderElement, adobeEventName) {
    const { properties, event } = rudderElement.message;
    const { currency } = properties;

    // TODO: need to add property mappings

    this.updateCommonWindowSKeys(rudderElement);
    this.calculateTimestamp(rudderElement);
    if (currency !== "USD") {
      this.updateWindowSKeys(currency, "currencyCode");
    }

    this.updateWindowSKeys(adobeEventName, "events");

    this.handleContextData(rudderElement);
    this.handleEVars(rudderElement);

    window.s.linkTrackVars = dynamicKeys.join(",");
    window.s.tl(true, "o", event);
  }

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

  clearWindowSKeys(presentKeys) {
    each((keys) => {
      delete window.s[keys];
    }, presentKeys);
    presentKeys.length = 0;
  }

  updateWindowSKeys(value, key) {
    if (key && value !== undefined && value !== null && value !== "") {
      dynamicKeys.push(key);
      window.s[key] = value.toString();
    }
  }

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

  calculateTimestamp(rudderElement) {
    const { properties } = rudderElement.message;
    const timestamp = properties.originalTimestamp || properties.timestamp;
    // he s.timestamp variable is a string containing the date and time of the hit. Valid timestamp formats include ISO 8601 and Unix time.
    // if (typeof timestamp !== "string") {
    //   timestamp = toIso(timestamp);
    // }
    if (
      (this.timestampOption === "hybrid" && !this.preferVisitorId) ||
      this.timestampOption === "enabled"
    ) {
      this.updateWindowSKeys(timestamp, "timestamp");
    }
  }

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
          this.setContextData(key, value.toString());
        }
      }, keyValueContextData);
    }
  }

  setContextData(contextDataKey, contextDataValue) {
    window.s.contextData[contextDataKey] = contextDataValue;
    dynamicKeys.push(`contextData.${contextDataKey}`);
  }

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
          this.updateWindowSKeys(value, eVarHashmapMod[key]);
        }
      }, properties);
    }
  }

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
          this.updateWindowSKeys(value, hierHashmapMod[key]);
        }
      }, properties);
    }
  }

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
}

export default AdobeAnalytics;
