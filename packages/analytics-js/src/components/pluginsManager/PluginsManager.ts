import { batch, effect } from '@preact/signals-core';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js/services/PluginEngine/types';
import { state } from '@rudderstack/analytics-js/state';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { LifecycleStatus } from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';
import { remotePluginNames } from './pluginNames';
import { IPluginsManager, PluginName } from './types';
import {
  getMandatoryPluginsMap,
  pluginsInventory,
  remotePluginsInventory,
} from './pluginsInventory';

// TODO: we may want to add chained plugins that pass their value to the next one
// TODO: add retry mechanism for getting remote plugins
// TODO: add timeout error mechanism for marking remote plugins that failed to load as failed in state
class PluginsManager implements IPluginsManager {
  engine: IPluginEngine;
  errorHandler?: IErrorHandler;
  logger?: ILogger;

  constructor(engine: IPluginEngine, errorHandler?: IErrorHandler, logger?: ILogger) {
    this.engine = engine;

    this.errorHandler = errorHandler;
    this.logger = logger;
    this.onError = this.onError.bind(this);
  }

  init() {
    state.lifecycle.status.value = LifecycleStatus.PluginsLoading;
    this.setActivePlugins();
    this.registerLocalPlugins();
    this.registerRemotePlugins();
    this.attachEffects();
  }

  // eslint-disable-next-line class-methods-use-this
  attachEffects() {
    effect(() => {
      const isAllPluginsReady =
        state.plugins.activePlugins.value.length === 0 ||
        state.plugins.loadedPlugins.value.length + state.plugins.failedPlugins.value.length ===
          state.plugins.totalPluginsToLoad.value;

      if (isAllPluginsReady) {
        batch(() => {
          state.plugins.ready.value = true;
          state.lifecycle.status.value = LifecycleStatus.PluginsReady;
        });
      }
    });
  }

  setActivePlugins() {
    const availablePlugins = [...Object.keys(pluginsInventory), ...remotePluginNames];

    // Merge mandatory and optional plugin name list
    const pluginsToLoad = [
      ...Object.keys(getMandatoryPluginsMap()),
      ...state.plugins.loadOptionsPlugins.value,
    ];

    const activePlugins: string[] = [];
    const failedPlugins: string[] = [];

    pluginsToLoad.forEach(pluginName => {
      if (availablePlugins.includes(pluginName)) {
        activePlugins.push(pluginName);
      } else {
        failedPlugins.push(pluginName);
      }
    });

    if (failedPlugins.length > 0) {
      this.onError(
        new Error(
          `Ignoring loading of unknown plugins: ${failedPlugins.join(
            ',',
          )}. Mandatory plugins: ${Object.keys(getMandatoryPluginsMap()).join(
            ',',
          )}. Load option plugins: ${state.plugins.loadOptionsPlugins.value.join(',')}`,
        ),
      );
    }

    batch(() => {
      state.plugins.totalPluginsToLoad.value = pluginsToLoad.length;
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
    const remotePluginsList = remotePluginsInventory(
      state.plugins.activePlugins.value as PluginName[],
    );

    Object.keys(remotePluginsList).forEach(async remotePluginKey => {
      await remotePluginsList[remotePluginKey]()
        .then((remotePluginModule: any) => this.register([remotePluginModule.default()]))
        .catch(e => {
          // TODO: add retry here if dynamic import fails
          state.plugins.failedPlugins.value = [
            ...state.plugins.failedPlugins.value,
            remotePluginKey,
          ];
          this.onError(e);
        });
    });
  }

  invokeMultiple<T = any>(extPoint?: string, ...args: any[]): Nullable<T>[] {
    try {
      return this.engine.invokeMultiple(extPoint, ...args);
    } catch (e) {
      this.onError(e, extPoint);
      return [];
    }
  }

  invokeSingle<T = any>(extPoint?: string, ...args: any[]): Nullable<T> {
    try {
      return this.engine.invokeSingle(extPoint, ...args);
    } catch (e) {
      this.onError(e, extPoint);
      return null;
    }
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

  // TODO: Implement reset API instead
  unregisterLocalPlugins() {
    Object.values(pluginsInventory).forEach(localPlugin => {
      try {
        this.engine.unregister(localPlugin().name);
      } catch (e) {
        this.onError(e);
      }
    });
  }

  /**
   * Handle errors
   */
  onError(error: Error | unknown, context = 'PluginsManager') {
    if (this.errorHandler) {
      this.errorHandler.onError(error, context);
    } else {
      throw error;
    }
  }
}

const defaultPluginManager = new PluginsManager(
  defaultPluginEngine,
  defaultErrorHandler,
  defaultLogger,
);

export { PluginsManager, defaultPluginManager };
