import { PluginName } from './types';

/**
 * Plugins to be loaded in the plugins loadOption is not defined
 */
const defaultOptionalPluginsList: PluginName[] = [
  PluginName.ConsentManager,
  PluginName.DeviceModeDestinations,
  PluginName.ErrorReporting,
  PluginName.ExternalAnonymousId,
  PluginName.GoogleLinker,
  PluginName.NativeDestinationQueue,
  PluginName.StorageEncryptionLegacy,
  PluginName.XhrQueue,
];

export { defaultOptionalPluginsList };
