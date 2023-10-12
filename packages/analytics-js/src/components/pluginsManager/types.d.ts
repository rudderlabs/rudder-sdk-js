import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
export type PluginMap<T = ExtensionPlugin> = Record<PluginName, () => T>;
