import { IntegrationOpts } from '@rudderstack/common/types/Integration';
import {
  AnalyticsAliasMethod,
  AnalyticsGroupMethod,
  AnalyticsIdentifyMethod,
  AnalyticsPageMethod,
  AnalyticsTrackMethod,
} from '@rudderstack/common/types/IRudderAnalytics';
import { ApiObject } from '@rudderstack/common/types/ApiObject';
import { Nullable } from '@rudderstack/common/types/Nullable';
import { LogLevel } from '../types/plugins';

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
