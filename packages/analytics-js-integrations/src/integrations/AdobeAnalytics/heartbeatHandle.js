/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import * as utils from './util';

let qosData = {};
const mediaHeartbeats = {};
let playhead = 0;
const adBreakCounts = {};
let adBreakProgress = false;
// Begin heartbeat implementation

// Handling Video Type Events
// DOC: https://experienceleague.adobe.com/docs/media-analytics/using/sdk-implement/setup/setup-javascript/set-up-js-2.html?lang=en
// DOC: https://experienceleague.adobe.com/docs/media-analytics/using/sdk-implement/track-av-playback/track-core-overview.html?lang=en

const heartbeatSessionStart = rudderElement => {
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  const { livestream, title, asset_id, total_length, session_id } = properties;
  const streamType = livestream
    ? va.MediaHeartbeat.StreamType.LIVE
    : va.MediaHeartbeat.StreamType.VOD;
  const mediaObj = va.MediaHeartbeat.createMediaObject(
    title || '',
    asset_id || 'unknown video id',
    total_length || 0,
    streamType,
  );
  const contextData = utils.handleVideoContextData(rudderElement);
  utils.standardVideoMetadata(rudderElement, mediaObj);

  mediaHeartbeats[session_id || 'default'].heartbeat.trackSessionStart(mediaObj, contextData);
};

const initHeartbeat = rudderElement => {
  const config = utils.getConfig();
  const { va } = window.ADB;
  const { message } = rudderElement;
  const { properties, context } = message;
  const { channel, video_player, session_id, ovp } = properties;

  const mediaHeartbeatConfig = new va.MediaHeartbeatConfig();
  const mediaHeartbeatDelegate = new va.MediaHeartbeatDelegate();

  mediaHeartbeatConfig.trackingServer = config.heartbeatTrackingServerUrl;
  mediaHeartbeatConfig.channel = channel || '';
  mediaHeartbeatConfig.ovp = ovp || 'unknown';
  mediaHeartbeatConfig.appVersion = context.app.version || 'unknown';
  mediaHeartbeatConfig.playerName = video_player || 'unknown';
  mediaHeartbeatConfig.ssl = config.sslHeartbeat;
  mediaHeartbeatConfig.debugLogging = !!window._enableHeartbeatDebugLogging;

  mediaHeartbeatDelegate.getCurrentPlaybackTime = () => {
    playhead = playhead || 0;
    const sessions = window.rudderHBPlayheads || {};
    playhead = sessions[session_id] ? sessions[session_id] : playhead;
    return playhead;
  };

  mediaHeartbeatDelegate.getQoSObject = () => qosData;

  mediaHeartbeats[session_id || 'default'] = {
    heartbeat: new va.MediaHeartbeat(mediaHeartbeatDelegate, mediaHeartbeatConfig, window.s),
    delegate: mediaHeartbeatDelegate,
    config: mediaHeartbeatConfig,
  };
  qosData = utils.createQos(rudderElement);
  heartbeatSessionStart(rudderElement);
};

const populateHeartbeat = rudderElement => {
  const { properties } = rudderElement.message;
  const { session_id, channel, video_player } = properties;
  const mediaHeartbeat = mediaHeartbeats[session_id || 'default'];
  if (!mediaHeartbeat) {
    initHeartbeat(rudderElement);
  } else {
    const mediaHeartbeatConfig = mediaHeartbeat.config;
    mediaHeartbeatConfig.channel = channel || mediaHeartbeatConfig.channel;
    mediaHeartbeatConfig.playerName = video_player || mediaHeartbeatConfig.playerName;
  }
};

const heartbeatVideoStart = rudderElement => {
  populateHeartbeat(rudderElement);
  const { properties } = rudderElement.message;
  const { va } = window.ADB;
  const { session_id, chapter_name, position, length, start_time } = properties;
  mediaHeartbeats[session_id || 'default'].heartbeat.trackPlay();
  const contextData = utils.handleVideoContextData(rudderElement);
  if (!mediaHeartbeats[session_id || 'default'].chapterInProgress) {
    const chapterObj = va.MediaHeartbeat.createChapterObject(
      chapter_name || 'no chapter name',
      position || 1,
      length || 6000,
      start_time || 0,
    );
    mediaHeartbeats[session_id || 'default'].heartbeat.trackEvent(
      va.MediaHeartbeat.Event.ChapterStart,
      chapterObj,
      contextData,
    );
    mediaHeartbeats[session_id || 'default'].chapterInProgress = true;
  }
};

const heartbeatVideoPaused = rudderElement => {
  populateHeartbeat(rudderElement);
  const { properties } = rudderElement.message;
  mediaHeartbeats[properties.session_id || 'default'].heartbeat.trackPause();
};

const heartbeatVideoComplete = rudderElement => {
  populateHeartbeat(rudderElement);
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  mediaHeartbeats[properties.session_id || 'defualt'].heartbeat.trackEvent(
    va.MediaHeartbeat.Event.ChapterComplete,
  );
  mediaHeartbeats[properties.session_id || 'default'].chapterInProgress = false;
};

const heartbeatSessionEnd = rudderElement => {
  populateHeartbeat(rudderElement);
  const { properties } = rudderElement.message;
  const { session_id } = properties;
  mediaHeartbeats[session_id || 'default'].heartbeat.trackComplete();
  mediaHeartbeats[session_id || 'default'].heartbeat.trackSessionEnd();

  delete mediaHeartbeats[session_id || 'default'];
  delete adBreakCounts[session_id || 'default'];
};

const heartbeatAdStarted = rudderElement => {
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  const { session_id, type, position, title, asset_id, total_length, content } = properties;
  let adSessionCount = adBreakCounts[session_id || 'deafult'];
  adSessionCount = adSessionCount
    ? adBreakCounts[session_id || 'default'] + 1
    : // eslint-disable-next-line sonarjs/no-nested-assignment
      (adBreakCounts[session_id || 'default'] = 1);
  const adBreakObj = va.MediaHeartbeat.createAdBreakObject(
    type || 'unknown',
    adSessionCount,
    position || 1,
  );

  mediaHeartbeats[session_id || 'default'].heartbeat.trackEvent(
    va.MediaHeartbeat.Event.AdBreakStart,
    adBreakObj,
  );
  adBreakProgress = true;

  const adObject = va.MediaHeartbeat.createAdObject(
    title || 'no title',
    asset_id.toString() || 'default ad',
    position || 1,
    total_length || 0,
  );
  utils.standardAdMetadata(rudderElement, adObject);

  mediaHeartbeats[session_id || 'deafult'].heartbeat.trackEvent(
    va.MediaHeartbeat.Event.AdStart,
    adObject,
    content || {},
  );
};

const heartbeatAdCompleted = rudderElement => {
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  const { session_id } = properties;
  if (!adBreakProgress) {
    heartbeatAdStarted(rudderElement);
  }
  mediaHeartbeats[session_id || 'default'].heartbeat.trackEvent(va.MediaHeartbeat.Event.AdComplete);

  mediaHeartbeats[session_id || 'default'].heartbeat.trackEvent(
    va.MediaHeartbeat.Event.AdBreakComplete,
  );
  adBreakProgress = false;
};

const heartbeatAdSkipped = rudderElement => {
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  const { session_id } = properties;
  if (!adBreakProgress) {
    heartbeatAdStarted(rudderElement);
  }
  mediaHeartbeats[session_id || 'default'].heartbeat.trackEvent(va.MediaHeartbeat.Event.AdSkip);
  mediaHeartbeats[session_id || 'default'].heartbeat.trackEvent(
    va.MediaHeartbeat.Event.AdBreakComplete,
  );
  adBreakProgress = false;
};

const heartbeatSeekStarted = rudderElement => {
  populateHeartbeat(rudderElement);
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  const { session_id } = properties;
  mediaHeartbeats[session_id || 'default'].heartbeat.trackEvent(va.MediaHeartbeat.Event.SeekStart);
};

const heartbeatSeekCompleted = rudderElement => {
  populateHeartbeat(rudderElement);
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  const { session_id } = properties;
  mediaHeartbeats[session_id || 'default'].heartbeat.trackEvent(
    va.MediaHeartbeat.Event.SeekComplete,
  );
};

const heartbeatBufferStarted = rudderElement => {
  populateHeartbeat(rudderElement);
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  const { session_id } = properties;

  mediaHeartbeats[session_id || 'default'].heartbeat.trackEvent(
    va.MediaHeartbeat.Event.BufferStart,
  );
};

const heartbeatQualityUpdated = rudderElement => {
  qosData = utils.createQos(rudderElement);
};

const heartbeatUpdatePlayhead = rudderElement => {
  if (rudderElement.message.properties) {
    playhead =
      rudderElement.message.properties.position ||
      rudderElement.message.properties.playhead ||
      null;
  }
};

const heartbeatBufferCompleted = rudderElement => {
  populateHeartbeat(rudderElement);
  const { va } = window.ADB;
  const { properties } = rudderElement.message;
  const { session_id } = properties;

  mediaHeartbeats[session_id || 'default'].heartbeat.trackEvent(
    va.MediaHeartbeat.Event.BufferComplete,
  );
};

export {
  populateHeartbeat,
  initHeartbeat,
  heartbeatSessionStart,
  heartbeatVideoStart,
  heartbeatVideoPaused,
  heartbeatVideoComplete,
  heartbeatSessionEnd,
  heartbeatAdStarted,
  heartbeatAdCompleted,
  heartbeatAdSkipped,
  heartbeatSeekStarted,
  heartbeatSeekCompleted,
  heartbeatBufferStarted,
  heartbeatQualityUpdated,
  heartbeatUpdatePlayhead,
  heartbeatBufferCompleted,
};
