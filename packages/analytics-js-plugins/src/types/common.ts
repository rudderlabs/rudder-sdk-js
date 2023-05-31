/* eslint-disable import/no-extraneous-dependencies */
import { IApplicationState } from '@rudderstack/analytics-js/state/IApplicationState';

export type {
  RudderEvent,
  RudderEventType,
} from '@rudderstack/analytics-js/components/eventManager/types';
export type {
  QueueOpts,
  DestinationsQueueOpts,
  LogLevel,
  ApiObject,
} from '@rudderstack/analytics-js/state/types';
export type { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
export type { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
export type { IHttpClient } from '@rudderstack/analytics-js/services/HttpClient/types';
export type { DoneCallback } from '@rudderstack/analytics-js/npmPackages/localstorage-retry';
export type { IPluginsManager } from '@rudderstack/analytics-js/components/pluginsManager/types';
export { HttpClient } from '@rudderstack/analytics-js/services/HttpClient';
export { PluginName } from '@rudderstack/analytics-js/components/pluginsManager/types';
export type { DeviceModeDestination, Destination } from '@rudderstack/analytics-js/state/types';
export type { NativeDestinationsState } from '@rudderstack/analytics-js/state/slices/nativeDestinations';
export type { DestinationConfig, IntegrationOpts } from '@rudderstack/analytics-js/state/types';

export type ApplicationState = IApplicationState;

export interface ExtensionPoint {
  [lifeCycleName: string]: (...args: any[]) => unknown;
}

export interface ExtensionPlugin {
  name: string;
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

export interface IExternalSrcLoader {
  errorHandler?: any;
  logger?: any;
  timeout: number;
  loadJSFile(config: Record<string, any>): Promise<void>;
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
