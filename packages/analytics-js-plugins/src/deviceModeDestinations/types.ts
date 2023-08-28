import { IntegrationOpts } from '@rudderstack/analytics-js-common/types/Integration';
import {
  AnalyticsAliasMethod,
  AnalyticsGroupMethod,
  AnalyticsIdentifyMethod,
  AnalyticsPageMethod,
  AnalyticsTrackMethod,
} from '@rudderstack/analytics-js-common/types/IRudderAnalytics';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { LogLevel } from '@rudderstack/analytics-js-plugins/types/plugins';

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
