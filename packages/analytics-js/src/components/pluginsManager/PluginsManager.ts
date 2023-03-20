import { PluginEngine, defaultPluginEngine } from '@rudderstack/analytics-js/npmPackages/js-plugin';
import { ExtensionPlugin } from '@rudderstack/analytics-js/npmPackages/js-plugin/PluginEngine';
import { storageEncryptionV1 } from '@rudderstack/analytics-js/plugins';

// TODO: implement the engine, pass state, logger etc
class PluginsManager {
  engine: PluginEngine;

  constructor() {
    this.engine = defaultPluginEngine;
    this.init();
  }

  // TODO: this is just to test plugins until the PluginsManager is developed
  init() {
    this.register(storageEncryptionV1);
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
