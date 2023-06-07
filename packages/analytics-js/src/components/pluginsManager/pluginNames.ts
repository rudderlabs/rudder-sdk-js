import { PluginName } from './types';

/**
 * List of plugin names that are loaded as direct imports in all builds
 */
const localPluginNames: PluginName[] = [];

/**
 * List of plugin names that are loaded as dynamic imports in modern builds
 */
const remotePluginNames: PluginName[] = [
  PluginName.BeaconQueue,
  PluginName.ConsentManager,
  PluginName.DeviceModeTransformation,
  PluginName.DeviceModeDestinations,
  PluginName.ErrorReporting,
  PluginName.ExternalAnonymousId,
  PluginName.GoogleLinker,
  PluginName.NativeDestinationQueue,
  PluginName.StorageEncryption,
  PluginName.StorageEncryptionLegacy,
  PluginName.XhrQueue,
  PluginName.OneTrust,
];

export { localPluginNames, remotePluginNames };
