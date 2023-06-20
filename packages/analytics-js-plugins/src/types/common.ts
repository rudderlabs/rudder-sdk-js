/* eslint-disable import/no-extraneous-dependencies */
import { IApplicationState } from '@rudderstack/analytics-js/state/IApplicationState';

export type ApplicationState = IApplicationState;

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
  IStore,
  IStoreManager,
  IStorage,
  StorageType,
} from '@rudderstack/analytics-js/services/StoreManager/types';
export type {
  IRudderAnalytics,
  AnalyticsAliasMethod,
  AnalyticsGroupMethod,
  AnalyticsIdentifyMethod,
  AnalyticsPageMethod,
  AnalyticsTrackMethod,
} from '@rudderstack/analytics-js/app/IRudderAnalytics';

export { ExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader/ExternalSrcLoader';

export interface ExtensionPoint {
  [lifeCycleName: string]: (...args: any[]) => unknown;
}

export interface ExtensionPlugin {
  name: PluginName;
  initialize: (state: ApplicationState) => void;
  deps?: string[];
  [key: string]:
    | string
    | (() => void)
    | ExtensionPoint
    | ((...args: any[]) => unknown)
    | string[]
    | undefined;
}

export type Nullable<T> = T | null;

/**
 * Represents the options parameter for anonymousId
 */
export type AnonymousIdOptions = {
  autoCapture?: {
    enabled?: boolean;
    source?: string;
  };
};

export type ConsentInfo = {
  consentProviderInitialized: boolean;
  allowedConsents?: Record<string, string>;
  deniedConsentIds?: string[];
};

// Not using the analytics-js package enums to avoid generation of another shared bundle
export type PluginName =
  | 'BeaconQueue'
  | 'ConsentManager'
  | 'DeviceModeDestinations'
  | 'DeviceModeTransformation'
  | 'ErrorReporting'
  | 'ExternalAnonymousId'
  | 'GoogleLinker'
  | 'NativeDestinationQueue'
  | 'StorageEncryption'
  | 'StorageEncryptionLegacy'
  | 'XhrQueue'
  | 'OneTrust'
  | 'Bugsnag';

export type RudderEventType = 'page' | 'track' | 'identify' | 'alias' | 'group';

export type LogLevel = 'LOG' | 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'NONE';

export type { Bugsnag as BugsnagLib } from '@bugsnag/js';
