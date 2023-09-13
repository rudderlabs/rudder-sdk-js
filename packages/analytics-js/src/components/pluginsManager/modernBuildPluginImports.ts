import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { PluginMap } from './types';
import { remotePluginNames } from './pluginNames';

/**
 * Get the lazy loaded dynamic import for a plugin name
 */
const getFederatedModuleImport = (
  pluginName: PluginName,
): (() => Promise<ExtensionPlugin>) | undefined => {
  switch (pluginName) {
    case PluginName.BeaconQueue:
      return () => import('rudderAnalyticsRemotePlugins/BeaconQueue');
    case PluginName.Bugsnag:
      return () => import('rudderAnalyticsRemotePlugins/Bugsnag');
    case PluginName.DeviceModeDestinations:
      return () => import('rudderAnalyticsRemotePlugins/DeviceModeDestinations');
    case PluginName.DeviceModeTransformation:
      return () => import('rudderAnalyticsRemotePlugins/DeviceModeTransformation');
    case PluginName.ErrorReporting:
      return () => import('rudderAnalyticsRemotePlugins/ErrorReporting');
    case PluginName.ExternalAnonymousId:
      return () => import('rudderAnalyticsRemotePlugins/ExternalAnonymousId');
    case PluginName.GoogleLinker:
      return () => import('rudderAnalyticsRemotePlugins/GoogleLinker');
    case PluginName.KetchConsentManager:
      return () => import('rudderAnalyticsRemotePlugins/KetchConsentManager');
    case PluginName.NativeDestinationQueue:
      return () => import('rudderAnalyticsRemotePlugins/NativeDestinationQueue');
    case PluginName.OneTrustConsentManager:
      return () => import('rudderAnalyticsRemotePlugins/OneTrustConsentManager');
    case PluginName.StorageEncryption:
      return () => import('rudderAnalyticsRemotePlugins/StorageEncryption');
    case PluginName.StorageEncryptionLegacy:
      return () => import('rudderAnalyticsRemotePlugins/StorageEncryptionLegacy');
    case PluginName.StorageMigrator:
      return () => import('rudderAnalyticsRemotePlugins/StorageMigrator');
    case PluginName.XhrQueue:
      return () => import('rudderAnalyticsRemotePlugins/XhrQueue');
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
