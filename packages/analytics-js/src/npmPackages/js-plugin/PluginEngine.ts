import { GenericObject } from '@rudderstack/analytics-js/types';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import {
  getValueByPath,
  hasValueByPath,
} from '@rudderstack/analytics-js/components/utilities/object';
import { isPluginEngineDebugMode } from '@rudderstack/analytics-js/npmPackages/js-plugin/debug';

export interface ExtensionPoint {
  [lifeCycleName: string]: (...args: any[]) => unknown;
}

/**
 * ExtensionPoint can be nested, e.g. 'sdk.initialize.phase1'
 * When index signature is provided, every key have to match the type, the types
 * for 'name', 'deps', order,  and 'initialize' is added as index signature.
 */
export interface LifeCyclePlugin {
  name: string;
  initialize?: () => void;
  deps?: string[];
  order?: number;
  [key: string]:
    | string
    | (() => void)
    | ExtensionPoint
    | ((...args: any[]) => unknown)
    | string[]
    | number
    | undefined;
}

export type PluginEngineConfig = {
  throws?: boolean | RegExp;
};

class PluginEngine {
  plugins: LifeCyclePlugin[];
  byName: GenericObject<LifeCyclePlugin>;
  cache: GenericObject<LifeCyclePlugin[]>;
  config: PluginEngineConfig;

  constructor(options: PluginEngineConfig = {}) {
    this.plugins = [];
    this.byName = {};
    this.cache = {};
    this.config = { ...options };
  }

  register(plugin: LifeCyclePlugin) {
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

    this.plugins.forEach((pluginItem: LifeCyclePlugin, index: number) => {
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

  getPlugin(name: string): LifeCyclePlugin | undefined {
    return this.byName[name];
  }

  getPlugins(extPoint?: string): LifeCyclePlugin[] {
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
  processRawPlugins(callback: (plugins: LifeCyclePlugin[]) => any) {
    callback(this.plugins);
    this.cache = {};
  }

  invoke(extPoint?: string, ...args: any[]): unknown {
    let lifeCycleName = extPoint;

    if (!lifeCycleName) {
      throw new Error('error: Invoke on plugin should have a lifeCycleName');
    }

    const noCall = /^!/.test(lifeCycleName);
    const throws = this.config.throws || /!$/.test(lifeCycleName);

    lifeCycleName = lifeCycleName.replace(/^!|!$/g, '');

    if (!lifeCycleName) {
      throw new Error('error: Invoke on plugin should have a valid lifeCycleName');
    }

    const lifeCycleNameParts = lifeCycleName.split('.');
    lifeCycleNameParts.pop();

    const obj = lifeCycleNameParts.join('.');

    return this.getPlugins(lifeCycleName).map(plugin => {
      const method = getValueByPath(plugin, lifeCycleName as string);

      if (!isFunction(method) || noCall) {
        return method;
      }

      try {
        if (isPluginEngineDebugMode) {
          console.log('Before', plugin.name, lifeCycleName, args);
        }

        return method.apply(getValueByPath(plugin, obj), args);
      } catch (err) {
        // When a plugin failed, doesn't break the app
        console.log(`error: Failed to invoke plugin: ${plugin.name}!${lifeCycleName}`);

        if (throws) {
          throw err;
        } else {
          console.log(err);
        }
      } finally {
        if (isPluginEngineDebugMode) {
          console.log('After ', plugin.name, lifeCycleName, args);
        }
      }

      return null;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  sort(arr: LifeCyclePlugin[], sortProp = 'order') {
    const LAST_ITEM_ORDER_INDEX = 1000000;
    arr.sort((a: LifeCyclePlugin, b: LifeCyclePlugin): number => {
      // eslint-disable-next-line no-prototype-builtins
      const order1 = a.hasOwnProperty(sortProp) ? (a[sortProp] as number) : LAST_ITEM_ORDER_INDEX;
      // eslint-disable-next-line no-prototype-builtins
      const order2 = b.hasOwnProperty(sortProp) ? (b[sortProp] as number) : LAST_ITEM_ORDER_INDEX;

      return order1 - order2;
    });
  }
}

const pluginEngineInstance = new PluginEngine({ throws: true });

export { PluginEngine, pluginEngineInstance };
