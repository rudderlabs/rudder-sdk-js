import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { REMOTE_PLUGIN_FILE_PREFIX, REMOTE_PLUGIN_FILE_SUFFIX } from '../../constants/urls';
import { state } from '../../state';
import type { PluginMap } from './types';
import { pluginNamesList } from './pluginNames';

/**
 * A function that determines the URL of a plugin module in the plugins remote:
 * `<pluginsCDNPath>/rsa-plugins-remote-<Plugin>.min.js`.
 * The plugins CDN path (load option value, e.g. a proxy, or the default CDN path) is set before
 * any remote plugin is requested; the build time base path is only a fallback.
 * @param pluginName Name of the plugin, which is also its expose name in the plugins remote
 * @returns The URL of the plugin module
 */
const getRemotePluginUrl = (pluginName: PluginName): string => {
  const pluginsCDNPath = state.lifecycle.pluginsCDNPath.value;
  const basePath = pluginsCDNPath ? `${pluginsCDNPath}/` : __REMOTE_PLUGINS_BASE_PATH__;

  return `${basePath}${REMOTE_PLUGIN_FILE_PREFIX}${pluginName}${REMOTE_PLUGIN_FILE_SUFFIX}`;
};

/**
 * Get the lazy loaded remote module for a plugin name. The plugins remote shares nothing with
 * the SDK, so each plugin is a plain ES module, loaded with a native dynamic import (left as is
 * by the bundlers of npm consumers too).
 * @param pluginName Name of the plugin
 * @returns A function that imports the plugin module, or `undefined` for an unknown plugin name.
 * The returned promise rejects when the module cannot be fetched or evaluated
 */
const getFederatedModuleImport = (
  pluginName: PluginName,
): (() => Promise<ExtensionPlugin>) | undefined => {
  if (!pluginNamesList.includes(pluginName)) {
    return undefined;
  }

  return () =>
    import(
      /* webpackIgnore: true */ /* @vite-ignore */ getRemotePluginUrl(pluginName)
    ) as Promise<ExtensionPlugin>;
};

/**
 * Map of active plugin names to their dynamic import
 * @param activePluginNames Names of the plugins to load from the plugins remote
 * @returns The lazy imports of the known plugins, keyed by plugin name; unknown names are skipped
 */
const federatedModulesBuildPluginImports = (
  activePluginNames: PluginName[],
): PluginMap<Promise<ExtensionPlugin>> => {
  const remotePlugins = {} as PluginMap<Promise<ExtensionPlugin>>;

  activePluginNames.forEach(pluginName => {
    const lazyLoadImport = getFederatedModuleImport(pluginName);
    if (lazyLoadImport) {
      remotePlugins[pluginName] = lazyLoadImport;
    }
  });

  return remotePlugins;
};

export { federatedModulesBuildPluginImports };
