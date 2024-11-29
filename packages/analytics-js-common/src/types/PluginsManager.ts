import type { ExtensionPlugin, IPluginEngine } from './PluginEngine';
import type { Nullable } from './Nullable';

export interface IPluginsManager {
  private_engine: IPluginEngine;
  init(): void;
  attachEffects(): void;
  private_setActivePlugins(): void;
  invokeMultiple<T = any>(extPoint?: string, ...args: any[]): Nullable<T>[];
  invokeSingle<T = any>(extPoint?: string, ...args: any[]): Nullable<T>;
  register(plugins: ExtensionPlugin[]): void;
}

export type PluginName =
  | 'CustomConsentManager'
  | 'DeviceModeDestinations'
  | 'DeviceModeTransformation'
  | 'ErrorReporting'
  | 'ExternalAnonymousId'
  | 'GoogleLinker'
  | 'IubendaConsentManager'
  | 'KetchConsentManager'
  | 'NativeDestinationQueue'
  | 'OneTrustConsentManager'
  | 'StorageEncryption'
  | 'StorageEncryptionLegacy'
  | 'StorageMigrator';
