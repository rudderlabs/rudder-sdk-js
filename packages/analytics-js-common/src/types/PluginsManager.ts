import { ExtensionPlugin, IPluginEngine } from './PluginEngine';
import { Nullable } from './Nullable';

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
  Bugsnag = 'Bugsnag',
  DeviceModeDestinations = 'DeviceModeDestinations',
  DeviceModeTransformation = 'DeviceModeTransformation',
  ErrorReporting = 'ErrorReporting',
  ExternalAnonymousId = 'ExternalAnonymousId',
  GoogleLinker = 'GoogleLinker',
  KetchConsentManager = 'KetchConsentManager',
  NativeDestinationQueue = 'NativeDestinationQueue',
  OneTrustConsentManager = 'OneTrustConsentManager',
  StorageEncryption = 'StorageEncryption',
  StorageEncryptionLegacy = 'StorageEncryptionLegacy',
  StorageMigrator = 'StorageMigrator',
  XhrQueue = 'XhrQueue',
}
