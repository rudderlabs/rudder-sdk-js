import { ExtensionPlugin } from '@rudderstack/analytics-js/services/PluginEngine/types';
import { PluginMap, PluginName } from './types';
import { legacyBuildPluginImports } from './legacyBuildPluginImports';
import { modernBuildPluginImports } from './modernBuildPluginImports';

const getMandatoryPluginsMap = (): PluginMap => ({});

const getOptionalPluginsMap = (): PluginMap => {
  if (!__BUNDLE_ALL_PLUGINS__) {
    return {};
  }

  return {
    ...(legacyBuildPluginImports?.() || {}),
  };
};

const getRemotePluginsMap = (
  activePluginNames: PluginName[],
): PluginMap<Promise<ExtensionPlugin>> => modernBuildPluginImports?.(activePluginNames) || {};

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
