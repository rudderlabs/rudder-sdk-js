import {
  ExtensionPlugin,
  IPluginEngine,
  PluginEngineConfig,
} from '@rudderstack/analytics-js-common/types/PluginEngine';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
declare class PluginEngine implements IPluginEngine {
  plugins: ExtensionPlugin[];
  byName: Record<string, ExtensionPlugin>;
  cache: Record<string, ExtensionPlugin[]>;
  config: PluginEngineConfig;
  logger?: ILogger;
  constructor(options?: PluginEngineConfig, logger?: ILogger);
  register(plugin: ExtensionPlugin, state?: Record<string, any>): void;
  unregister(name: string): void;
  getPlugin(name: string): ExtensionPlugin | undefined;
  getPlugins(extPoint?: string): ExtensionPlugin[];
  processRawPlugins(callback: (plugins: ExtensionPlugin[]) => any): void;
  invoke<T = any>(extPoint?: string, allowMultiple?: boolean, ...args: any[]): Nullable<T>[];
  invokeSingle<T = any>(extPoint?: string, ...args: any[]): Nullable<T>;
  invokeMultiple<T = any>(extPoint?: string, ...args: any[]): Nullable<T>[];
}
declare const defaultPluginEngine: PluginEngine;
export { PluginEngine, defaultPluginEngine };
