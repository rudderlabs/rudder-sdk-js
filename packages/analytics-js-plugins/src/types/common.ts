/* eslint-disable import/no-extraneous-dependencies */
import { IApplicationState } from '@rudderstack/analytics-js/state/IApplicationState';

export type ApplicationState = IApplicationState;

export interface ExtensionPoint {
  [lifeCycleName: string]: (...args: any[]) => unknown;
}

export interface ExtensionPlugin {
  name: string;
  initialize?: (state: ApplicationState) => void;
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
