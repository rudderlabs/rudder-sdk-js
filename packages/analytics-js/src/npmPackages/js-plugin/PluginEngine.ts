import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import {
  getValueByPath,
  hasValueByPath,
} from '@rudderstack/analytics-js/components/utilities/object';
import { isPluginEngineDebugMode } from './debug';
import { ExtensionPlugin, IPluginEngine, PluginEngineConfig } from './types';

// TODO: pass and use here the logger and the error handler
// TODO: make this a singleton in the constructor
// TODO: create chained invoke to take the output frm first plugin and pass
//  to next or return the value if it is the last one instead of an array per
//  plugin that is the normal invoke
class PluginEngine implements IPluginEngine {
  plugins: ExtensionPlugin[];
  byName: Record<string, ExtensionPlugin>;
  cache: Record<string, ExtensionPlugin[]>;
  config: PluginEngineConfig;

  constructor(options: PluginEngineConfig = {}) {
    this.plugins = [];
    this.byName = {};
    this.cache = {};
    this.config = { ...options };
  }

  register(plugin: ExtensionPlugin) {
    if (!plugin.name) {
      console.log('error: Every plugin should have a name.');
      console.log(plugin);
      throw new Error('error: Every plugin should have a name.');
    }

    if (this.byName[plugin.name]) {
      throw new Error(`error: Plugin "${plugin.name}" already exits.`);
    }

    this.cache = {};
    this.plugins = this.plugins.slice();
    let pos = this.plugins.length;

    this.plugins.forEach((pluginItem: ExtensionPlugin, index: number) => {
      if (pluginItem.deps && pluginItem.deps.includes(plugin.name)) {
        pos = Math.min(pos, index);
      }
    });

    this.plugins.splice(pos, 0, plugin);

    this.byName[plugin.name] = plugin;

    if (plugin.initialize && isFunction(plugin.initialize)) {
      plugin.initialize();
    }
  }

  unregister(name: string) {
    const plugin = this.byName[name];

    if (!plugin) {
      throw new Error(`error: Plugin "${name}" does't exist.`);
    }

    const index = this.plugins.indexOf(plugin);

    if (index === -1) {
      throw new Error(
        `error: Plugin "${name}" does't exist in plugins but in byName. This seems to be a bug of PluginEngine.`,
      );
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
    const lifeCycleName = extPoint || '.';

    if (!this.cache[lifeCycleName]) {
      this.cache[lifeCycleName] = this.plugins.filter(plugin => {
        if (plugin.deps && plugin.deps.some(dependency => !this.byName[dependency])) {
          // If deps not exist, then not load it.
          const notExistDeps = plugin.deps.filter(dependency => !this.byName[dependency]);
          console.log(
            `waring: Plugin ${plugin.name} is not loaded because its deps do not exist: ${notExistDeps}.`,
          );
          return false;
        }
        return lifeCycleName === '.' ? true : hasValueByPath(plugin, lifeCycleName);
      });
    }

    return this.cache[lifeCycleName];
  }

  // This method allows to process this.plugins so that it could
  // do some unified pre-process before application starts.
  processRawPlugins(callback: (plugins: ExtensionPlugin[]) => any) {
    callback(this.plugins);
    this.cache = {};
  }

  invoke<T = any>(extPoint?: string, ...args: any[]): T[] {
    let extensionPointName = extPoint;

    if (!extensionPointName) {
      throw new Error('error: Invoke on plugin should have a extensionPointName');
    }

    const noCall = /^!/.test(extensionPointName);
    const throws = this.config.throws || /!$/.test(extensionPointName);

    extensionPointName = extensionPointName.replace(/^!|!$/g, '');

    if (!extensionPointName) {
      throw new Error('error: Invoke on plugin should have a valid extensionPointName');
    }

    const extensionPointNameParts = extensionPointName.split('.');
    extensionPointNameParts.pop();

    const obj = extensionPointNameParts.join('.');

    return this.getPlugins(extensionPointName).map(plugin => {
      const method = getValueByPath(plugin, extensionPointName as string);

      if (!isFunction(method) || noCall) {
        return method;
      }

      try {
        if (isPluginEngineDebugMode) {
          console.log('Before', plugin.name, extensionPointName, ...args);
        }

        return method.apply(getValueByPath(plugin, obj), args);
      } catch (err) {
        // When a plugin failed, doesn't break the app
        console.log(`error: Failed to invoke plugin: ${plugin.name}!${extensionPointName}`);

        if (throws) {
          throw err;
        } else {
          console.log(err);
        }
      } finally {
        if (isPluginEngineDebugMode) {
          console.log('After ', plugin.name, extensionPointName, ...args);
        }
      }

      return null;
    });
  }
}

const defaultPluginEngine = new PluginEngine({ throws: true });

export { PluginEngine, defaultPluginEngine };
