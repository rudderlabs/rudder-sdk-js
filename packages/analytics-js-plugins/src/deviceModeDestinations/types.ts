import type { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import type { IRudderAnalytics } from '@rudderstack/analytics-js-common/types/IRudderAnalytics';
import type { LogLevel } from '../types/plugins';

export type DeviceModeDestinationsAnalyticsInstance = Pick<
  IRudderAnalytics,
  | 'track'
  | 'page'
  | 'identify'
  | 'group'
  | 'alias'
  | 'getAnonymousId'
  | 'getUserId'
  | 'getUserTraits'
  | 'getGroupId'
  | 'getGroupTraits'
  | 'getSessionId'
> & {
  loadIntegration: boolean;
  logLevel: LogLevel;
  loadOnlyIntegrations: IntegrationOpts;
};
