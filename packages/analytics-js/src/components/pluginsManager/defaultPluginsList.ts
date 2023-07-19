import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

/**
 * Plugins to be loaded in the plugins loadOption is not defined
 */
// TODO: remove from this list the ones that should be loaded only if specific load options exist
const defaultOptionalPluginsList: PluginName[] = [
  PluginName.Bugsnag,
  PluginName.DeviceModeDestinations,
  PluginName.ErrorReporting,
  PluginName.ExternalAnonymousId,
  PluginName.GoogleLinker,
  PluginName.NativeDestinationQueue,
  PluginName.StorageEncryption,
  PluginName.StorageEncryptionLegacy,
  PluginName.StorageMigrator,
  PluginName.XhrQueue,
  PluginName.OneTrustConsentManager,
  PluginName.KetchConsentManager,
  PluginName.BeaconQueue,
];

export { defaultOptionalPluginsList };
