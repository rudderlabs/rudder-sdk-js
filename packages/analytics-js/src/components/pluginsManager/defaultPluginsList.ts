import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

/**
 * Plugins to be loaded in the plugins loadOption is not defined
 */
const defaultOptionalPluginsList: PluginName[] = [
  'BeaconQueue',
  'Bugsnag',
  'CustomConsentManager',
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

export { defaultOptionalPluginsList };
