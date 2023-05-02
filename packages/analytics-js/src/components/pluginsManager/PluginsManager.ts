import { defaultPluginEngine } from '@rudderstack/analytics-js/npmPackages/js-plugin';
import {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js/npmPackages/js-plugin/types';
import { state } from '@rudderstack/analytics-js/state';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { batch, effect } from '@preact/signals-core';
import { LifecycleStatus } from '@rudderstack/analytics-js/state/types';
import { IPluginsManager } from './types';
import {
  getMandatoryPluginsMap,
  pluginsInventory,
  remotePluginsInventory,
} from './pluginsInventory';

// TODO: define types for plugins
// TODO: copy the source of js-plugin so we can extend to to auto pass GlobalState
// TODO: we may want to add chained plugins that pass their value to the next one
// TODO: add retry mechanism for getting remote plugins
// TODO: implement the engine, pass state, logger etc
class PluginsManager implements IPluginsManager {
  engine: IPluginEngine;
  availablePlugins: string[];
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  hasErrorHandler = false;
  hasLogger = false;

  constructor(engine: IPluginEngine, errorHandler?: IErrorHandler, logger?: ILogger) {
    this.engine = engine;
    this.availablePlugins = [
      ...Object.keys(pluginsInventory),
      ...Object.keys(remotePluginsInventory),
    ];

    this.errorHandler = errorHandler;
    this.logger = logger;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.hasLogger = Boolean(this.logger);
    this.onError = this.onError.bind(this);
  }

  init() {
    state.lifecycle.status.value = LifecycleStatus.PluginsLoading;
    this.setActivePlugins();
    this.registerLocalPlugins();
    this.registerRemotePlugins();

    // TODO: requested and mandatory should be equal to loaded plus failed
    effect(() => {
      if (
        state.plugins.activePlugins.value.length > 0 &&
        state.plugins.activePlugins.value.length === state.plugins.loadedPlugins.value.length
      ) {
        batch(() => {
          state.plugins.ready.value = true;
          state.lifecycle.status.value = LifecycleStatus.PluginsReady;
        });
      }
    });
  }

  setActivePlugins() {
    // TODO: take this value from configuration via ConfigService and a new loadOption
    state.plugins.requestedPlugins.value = [
      'localTest',
      'localTest2',
      'localTest3',
      'StorageEncryptionV1',
      'GoogleLinker',
      'LoadIntegrations',
      'RemotePlugin',
      'RemotePlugin2',
      'invalidPlugin',
    ];

    // If no plugins have been passed in loadOptions get all available ones
    const requiredPlugins = [
      ...Object.keys(getMandatoryPluginsMap()),
      ...(state.plugins.requestedPlugins.value || Object.keys(pluginsInventory)),
    ];

    const activePlugins: string[] = [];
    const failedPlugins: string[] = [];

    requiredPlugins.forEach(pluginName => {
      if (this.availablePlugins.includes(pluginName)) {
        activePlugins.push(pluginName);
      } else {
        failedPlugins.push(pluginName);
      }
    });

    if (failedPlugins.length > 0) {
      // TODO: should we just log warning instead?
      this.onError(new Error(`Ignoring loading of unknown plugins: ${failedPlugins.join(',')}`));
    }

    // TODO: remove plugins from activePlugins that need to be removed based on loadOptions config values
    batch(() => {
      state.plugins.activePlugins.value = activePlugins;
      state.plugins.failedPlugins.value = failedPlugins;
    });
  }

  registerLocalPlugins() {
    Object.values(pluginsInventory).forEach(localPlugin => {
      this.register([localPlugin()]);
    });
  }

  registerRemotePlugins() {
    Object.values(remotePluginsInventory).forEach(async remotePlugin => {
      await remotePlugin()
        .then((remotePluginModule: any) => this.register([remotePluginModule.default()]))
        .catch(e => {
          this.onError(e);
        });
    });
  }

  invoke<T = any>(extPoint?: string, ...args: any[]): T[] {
    return this.engine.invoke(extPoint, ...args);
  }

  register(plugins: ExtensionPlugin[]) {
    plugins.forEach(plugin => {
      try {
        this.engine.register(plugin, state);
      } catch (e) {
        state.plugins.failedPlugins.value = [...state.plugins.failedPlugins.value, plugin.name];
        this.onError(e);
      }
    });
  }

  /**
   * Handle errors
   */
  onError(error: Error | unknown) {
    if (this.hasErrorHandler) {
      this.errorHandler?.onError(error, 'PluginsManager');
    } else {
      throw error;
    }
  }

  // TODO: Implement reset API instead
  unregisterLocalPlugins() {
    Object.values(pluginsInventory).forEach(localPlugin => {
      this.engine.unregister(localPlugin().name);
    });
  }
}

const defaultPluginManager = new PluginsManager(
  defaultPluginEngine,
  defaultErrorHandler,
  defaultLogger,
);

export { PluginsManager, defaultPluginManager };
