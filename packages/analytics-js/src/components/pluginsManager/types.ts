import {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js/npmPackages/js-plugin/types';

export interface IPluginsManager {
  engine: IPluginEngine;
  init(): void;
  attachEffects(): void;
  setActivePlugins(): void;
  invoke<T = any>(extPoint?: string, ...args: any[]): T[];
  register(plugins: ExtensionPlugin[]): void;
}

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

export type PluginMap<T = ExtensionPlugin> = Record<string, () => T>;
