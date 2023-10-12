/**
 * List of plugin names that are loaded as direct imports in all builds
 */
const localPluginNames = [];
/**
 * List of plugin names that are loaded as dynamic imports in modern builds
 */
const pluginNamesList = [
  'BeaconQueue',
  'Bugsnag',
  'DeviceModeDestinations',
  'DeviceModeTransformation',
  'ErrorReporting',
  'ExternalAnonymousId',
  'GoogleLinker',
  'KetchConsentManager',
  'NativeDestinationQueue',
  'OneTrustConsentManager',
  'StorageEncryption',
  'StorageEncryptionLegacy',
  'StorageMigrator',
  'XhrQueue',
];
export { localPluginNames, pluginNamesList };
