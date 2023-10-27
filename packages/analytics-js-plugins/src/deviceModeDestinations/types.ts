import type { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import type {
  AnalyticsAliasMethod,
  AnalyticsGroupMethod,
  AnalyticsIdentifyMethod,
  AnalyticsPageMethod,
  AnalyticsTrackMethod,
} from '@rudderstack/analytics-js-common/types/IRudderAnalytics';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { LogLevel } from '../types/plugins';

export type DeviceModeDestinationsAnalyticsInstance = {
  loadIntegration: boolean;
  logLevel: LogLevel;
  loadOnlyIntegrations: IntegrationOpts;
  track: AnalyticsTrackMethod;
  page: AnalyticsPageMethod;
  identify: AnalyticsIdentifyMethod;
  group: AnalyticsGroupMethod;
  alias: AnalyticsAliasMethod;
  getAnonymousId: () => string;
  getUserId: () => Nullable<string> | undefined;
  getUserTraits: () => Nullable<ApiObject> | undefined;
  getGroupId: () => Nullable<string> | undefined;
  getGroupTraits: () => Nullable<ApiObject> | undefined;
  getSessionId: () => Nullable<number>;
};
