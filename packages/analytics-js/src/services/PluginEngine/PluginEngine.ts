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
  private_plugins: ExtensionPlugin[] = [];
  private_byName: Record<string, ExtensionPlugin> = {};
  private_cache: Record<string, ExtensionPlugin[]> = {};
  private_config: PluginEngineConfig = { throws: true };
  private_logger?: ILogger;

  constructor(options: PluginEngineConfig = {}, logger?: ILogger) {
    this.private_config = {
      throws: true,
      ...options,
    };

    this.private_logger = logger;
  }

  register(plugin: ExtensionPlugin, state?: Record<string, any>) {
    if (!plugin.name) {
      const errorMessage = PLUGIN_NAME_MISSING_ERROR(PLUGIN_ENGINE);
      if (this.private_config.throws) {
        throw new Error(errorMessage);
      } else {
        this.private_logger?.error(errorMessage, plugin);
      }
    }

    if (this.private_byName[plugin.name]) {
      const errorMessage = PLUGIN_ALREADY_EXISTS_ERROR(PLUGIN_ENGINE, plugin.name);
      if (this.private_config.throws) {
        throw new Error(errorMessage);
      } else {
        this.private_logger?.error(errorMessage);
      }
    }

    this.private_cache = {};
    this.private_plugins = this.private_plugins.slice();
    let pos = this.private_plugins.length;

    this.private_plugins.forEach((pluginItem: ExtensionPlugin, index: number) => {
      if (pluginItem.deps?.includes(plugin.name)) {
        pos = Math.min(pos, index);
      }
    });

    this.private_plugins.splice(pos, 0, plugin);

    this.private_byName[plugin.name] = plugin;

    if (isFunction(plugin.initialize)) {
      plugin.initialize(state);
    }
  }

  unregister(name: string) {
    const plugin = this.private_byName[name];

    if (!plugin) {
      const errorMessage = PLUGIN_NOT_FOUND_ERROR(PLUGIN_ENGINE, name);
      if (this.private_config.throws) {
        throw new Error(errorMessage);
      } else {
        this.private_logger?.error(errorMessage);
      }
    }

    const index = this.private_plugins.indexOf(plugin as ExtensionPlugin);

    if (index === -1) {
      const errorMessage = PLUGIN_ENGINE_BUG_ERROR(PLUGIN_ENGINE, name);
      if (this.private_config.throws) {
        throw new Error(errorMessage);
      } else {
        this.private_logger?.error(errorMessage);
      }
    }

    this.private_cache = {};
    delete this.private_byName[name];
    this.private_plugins = this.private_plugins.slice();
    this.private_plugins.splice(index, 1);
  }

  getPlugin(name: string): ExtensionPlugin | undefined {
    return this.private_byName[name];
  }

  getPlugins(extPoint?: string): ExtensionPlugin[] {
    const lifeCycleName = extPoint ?? '.';

    if (!this.private_cache[lifeCycleName]) {
      this.private_cache[lifeCycleName] = this.private_plugins.filter(plugin => {
        if (plugin.deps?.some(dependency => !this.private_byName[dependency])) {
          // If deps not exist, then not load it.
          const notExistDeps = plugin.deps.filter(dependency => !this.private_byName[dependency]);
          this.private_logger?.error(PLUGIN_DEPS_ERROR(PLUGIN_ENGINE, plugin.name, notExistDeps));
          return false;
        }
        return lifeCycleName === '.' ? true : hasValueByPath(plugin, lifeCycleName);
      });
    }

    return this.private_cache[lifeCycleName] as ExtensionPlugin[];
  }

  private_invoke<T = any>(extPoint?: string, allowMultiple = true, ...args: any[]): Nullable<T>[] {
    let extensionPointName = extPoint;

    if (!extensionPointName) {
      throw new Error(PLUGIN_EXT_POINT_MISSING_ERROR);
    }

    const noCall = extensionPointName.startsWith('!');
    const throws = this.private_config.throws ?? extensionPointName.endsWith('!');

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
          this.private_logger?.error(
            PLUGIN_INVOCATION_ERROR(PLUGIN_ENGINE, extensionPointName, plugin.name),
            err,
          );
        }
      }

      return null;
    });
  }

  invokeSingle<T = any>(extPoint?: string, ...args: any[]): Nullable<T> {
    return this.private_invoke(extPoint, false, ...args)[0];
  }

  invokeMultiple<T = any>(extPoint?: string, ...args: any[]): Nullable<T>[] {
    return this.private_invoke(extPoint, true, ...args);
  }
}

const defaultPluginEngine = new PluginEngine({ throws: true }, defaultLogger);

export { PluginEngine, defaultPluginEngine };
