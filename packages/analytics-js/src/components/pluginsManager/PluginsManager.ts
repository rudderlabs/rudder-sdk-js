import { PluginEngine, defaultPluginEngine } from '@rudderstack/analytics-js/npmPackages/js-plugin';

// TODO: implement the engine, pass state, logger etc
class PluginsManager {
  engine: PluginEngine;

  constructor() {
    this.engine = defaultPluginEngine;
  }

  invoke(extPoint?: string, ...args: any[]): unknown {
    return this.engine.invoke(extPoint, ...args);
  }
}

const defaultPluginManager = new PluginsManager();

export { PluginsManager, defaultPluginManager };
