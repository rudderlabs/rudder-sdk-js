import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { PluginMap } from './types';
import { pluginNamesList } from './pluginNames';

const IMPORT_PATH_PREFIX = 'rudderAnalyticsRemotePlugins/';

/**
 * Get the lazy loaded dynamic import for a plugin name
 */
const getFederatedModuleImport = (
  pluginName: PluginName,
): (() => Promise<ExtensionPlugin>) | undefined => {
  switch (pluginName) {
    case 'CustomConsentManager':
      return () => import(`${IMPORT_PATH_PREFIX}CustomConsentManager`);
    case 'DeviceModeDestinations':
      return () => import(`${IMPORT_PATH_PREFIX}DeviceModeDestinations`);
    case 'DeviceModeTransformation':
      return () => import(`${IMPORT_PATH_PREFIX}DeviceModeTransformation`);
    case 'ErrorReporting':
      return () => import(`${IMPORT_PATH_PREFIX}ErrorReporting`);
    case 'ExternalAnonymousId':
      return () => import(`${IMPORT_PATH_PREFIX}ExternalAnonymousId`);
    case 'GoogleLinker':
      return () => import(`${IMPORT_PATH_PREFIX}GoogleLinker`);
    case 'KetchConsentManager':
      return () => import(`${IMPORT_PATH_PREFIX}KetchConsentManager`);
    case 'NativeDestinationQueue':
      return () => import(`${IMPORT_PATH_PREFIX}NativeDestinationQueue`);
    case 'OneTrustConsentManager':
      return () => import(`${IMPORT_PATH_PREFIX}OneTrustConsentManager`);
    case 'StorageEncryption':
      return () => import(`${IMPORT_PATH_PREFIX}StorageEncryption`);
    case 'StorageEncryptionLegacy':
      return () => import(`${IMPORT_PATH_PREFIX}StorageEncryptionLegacy`);
    case 'StorageMigrator':
      return () => import(`${IMPORT_PATH_PREFIX}StorageMigrator`);
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
