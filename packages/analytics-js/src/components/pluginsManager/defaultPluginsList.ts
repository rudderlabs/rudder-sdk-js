import { PluginName } from './types';

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
