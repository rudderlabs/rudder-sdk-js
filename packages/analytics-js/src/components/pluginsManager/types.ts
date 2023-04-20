import {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js/npmPackages/js-plugin/types';

export interface IPluginsManager {
  engine: IPluginEngine;
  availablePlugins: string[];
  init(): void;
  setActivePlugins(): void;
  invoke<T = any>(extPoint?: string, ...args: any[]): T[];
  register(plugins: ExtensionPlugin[]): void;
}

export type PluginMap<T = ExtensionPlugin> = Record<string, () => T>;
