import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { PluginMap } from './types';
/**
 * Map of active plugin names to their dynamic import
 */
declare const federatedModulesBuildPluginImports: (
  activePluginNames: PluginName[],
) => PluginMap<Promise<ExtensionPlugin>>;
export { federatedModulesBuildPluginImports };
