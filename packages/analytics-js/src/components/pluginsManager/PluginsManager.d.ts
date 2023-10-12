import {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js-common/types/PluginEngine';
import { IPluginsManager, PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
declare class PluginsManager implements IPluginsManager {
  engine: IPluginEngine;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  constructor(engine: IPluginEngine, errorHandler?: IErrorHandler, logger?: ILogger);
  /**
   * Orchestrate the plugin loading and registering
   */
  init(): void;
  /**
   * Update state based on plugin loaded status
   */
  attachEffects(): void;
  /**
   * Determine the list of plugins that should be loaded based on sourceConfig & load options
   */
  getPluginsToLoadBasedOnConfig(): PluginName[];
  /**
   * Determine the list of plugins that should be activated
   */
  setActivePlugins(): void;
  /**
   * Register plugins that are direct imports to PluginEngine
   */
  registerLocalPlugins(): void;
  /**
   * Register plugins that are dynamic imports to PluginEngine
   */
  registerRemotePlugins(): void;
  /**
   * Extension point invoke that allows multiple plugins to be registered to it with error handling
   */
  invokeMultiple<T = any>(extPoint?: string, ...args: any[]): Nullable<T>[];
  /**
   * Extension point invoke that allows a single plugin to be registered to it with error handling
   */
  invokeSingle<T = any>(extPoint?: string, ...args: any[]): Nullable<T>;
  /**
   * Plugin engine register with error handling
   */
  register(plugins: ExtensionPlugin[]): void;
  unregisterLocalPlugins(): void;
  /**
   * Handle errors
   */
  onError(error: unknown, customMessage?: string): void;
}
export { PluginsManager };
