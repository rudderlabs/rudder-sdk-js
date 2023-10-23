import { RudderAnalytics } from './app/RudderAnalytics';

/*
 * Create new RudderAnalytics facade singleton
 */
const {
  setDefaultInstanceKey,
  getAnalyticsInstance,
  load,
  ready,
  page,
  track,
  identify,
  alias,
  group,
  reset,
  getAnonymousId,
  setAnonymousId,
  getUserId,
  getUserTraits,
  getGroupId,
  getGroupTraits,
  startSession,
  endSession,
  getSessionId,
  consent,
  setAuthToken,
} = new RudderAnalytics();

/*
 * Export as global object the RudderAnalytics facade singleton methods
 */
export {
  setDefaultInstanceKey,
  getAnalyticsInstance,
  load,
  ready,
  page,
  track,
  identify,
  alias,
  group,
  reset,
  getAnonymousId,
  setAnonymousId,
  getUserId,
  getUserTraits,
  getGroupId,
  getGroupTraits,
  startSession,
  endSession,
  getSessionId,
  consent,
  setAuthToken,
};
