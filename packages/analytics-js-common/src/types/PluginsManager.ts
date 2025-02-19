import type { ExtensionPlugin, IPluginEngine } from './PluginEngine';
import type { Nullable } from './Nullable';

export interface IPluginsManager {
  engine: IPluginEngine;
  init(): void;
  attachEffects(): void;
  setActivePlugins(): void;
  invokeMultiple<T = any>(extPoint?: string, ...args: any[]): Nullable<T>[];
  invokeSingle<T = any>(extPoint?: string, ...args: any[]): Nullable<T>;
  register(plugins: ExtensionPlugin[]): void;
}

export type PluginName =
  | 'CustomConsentManager'
  | 'DeviceModeDestinations'
  | 'DeviceModeTransformation'
  | 'ExternalAnonymousId'
  | 'GoogleLinker'
  | 'IubendaConsentManager'
  | 'KetchConsentManager'
  | 'NativeDestinationQueue'
  | 'OneTrustConsentManager'
  | 'StorageEncryption'
  | 'StorageEncryptionLegacy'
  | 'StorageMigrator';
