import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

/**
 * Plugins to be loaded in the plugins loadOption is not defined
 */
// TODO: remove from this list the ones that should be loaded only if specific load options exist
const defaultOptionalPluginsList: PluginName[] = [
  'Bugsnag',
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
  'BeaconQueue',
];

export { defaultOptionalPluginsList };
