import { PluginName } from './types';

/**
 * Plugins to be loaded in the plugins loadOption is not defined
 */
// TODO: remove from this list the ones that should be loaded only if specific load options exist
const defaultOptionalPluginsList: PluginName[] = [
  PluginName.ConsentManager,
  PluginName.DeviceModeDestinations,
  PluginName.ErrorReporting,
  PluginName.ExternalAnonymousId,
  PluginName.GoogleLinker,
  PluginName.NativeDestinationQueue,
  PluginName.StorageEncryptionLegacy,
  PluginName.XhrQueue,
  PluginName.OneTrust,
  PluginName.BeaconQueue,
];

export { defaultOptionalPluginsList };
