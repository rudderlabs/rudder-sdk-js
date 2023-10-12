import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
/**
 * List of plugin names that are loaded as direct imports in all builds
 */
declare const localPluginNames: PluginName[];
/**
 * List of plugin names that are loaded as dynamic imports in modern builds
 */
declare const pluginNamesList: PluginName[];
export { localPluginNames, pluginNamesList };
