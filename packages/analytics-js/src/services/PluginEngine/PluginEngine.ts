import { isFunction } from '@rudderstack/analytics-js-common/utilities/checks';
import { getValueByPath, hasValueByPath } from '@rudderstack/analytics-js-common/utilities/object';
import type {
  ExtensionPlugin,
  IPluginEngine,
  PluginEngineConfig,
} from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { PLUGIN_ENGINE } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { defaultLogger } from '../Logger';
import {
  PLUGIN_ALREADY_EXISTS_ERROR,
  PLUGIN_DEPS_ERROR,
  PLUGIN_ENGINE_BUG_ERROR,
  PLUGIN_EXT_POINT_INVALID_ERROR,
  PLUGIN_EXT_POINT_MISSING_ERROR,
  PLUGIN_INVOCATION_ERROR,
  PLUGIN_NAME_MISSING_ERROR,
  PLUGIN_NOT_FOUND_ERROR,
} from '../../constants/logMessages';

// TODO: create chained invoke to take the output frm first plugin and pass
//  to next or return the value if it is the last one instead of an array per
//  plugin that is the normal invoke
// TODO: add invoke method for extension point that we know only one plugin can be used. add invokeMultiple and invokeSingle methods
class PluginEngine implements IPluginEngine {
  plugins: ExtensionPlugin[] = [];
  byName: Record<string, ExtensionPlugin> = {};
  cache: Record<string, ExtensionPlugin[]> = {};
  config: PluginEngineConfig = { throws: true };
  logger?: ILogger;

  constructor(options: PluginEngineConfig = {}, logger?: ILogger) {
    this.config = {
      throws: true,
      ...options,
    };

    this.logger = logger;
  }

  register(plugin: ExtensionPlugin, state?: Record<string, any>) {
    if (!plugin.name) {
      const errorMessage = PLUGIN_NAME_MISSING_ERROR(PLUGIN_ENGINE);
      if (this.config.throws) {
        throw new Error(errorMessage);
      } else {
        this.logger?.error(errorMessage, plugin);
      }
    }

    if (this.byName[plugin.name]) {
      const errorMessage = PLUGIN_ALREADY_EXISTS_ERROR(PLUGIN_ENGINE, plugin.name);
      if (this.config.throws) {
        throw new Error(errorMessage);
      } else {
        this.logger?.error(errorMessage);
      }
    }

    this.cache = {};
    this.plugins = this.plugins.slice();
    let pos = this.plugins.length;

    this.plugins.forEach((pluginItem: ExtensionPlugin, index: number) => {
      if (pluginItem.deps?.includes(plugin.name)) {
        pos = Math.min(pos, index);
      }
    });

    this.plugins.splice(pos, 0, plugin);

    this.byName[plugin.name] = plugin;

    if (isFunction(plugin.initialize)) {
      plugin.initialize(state);
    }
  }

  unregister(name: string) {
    const plugin = this.byName[name];

    if (!plugin) {
      const errorMessage = PLUGIN_NOT_FOUND_ERROR(PLUGIN_ENGINE, name);
      if (this.config.throws) {
        throw new Error(errorMessage);
      } else {
        this.logger?.error(errorMessage);
      }
    }

    const index = this.plugins.indexOf(plugin as ExtensionPlugin);

    if (index === -1) {
      const errorMessage = PLUGIN_ENGINE_BUG_ERROR(PLUGIN_ENGINE, name);
      if (this.config.throws) {
        throw new Error(errorMessage);
      } else {
        this.logger?.error(errorMessage);
      }
    }

    this.cache = {};
    delete this.byName[name];
    this.plugins = this.plugins.slice();
    this.plugins.splice(index, 1);
  }

  getPlugin(name: string): ExtensionPlugin | undefined {
    return this.byName[name];
  }

  getPlugins(extPoint?: string): ExtensionPlugin[] {
    const lifeCycleName = extPoint ?? '.';

    if (!this.cache[lifeCycleName]) {
      this.cache[lifeCycleName] = this.plugins.filter(plugin => {
        if (plugin.deps?.some(dependency => !this.byName[dependency])) {
          // If deps not exist, then not load it.
          const notExistDeps = plugin.deps.filter(dependency => !this.byName[dependency]);
          this.logger?.error(PLUGIN_DEPS_ERROR(PLUGIN_ENGINE, plugin.name, notExistDeps));
          return false;
        }
        return lifeCycleName === '.' ? true : hasValueByPath(plugin, lifeCycleName);
      });
    }

    return this.cache[lifeCycleName] as ExtensionPlugin[];
  }

  // This method allows to process this.plugins so that it could
  // do some unified pre-process before application starts.
  processRawPlugins(callback: (plugins: ExtensionPlugin[]) => any) {
    callback(this.plugins);
    this.cache = {};
  }

  invoke<T = any>(extPoint?: string, allowMultiple = true, ...args: any[]): Nullable<T>[] {
    let extensionPointName = extPoint;

    if (!extensionPointName) {
      throw new Error(PLUGIN_EXT_POINT_MISSING_ERROR);
    }

    const noCall = extensionPointName.startsWith('!');
    const throws = this.config.throws ?? extensionPointName.endsWith('!');

    // eslint-disable-next-line unicorn/better-regex
    extensionPointName = extensionPointName.replace(/(^!|!$)/g, '');

    if (!extensionPointName) {
      throw new Error(PLUGIN_EXT_POINT_INVALID_ERROR);
    }

    const extensionPointNameParts = extensionPointName.split('.');
    extensionPointNameParts.pop();

    const pluginMethodPath = extensionPointNameParts.join('.');
    const pluginsToInvoke = allowMultiple
      ? this.getPlugins(extensionPointName)
      : [this.getPlugins(extensionPointName)[0] as ExtensionPlugin];

    return pluginsToInvoke.map(plugin => {
      const method = getValueByPath(plugin, extensionPointName as string);

      if (!isFunction(method) || noCall) {
        return method;
      }

      try {
        return method.apply(getValueByPath(plugin, pluginMethodPath), args);
      } catch (err) {
        // When a plugin failed, doesn't break the app
        if (throws) {
          throw err;
        } else {
          this.logger?.error(
            PLUGIN_INVOCATION_ERROR(PLUGIN_ENGINE, extensionPointName, plugin.name),
            err,
          );
        }
      }

      return null;
    });
  }

  invokeSingle<T = any>(extPoint?: string, ...args: any[]): Nullable<T> {
    return this.invoke(extPoint, false, ...args)[0];
  }

  invokeMultiple<T = any>(extPoint?: string, ...args: any[]): Nullable<T>[] {
    return this.invoke(extPoint, true, ...args);
  }
}

const defaultPluginEngine = new PluginEngine({ throws: true }, defaultLogger);

export { PluginEngine, defaultPluginEngine };
