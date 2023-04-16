import { defaultPluginEngine } from '@rudderstack/analytics-js/npmPackages/js-plugin';
import {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import { state } from '@rudderstack/analytics-js/state';
import { LifecycleStatus } from '@rudderstack/analytics-js/state/types';
import { dummyPlugins, dummyRemotePlugins } from '@rudderstack/analytics-js/plugins/dummyToDelete';
import { externalAnonymousId } from '@rudderstack/analytics-js/plugins/externalAnonymousId';
import { IPluginsManager } from './types';
import { pluginsInventory, remotePluginsInventory } from './pluginsInventory';

// TODO: define types for plugins
// TODO: In register also pass automatically the state to all plugins
// TODO: copy the source of js-plugin so we can extend to to auto pass GlobalState
// TODO: we may want to add chained plugins that pass their value to the next one
// TODO: add retry mechanism for getting remote plugins
// TODO: implement the engine, pass state, logger etc
class PluginsManager implements IPluginsManager {
  engine: IPluginEngine;

  constructor() {
    this.engine = defaultPluginEngine;
  }

  // TODO: this is just to test plugins until the PluginsManager is developed
  init() {
    this.registerLocalPlugins();
    this.registerRemotePlugins();

    // TODO: fix await until all remote plugins have been fetched, this can be
    //  done using the initialize function of the plugins with a callback to
    //  notify state that the plugin is loaded and calculate signal when all are
    //  loaded, once all loaded then set status to pluginsReady
    window.setTimeout(() => {
      state.lifecycle.status.value = LifecycleStatus.PluginsReady;
    }, 3000);
  }

  registerLocalPlugins() {
    Object.values(pluginsInventory).forEach(localPlugin => {
      this.engine.register(localPlugin());
    });
  }

  registerRemotePlugins() {
    Object.values(remotePluginsInventory).forEach(async remotePlugin => {
      await remotePlugin().then((remotePluginModule: any) =>
        this.engine.register(remotePluginModule.default()),
      );
    });
  }

  invoke<T = any>(extPoint?: string, ...args: any[]): T[] {
    return this.engine.invoke(extPoint, ...args);
  }

  register(plugins: ExtensionPlugin[]) {
    plugins.forEach(plugin => this.engine.register(plugin));
  }

  // TODO: Implement reset API instead
  unregisterLocalPlugins() {
    Object.values(pluginsInventory).forEach(localPlugin => {
      this.engine.unregister(localPlugin().name);
    });
  }
}

const defaultPluginManager = new PluginsManager();

export { PluginsManager, defaultPluginManager };
