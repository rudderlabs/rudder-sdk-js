import { PluginName } from './types';

const localPluginNames: PluginName[] = [];

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
];

export { localPluginNames, remotePluginNames };
