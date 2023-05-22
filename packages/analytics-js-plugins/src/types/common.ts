/* eslint-disable import/no-extraneous-dependencies */
import { IApplicationState } from '@rudderstack/analytics-js/state/IApplicationState';

export type { RudderEvent, RudderEventType } from '@rudderstack/analytics-js/components/eventManager/types';
export type { QueueOpts } from '@rudderstack/analytics-js/state/types';
export type { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
export type { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
export type { IHttpClient } from '@rudderstack/analytics-js/services/HttpClient/types';
export type { DoneCallback } from '@rudderstack/analytics-js/npmPackages/localstorage-retry';
export { HttpClient } from '@rudderstack/analytics-js/services/HttpClient';

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

export enum PluginName {
  BeaconQueue = 'BeaconQueue',
  ConsentManager = 'ConsentManager',
  DataplaneEventsQueue = 'DataplaneEventsQueue',
  DeviceModeDestinations = 'DeviceModeDestinations',
  DeviceModeTransformation = 'DeviceModeTransformation',
  ErrorReporting = 'ErrorReporting',
  ExternalAnonymousId = 'ExternalAnonymousId',
  GoogleLinker = 'GoogleLinker',
  NativeDestinationQueue = 'NativeDestinationQueue',
  StorageEncryption = 'StorageEncryption',
  StorageEncryptionLegacy = 'StorageEncryptionLegacy',
  XhrQueue = 'XhrQueue',
}

/**
 * Represents the options parameter for anonymousId
 */
export type AnonymousIdOptions = {
  autoCapture?: {
    enabled?: boolean;
    source?: string;
  };
};
