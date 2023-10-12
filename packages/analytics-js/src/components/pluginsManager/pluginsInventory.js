import { getBundledBuildPluginImports } from './bundledBuildPluginImports';
import { federatedModulesBuildPluginImports } from './federatedModulesBuildPluginImports';
/**
 * Map of mandatory plugin names and direct imports
 */
const getMandatoryPluginsMap = () => ({});
/**
 * Map of optional plugin names and direct imports for legacy builds
 */
const getOptionalPluginsMap = () => {
  if (!__BUNDLE_ALL_PLUGINS__) {
    return {};
  }
  return getBundledBuildPluginImports();
};
/**
 * Map of optional plugin names and dynamic imports for modern builds
 */
const getRemotePluginsMap = activePluginNames => {
  if (__BUNDLE_ALL_PLUGINS__) {
    return {};
  }
  return (
    (federatedModulesBuildPluginImports === null || federatedModulesBuildPluginImports === void 0
      ? void 0
      : federatedModulesBuildPluginImports(activePluginNames)) || {}
  );
};
const pluginsInventory = {
  ...getMandatoryPluginsMap(),
  ...getOptionalPluginsMap(),
};
const remotePluginsInventory = activePluginNames => ({
  ...getRemotePluginsMap(activePluginNames),
});
export { pluginsInventory, remotePluginsInventory, getMandatoryPluginsMap };
