import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

export type PluginMap<T = ExtensionPlugin> = Record<PluginName, () => T>;

export type PluginsGroup = {
  configurationStatus: () => boolean;
  configurationStatusStr: string;
  activePluginName?: PluginName;
  supportedPlugins: PluginName[];
  basePlugins?: PluginName[];
  shouldAddMissingPlugins?: boolean;
};
