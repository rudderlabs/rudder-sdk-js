import { RudderAnalytics } from '@rudderstack/analytics-js/app/RudderAnalytics';

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
};
