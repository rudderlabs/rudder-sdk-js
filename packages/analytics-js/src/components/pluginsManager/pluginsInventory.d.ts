import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { PluginMap } from './types';
/**
 * Map of mandatory plugin names and direct imports
 */
declare const getMandatoryPluginsMap: () => PluginMap;
declare const pluginsInventory: PluginMap;
declare const remotePluginsInventory: (
  activePluginNames: PluginName[],
) => PluginMap<Promise<ExtensionPlugin>>;
export { pluginsInventory, remotePluginsInventory, getMandatoryPluginsMap };
