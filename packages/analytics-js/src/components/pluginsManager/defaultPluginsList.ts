import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

/**
 * Plugins to be loaded in the plugins loadOption is not defined
 */
const allOptionalPlugins: PluginName[] = [
  'BeaconQueue',
  'CustomConsentManager',
  'DeviceModeDestinations',
  'DeviceModeTransformation',
  'ExternalAnonymousId',
  'GoogleLinker',
  'IubendaConsentManager',
  'KetchConsentManager',
  'NativeDestinationQueue',
  'OneTrustConsentManager',
  'StorageEncryption',
  'StorageEncryptionLegacy',
  'StorageMigrator',
  'XhrQueue',
];

// Plugins excluded from lite builds which are also not connected to any SDK configuration options
const liteExcludedPlugins: PluginName[] = ['GoogleLinker'];

const defaultOptionalPluginsList: PluginName[] = __IS_LITE_BUILD__
  ? allOptionalPlugins.filter(plugin => !liteExcludedPlugins.includes(plugin))
  : allOptionalPlugins;

export { defaultOptionalPluginsList };
