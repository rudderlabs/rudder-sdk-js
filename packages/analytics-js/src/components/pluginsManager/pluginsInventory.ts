import { ExtensionPlugin } from '@rudderstack/common/types/PluginEngine';
import { PluginName } from '@rudderstack/common/types/PluginsManager';
import { PluginMap } from './types';
import { legacyBuildPluginImports } from './legacyBuildPluginImports';
import { modernBuildPluginImports } from './modernBuildPluginImports';

/**
 * Map of mandatory plugin names and direct imports
 */
const getMandatoryPluginsMap = (): PluginMap => ({});

/**
 * Map of optional plugin names and direct imports for legacy builds
 */
const getOptionalPluginsMap = (): PluginMap => {
  if (!__BUNDLE_ALL_PLUGINS__) {
    return {};
  }

  return {
    ...(legacyBuildPluginImports?.() || {}),
  };
};

/**
 * Map of optional plugin names and dynamic imports for modern builds
 */
const getRemotePluginsMap = (
  activePluginNames: PluginName[],
): PluginMap<Promise<ExtensionPlugin>> => {
  if (__BUNDLE_ALL_PLUGINS__) {
    return {};
  }

  return modernBuildPluginImports?.(activePluginNames) || {};
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
