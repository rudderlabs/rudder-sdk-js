import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

/**
 * List of plugin names that are loaded as direct imports in all builds
 */
const localPluginNames: PluginName[] = [];

/**
 * List of plugin names that are loaded as dynamic imports in modern builds
 */
const remotePluginNames: PluginName[] = [
  PluginName.BeaconQueue,
  PluginName.DeviceModeTransformation,
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
  PluginName.Bugsnag,
];

export { localPluginNames, remotePluginNames };
