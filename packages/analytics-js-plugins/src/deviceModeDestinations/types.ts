import {
  ApiObject,
  IntegrationOpts,
  LogLevel,
  Nullable,
  AnalyticsAliasMethod,
  AnalyticsGroupMethod,
  AnalyticsIdentifyMethod,
  AnalyticsPageMethod,
  AnalyticsTrackMethod,
} from '../types/common';

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
