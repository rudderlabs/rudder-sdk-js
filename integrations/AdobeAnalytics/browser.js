/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import each from "@ndhoule/each";
import getHashFromArray from "./util";
import ScriptLoader from "../ScriptLoader";
import logger from "../../utils/logUtil";

class AdobeAnalytics {
  constructor(config) {
    this.trackingServerUrl = config.trackingServerUrl || "";
    this.reportSuiteIds = config.reportSuiteIds;
    this.sslHeartbeat = config.sslHeartbeat;
    this.heartbeatTrackingServerUrl = config.heartbeatTrackingServerUrl || "";
    this.eventsToTypes = config.eventsToTypes || [];
    this.name = "ADOBE_ANALYTICS";
  }

  init = () => {
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
  };

  initAdobeAnalyticsClient = () => {
    const { s } = window;
    s.trackingServer = s.trackingServer || this.trackingServerUrl; // need to add tracking server secure url
    this.marketingCloudOrgId = "00E276AB581D06200A495E6B@AdobeOrg";
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
  };

  isLoaded = () => {
    logger.debug("in AdobeAnalytics isLoaded");
    return !!(
      window.ADB &&
      window.ADB.push !== Array.prototype.push &&
      window.s_gi
    );
  };

  isReady = () => {
    logger.debug("in AdobeAnalytics isReady");
    return !!(
      window.ADB &&
      window.ADB.push !== Array.prototype.push &&
      window.s_gi
    );
  };

  track = (rudderElement) => {
    if (this.heartbeatTrackingServerUrl) {
      const eventsToTypesHashmap = getHashFromArray(this.eventsToTypes);
      const { event } = rudderElement.message;
      const heartBeatFunction = eventsToTypesHashmap[event];
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
  };

  initHeartbeat = (rudderElement) => {
    console.log("inside");
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
  };

  hearbeatSessionStart = (rudderElement) => {
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const {
      livestream,
      title,
      asset_id,
      total_length,
      session_id,
    } = properties;
    const streamType = livestream
      ? va.MediaHeartbeat.StreamType.LIVE
      : va.MediaHeartbeat.StreamType.VOD;
    const mediaObj = va.MediaHeartbeat.createMediaObject(
      title || "",
      asset_id || "unknown video id",
      total_length || 0,
      streamType
    );
    const contextData = this.customVideoMetadataContext(rudderElement);
    this.standardVideoMetadata(rudderElement, mediaObj);

    this.mediaHeartbeats[session_id || "default"].hearbeat.trackSessionStart(
      mediaObj,
      contextData
    );
  };

  heartbeatVideoStart = (rudderElement) => {
    this.populatHeartbeat(rudderElement);
    const { properties } = rudderElement.message;
    const { va } = window.ADB;
    const {
      session_id,
      chapter_name,
      position,
      length,
      start_time,
    } = properties;

    this.mediaHeartbeats[session_id || "default"].hearbeat.trackPlay();
    const contextData = this.customVideoMetadataContext(rudderElement);

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
  };

  heartbeatVideoPaused = (rudderElement) => {
    this.populatHeartbeat(rudderElement);
    const { properties } = rudderElement.message;
    this.mediaHeartbeats[
      properties.session_id || "default"
    ].hearbeat.trackPause();
  };

  heartbeatVideoComplete = (rudderElement) => {
    this.populatHeartbeat(rudderElement);
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    this.mediaHeartbeats[properties.session_id || "defualt"].trackEvent(
      va.MediaHeartbeat.Event.ChapterComplete
    );
    this.mediaHeartbeats[
      properties.session_id || "default"
    ].chapterInProgress = false;
  };

  heartbeatSessionEnd = (rudderElement) => {
    this.populatHeartbeat(rudderElement);
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackComplete();
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackSessionEnd();

    delete this.mediaHeartbeats[session_id || "default"];
    delete this.adBreakCounts[session_id || "default"];
  };

  heartbeatAdStarted = (rudderElement) => {
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
  };

  heartbeatAdCompleted = (rudderElement) => {
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
  };

  heartbeatAdSkipped = (rudderElement) => {
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
  };

  heartbeatSeekStarted = (rudderElement) => {
    this.populatHeartbeat(rudderElement);
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.SeekStart
    );
  };

  heartbeatSeekCompleted = (rudderElement) => {
    this.populatHeartbeat(rudderElement);
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.SeekComplete
    );
  };

  heartbeatBufferStarted = (rudderElement) => {
    this.populatHeartbeat(rudderElement);
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.BufferStart
    );
  };

  heartbeatQualityUpdated = (rudderElement) => {
    this.createQos(rudderElement);
  };

  heartbeatUpdatePlayhead = (rudderElement) => {
    this.playhead = rudderElement.message.properties
      ? rudderElement.message.properties.position
      : null;
  };

  heartbeatBufferCompleted = (rudderElement) => {
    this.populatHeartbeat(rudderElement);
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { session_id } = properties;
    this.mediaHeartbeats[session_id || "default"].hearbeat.trackEvent(
      va.MediaHeartbeat.Event.BufferComplete
    );
  };

  createQos = (rudderElement) => {
    const { va } = window.ADB;
    const { properties } = rudderElement.message;
    const { bitrate, startupTime, fps, droppedFrames } = properties;

    this.qosData = va.MediaHeartbeat.createQoSObject(
      bitrate || 0,
      startupTime || 0,
      fps || 0,
      droppedFrames || 0
    );
  };

  populatHeartbeat = (rudderElement) => {
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
  };

  customVideoMetadataContext = (rudderElement) => {
    console.log(rudderElement);
    const contextData = {};
    const extractedProperties = [];
    each((value, key) => {
      if (!key || value === undefined || value === null || value === "") {
        return;
      }
      if (typeof value === "boolean") {
        contextData[key] = value.toString();
        return;
      }
      contextData[key] = value;
    }, extractedProperties);
    return contextData;
  };

  standardVideoMetadata = (rudderElement, mediaObj) => {
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
  };
}

export default AdobeAnalytics;
