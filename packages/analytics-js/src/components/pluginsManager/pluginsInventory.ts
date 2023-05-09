import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import { PluginMap, PluginName } from './types';
import { legacyBuildPluginImports } from './legacyBuildPluginImports';
import { modernBuildPluginImports } from './modernBuildPluginImports';

const getMandatoryPluginsMap = (): PluginMap => ({});

const getOptionalPluginsMap = (): PluginMap => {
  if (!__BUNDLE_ALL_PLUGINS__) {
    return {};
  }

  return {
    ...((legacyBuildPluginImports && legacyBuildPluginImports()) || {}),
  };
};

const getRemotePluginsMap = (
  activePluginNames: PluginName[],
): PluginMap<Promise<ExtensionPlugin>> =>
  (modernBuildPluginImports && modernBuildPluginImports(activePluginNames)) || {};

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
