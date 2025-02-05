import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

/**
 * Plugins to be loaded in the plugins loadOption is not defined
 */
const defaultOptionalPluginsList: PluginName[] = [
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

export { defaultOptionalPluginsList };
