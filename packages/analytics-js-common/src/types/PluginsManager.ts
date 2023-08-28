import {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js-common/types/PluginEngine';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';

export interface IPluginsManager {
  engine: IPluginEngine;
  init(): void;
  attachEffects(): void;
  setActivePlugins(): void;
  invokeMultiple<T = any>(extPoint?: string, ...args: any[]): Nullable<T>[];
  invokeSingle<T = any>(extPoint?: string, ...args: any[]): Nullable<T>;
  register(plugins: ExtensionPlugin[]): void;
}

export enum PluginName {
  BeaconQueue = 'BeaconQueue',
  DeviceModeDestinations = 'DeviceModeDestinations',
  DeviceModeTransformation = 'DeviceModeTransformation',
  ErrorReporting = 'ErrorReporting',
  ExternalAnonymousId = 'ExternalAnonymousId',
  GoogleLinker = 'GoogleLinker',
  NativeDestinationQueue = 'NativeDestinationQueue',
  StorageEncryption = 'StorageEncryption',
  StorageEncryptionLegacy = 'StorageEncryptionLegacy',
  StorageMigrator = 'StorageMigrator',
  XhrQueue = 'XhrQueue',
  OneTrustConsentManager = 'OneTrustConsentManager',
  KetchConsentManager = 'KetchConsentManager',
  Bugsnag = 'Bugsnag',
}
