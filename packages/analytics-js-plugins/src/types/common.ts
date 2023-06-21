/* eslint-disable import/no-extraneous-dependencies */
import { IApplicationState } from '@rudderstack/analytics-js/state/IApplicationState';
export type ApplicationState = IApplicationState;

export type {
  IStore,
  IStoreManager,
  IStorage,
} from '@rudderstack/analytics-js/services/StoreManager/types';
export type { RudderEvent } from '@rudderstack/analytics-js/components/eventManager/types';
export type {
  QueueOpts,
  DestinationsQueueOpts,
  ApiObject,
  ApiOptions,
  ApiCallback,
  DestinationIntgConfig,
  BeaconQueueOpts,
  DestinationConfig,
  IntegrationOpts,
} from '@rudderstack/analytics-js/state/types';
export type { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
export type {
  IErrorHandler,
  IExternalSrcLoader,
} from '@rudderstack/analytics-js/services/ErrorHandler/types';
export type { IHttpClient } from '@rudderstack/analytics-js/services/HttpClient/types';
export type { IPluginsManager } from '@rudderstack/analytics-js/components/pluginsManager/types';
export type { IPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine/types';
export type { DeviceModeDestination, Destination } from '@rudderstack/analytics-js/state/types';
export type { NativeDestinationsState } from '@rudderstack/analytics-js/state/slices/nativeDestinations';
export type {
  IRudderAnalytics,
  AnalyticsAliasMethod,
  AnalyticsGroupMethod,
  AnalyticsIdentifyMethod,
  AnalyticsPageMethod,
  AnalyticsTrackMethod,
} from '@rudderstack/analytics-js/app/IRudderAnalytics';

export { type StorageType } from '@rudderstack/analytics-js/services/StoreManager/types';
