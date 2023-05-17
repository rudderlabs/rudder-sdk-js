import { ExtensionPlugin } from '@rudderstack/analytics-js/services/PluginEngine/types';
import { PluginMap, PluginName } from './types';
import { remotePluginNames } from './pluginNames';

/**
 * Get the lazy loaded dynamic import for a plugin name
 */
const getFederatedModuleImport = (
  pluginName: PluginName,
): (() => Promise<ExtensionPlugin>) | undefined => {
  switch (pluginName) {
    case PluginName.BeaconQueue:
      return () => import('remotePlugins/BeaconQueue');
    case PluginName.ConsentManager:
      return () => import('remotePlugins/ConsentManager');
    case PluginName.DataplaneEventsQueue:
      return () => import('remotePlugins/DataplaneEventsQueue');
    case PluginName.DeviceModeTransformation:
      return () => import('remotePlugins/DeviceModeTransformation');
    case PluginName.DeviceModeDestinations:
      return () => import('remotePlugins/DeviceModeDestinations');
    case PluginName.ErrorReporting:
      return () => import('remotePlugins/ErrorReporting');
    case PluginName.ExternalAnonymousId:
      return () => import('remotePlugins/ExternalAnonymousId');
    case PluginName.GoogleLinker:
      return () => import('remotePlugins/GoogleLinker');
    case PluginName.NativeDestinationQueue:
      return () => import('remotePlugins/NativeDestinationQueue');
    case PluginName.StorageEncryption:
      return () => import('remotePlugins/StorageEncryption');
    case PluginName.StorageEncryptionLegacy:
      return () => import('remotePlugins/StorageEncryptionLegacy');
    case PluginName.XhrQueue:
      return () => import('remotePlugins/XhrQueue');
    default:
      return undefined;
  }
};

/**
 * Map of active plugin names to their dynamic import
 */
const modernBuildPluginImports = (
  activePluginNames: PluginName[],
): PluginMap<Promise<ExtensionPlugin>> => {
  const remotePlugins: PluginMap<Promise<ExtensionPlugin>> = {};

  activePluginNames.forEach(pluginName => {
    if (remotePluginNames.includes(pluginName)) {
      const lazyLoadImport = getFederatedModuleImport(pluginName);
      if (lazyLoadImport) {
        remotePlugins[pluginName] = lazyLoadImport;
      }
    }
  });

  return remotePlugins;
};

export { modernBuildPluginImports };
