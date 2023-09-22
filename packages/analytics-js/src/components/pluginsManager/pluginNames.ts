import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

/**
 * List of plugin names that are loaded as direct imports in all builds
 */
const localPluginNames: PluginName[] = [];

/**
 * List of plugin names that are loaded as dynamic imports in modern builds
 */
const remotePluginNames: PluginName[] = [
  'BeaconQueue',
  'DeviceModeTransformation',
  'DeviceModeDestinations',
  'ErrorReporting',
  'ExternalAnonymousId',
  'GoogleLinker',
  'NativeDestinationQueue',
  'StorageEncryption',
  'StorageEncryptionLegacy',
  'StorageMigrator',
  'XhrQueue',
  'OneTrustConsentManager',
  'KetchConsentManager',
  'Bugsnag',
];

export { localPluginNames, remotePluginNames };
