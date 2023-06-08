import { ApiObject, IntegrationOpts, LogLevel, Nullable } from '../types/common';

export type DeviceModeDestinationsAnalyticsInstance = {
  loadIntegration: boolean;
  logLevel: LogLevel;
  loadOnlyIntegrations: IntegrationOpts;
  track: (...args: any) => void;
  page: (...args: any) => void;
  identify: (...args: any) => void;
  group: (...args: any) => void;
  alias: (...args: any) => void;
  getAnonymousId: () => string;
  getUserId: () => Nullable<string> | undefined;
  getUserTraits: () => Nullable<ApiObject> | undefined;
  getGroupId: () => Nullable<string> | undefined;
  getGroupTraits: () => Nullable<ApiObject> | undefined;
  getSessionId: () => Nullable<number>;
};
