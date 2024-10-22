import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

/**
 * List of plugin names that are loaded as direct imports in all builds
 */
const localPluginNames: PluginName[] = [];

/**
 * List of plugin names that are loaded as dynamic imports in modern builds
 */
const pluginNamesList: PluginName[] = [
  'BeaconQueue',
  'Bugsnag', // deprecated
  'CustomConsentManager',
  'DeviceModeDestinations',
  'DeviceModeTransformation',
  'ErrorReporting',
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

const deprecatedPluginsList = ['Bugsnag'];

export { localPluginNames, pluginNamesList, deprecatedPluginsList };
