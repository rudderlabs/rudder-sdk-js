import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

/**
 * List of plugin names that are loaded as direct imports in all builds
 */
const localPluginNames: PluginName[] = [];

/**
 * List of plugin names that are loaded as dynamic imports in modern builds
 */
const pluginNamesList: PluginName[] = [
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
];

const deprecatedPluginsList = ['Bugsnag', 'ErrorReporting', 'XhrQueue', 'BeaconQueue'];

export { localPluginNames, pluginNamesList, deprecatedPluginsList };
