import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { PluginMap } from './types';
import { getBundledBuildPluginImports } from './bundledBuildPluginImports';
import { federatedModulesBuildPluginImports } from './federatedModulesBuildPluginImports';

/**
 * Map of mandatory plugin names and direct imports
 */
const getMandatoryPluginsMap = (): PluginMap => ({}) as PluginMap;

/**
 * Map of optional plugin names and direct imports for legacy builds
 */
const getOptionalPluginsMap = (): PluginMap => {
  if (!__BUNDLE_ALL_PLUGINS__) {
    return {} as PluginMap;
  }

  return getBundledBuildPluginImports();
};

/**
 * Map of optional plugin names and dynamic imports for modern builds
 */
const getRemotePluginsMap = (
  activePluginNames: PluginName[],
): PluginMap<Promise<ExtensionPlugin>> => {
  if (__BUNDLE_ALL_PLUGINS__) {
    return {} as PluginMap<Promise<ExtensionPlugin>>;
  }

  return federatedModulesBuildPluginImports?.(activePluginNames) || {};
};

const pluginsInventory: PluginMap = {
  ...getMandatoryPluginsMap(),
  ...getOptionalPluginsMap(),
};

const remotePluginsInventory = (
  activePluginNames: PluginName[],
): PluginMap<Promise<ExtensionPlugin>> => ({
  ...getRemotePluginsMap(activePluginNames),
});

export { pluginsInventory, remotePluginsInventory, getMandatoryPluginsMap };
