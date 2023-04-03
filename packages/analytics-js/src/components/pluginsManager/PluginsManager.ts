import { defaultPluginEngine } from '@rudderstack/analytics-js/npmPackages/js-plugin';
import {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import { state } from '@rudderstack/analytics-js/state';
import { dummyPlugins, dummyRemotePlugins } from '@rudderstack/analytics-js/plugins/dummyToDelete';
import { IPluginsManager } from './types';

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
    this.registerDummyPlugins();

    // TODO: fix await until all remote plugins have been fetched, this can be
    //  done using the initialize function of the plugins with a callback to
    //  notify state that the plugin is loaded and calculate signal when all are
    //  loaded, once all loaded then set status to pluginsReady
    window.setTimeout(() => {
      state.lifecycle.status.value = 'pluginsReady';
    }, 3000);
  }

  // TODO: remove the dummy plugins after implementing proper ones
  registerDummyPlugins() {
    this.register(dummyPlugins);

    dummyRemotePlugins.forEach(async remotePlugin => {
      await remotePlugin().then(remotePluginModule =>
        defaultPluginEngine.register(remotePluginModule.default()),
      );
    });
  }

  registerLocalPlugins() {}

  getRemotePluginsList() {
    const storageEncryptionV1 = () => import('remotePlugins/StorageEncryptionV1');
    const googleLinker = () => import('remotePlugins/GoogleLinker');

    const remotePluginsList = [storageEncryptionV1, googleLinker];

    return remotePluginsList;
  }

  registerRemotePlugins() {
    this.getRemotePluginsList().forEach(async remotePlugin => {
      await remotePlugin().then(remotePluginModule =>
        defaultPluginEngine.register(remotePluginModule.default()),
      );
    });
  }

  invoke<T = any>(extPoint?: string, ...args: any[]): T[] {
    return this.engine.invoke(extPoint, ...args);
  }

  register(plugins: ExtensionPlugin[]) {
    plugins.forEach(plugin => this.engine.register(plugin));
  }
}

const defaultPluginManager = new PluginsManager();

export { PluginsManager, defaultPluginManager };
