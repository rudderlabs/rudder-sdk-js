import { PluginEngine, defaultPluginEngine } from '@rudderstack/analytics-js/npmPackages/js-plugin';
import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/PluginEngine';

// TODO: implement the engine, pass state, logger etc
class PluginsManager {
  engine: PluginEngine;

  constructor() {
    this.engine = defaultPluginEngine;
    this.init();
  }

  // TODO: this is just to test plugins until the PluginsManager is developed
  init() {
    this.registerLocalPlugins();
    this.registerRemotePlugins();
  }

  registerLocalPlugins() {}

  getRemotePluginsList() {
    const storageEncryptionV1 = () => import('remotePlugins/StorageEncryptionV1');

    const remotePluginsList = [storageEncryptionV1];

    return remotePluginsList;
  }

  // TODO: fix await until all remote plugins have been fetched, this can be
  //  done using the initialize function of the plugins with a callback to
  //  notify state that the plugin is loaded and calculate signal when all are
  //  loaded
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

  register(plugin: ExtensionPlugin) {
    return this.engine.register(plugin);
  }
}

const defaultPluginManager = new PluginsManager();

export { PluginsManager, defaultPluginManager };
