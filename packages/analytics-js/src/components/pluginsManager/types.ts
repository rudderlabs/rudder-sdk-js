import {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js/services/PluginEngine/types';
import { Nullable } from '@rudderstack/analytics-js/types';

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
  OneTrust = 'OneTrust',
}

export type PluginMap<T = ExtensionPlugin> = Record<string, () => T>;
