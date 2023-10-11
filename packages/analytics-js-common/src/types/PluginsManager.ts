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
  registerPluginsByName(plugins: PluginName[]): void;
}

export type PluginName =
  | 'BeaconQueue'
  | 'Bugsnag'
  | 'DeviceModeDestinations'
  | 'DeviceModeTransformation'
  | 'ErrorReporting'
  | 'ExternalAnonymousId'
  | 'GoogleLinker'
  | 'KetchConsentManager'
  | 'NativeDestinationQueue'
  | 'OneTrustConsentManager'
  | 'StorageEncryption'
  | 'StorageEncryptionLegacy'
  | 'StorageMigrator'
  | 'XhrQueue';
