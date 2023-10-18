import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { PluginMap } from './types';
import { pluginNamesList } from './pluginNames';

/**
 * Get the lazy loaded dynamic import for a plugin name
 */
const getFederatedModuleImport = (
  pluginName: PluginName,
): (() => Promise<ExtensionPlugin>) | undefined => {
  switch (pluginName) {
    case 'BeaconQueue':
      return () => import('rudderAnalyticsRemotePlugins/BeaconQueue');
    case 'Bugsnag':
      return () => import('rudderAnalyticsRemotePlugins/Bugsnag');
    case 'DeviceModeDestinations':
      return () => import('rudderAnalyticsRemotePlugins/DeviceModeDestinations');
    case 'DeviceModeTransformation':
      return () => import('rudderAnalyticsRemotePlugins/DeviceModeTransformation');
    case 'ErrorReporting':
      return () => import('rudderAnalyticsRemotePlugins/ErrorReporting');
    case 'ExternalAnonymousId':
      return () => import('rudderAnalyticsRemotePlugins/ExternalAnonymousId');
    case 'GoogleLinker':
      return () => import('rudderAnalyticsRemotePlugins/GoogleLinker');
    case 'KetchConsentManager':
      return () => import('rudderAnalyticsRemotePlugins/KetchConsentManager');
    case 'NativeDestinationQueue':
      return () => import('rudderAnalyticsRemotePlugins/NativeDestinationQueue');
    case 'OneTrustConsentManager':
      return () => import('rudderAnalyticsRemotePlugins/OneTrustConsentManager');
    case 'StorageEncryption':
      return () => import('rudderAnalyticsRemotePlugins/StorageEncryption');
    case 'StorageEncryptionLegacy':
      return () => import('rudderAnalyticsRemotePlugins/StorageEncryptionLegacy');
    case 'StorageMigrator':
      return () => import('rudderAnalyticsRemotePlugins/StorageMigrator');
    case 'XhrQueue':
      return () => import('rudderAnalyticsRemotePlugins/XhrQueue');
    default:
      return undefined;
  }
};

/**
 * Map of active plugin names to their dynamic import
 */
const federatedModulesBuildPluginImports = (
  activePluginNames: PluginName[],
): PluginMap<Promise<ExtensionPlugin>> => {
  const remotePlugins = {} as PluginMap<Promise<ExtensionPlugin>>;

  activePluginNames.forEach(pluginName => {
    if (pluginNamesList.includes(pluginName)) {
      const lazyLoadImport = getFederatedModuleImport(pluginName);
      if (lazyLoadImport) {
        remotePlugins[pluginName] = lazyLoadImport;
      }
    }
  });

  return remotePlugins;
};

export { federatedModulesBuildPluginImports };
