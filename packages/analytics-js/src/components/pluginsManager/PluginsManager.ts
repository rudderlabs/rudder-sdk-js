import { batch, effect } from '@preact/signals-core';
import type {
  ExtensionPlugin,
  IPluginEngine,
} from '@rudderstack/analytics-js-common/types/PluginEngine';
import { getNonCloudDestinations } from '@rudderstack/analytics-js-common/utilities/destinations';
import type {
  IPluginsManager,
  PluginName,
} from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { PLUGINS_MANAGER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { isFunction } from '@rudderstack/analytics-js-common/utilities/checks';
import { setExposedGlobal } from '../utilities/globals';
import { state } from '../../state';
import {
  ErrorReportingProvidersToPluginNameMap,
  ConsentManagersToPluginNameMap,
  StorageEncryptionVersionsToPluginNameMap,
} from '../configManager/constants';
import { UNSUPPORTED_BEACON_API_WARNING } from '../../constants/logMessages';
import { pluginNamesList } from './pluginNames';
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

  /**
   * Orchestrate the plugin loading and registering
   */
  init() {
    state.lifecycle.status.value = 'pluginsLoading';
    // Expose pluginsCDNPath to global object, so it can be used in the promise that determines
    // remote plugin cdn path to support proxied plugin remotes
    if (!__BUNDLE_ALL_PLUGINS__) {
      setExposedGlobal('pluginsCDNPath', state.lifecycle.pluginsCDNPath.value);
    }
    this.setActivePlugins();
    this.registerLocalPlugins();
    this.registerRemotePlugins();
    this.attachEffects();
  }

  /**
   * Update state based on plugin loaded status
   */
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
          // TODO: decide what to do if a plugin fails to load for any reason.
          //  Should we stop here or should we progress?
          state.lifecycle.status.value = 'pluginsReady';
        });
      }
    });
  }

  /**
   * Determine the list of plugins that should be loaded based on sourceConfig & load options
   */
  // eslint-disable-next-line class-methods-use-this
  getPluginsToLoadBasedOnConfig(): PluginName[] {
    // This contains the default plugins if load option has been omitted by user
    let pluginsToLoadFromConfig = state.plugins.pluginsToLoadFromConfig.value as PluginName[];

    if (!pluginsToLoadFromConfig) {
      return [];
    }

    // Error reporting related plugins
    const supportedErrReportingProviderPluginNames: string[] = Object.values(
      ErrorReportingProvidersToPluginNameMap,
    );
    if (state.reporting.errorReportingProviderPluginName.value) {
      pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(
        pluginName =>
          !(
            pluginName !== state.reporting.errorReportingProviderPluginName.value &&
            supportedErrReportingProviderPluginNames.includes(pluginName)
          ),
      );
    } else {
      pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(
        pluginName =>
          !(
            pluginName === 'ErrorReporting' ||
            supportedErrReportingProviderPluginNames.includes(pluginName)
          ),
      );
    }

    // Cloud mode (dataplane) events delivery plugins
    if (state.loadOptions.value.useBeacon === true && state.capabilities.isBeaconAvailable.value) {
      pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(
        pluginName => pluginName !== 'XhrQueue',
      );
    } else {
      if (state.loadOptions.value.useBeacon === true) {
        this.logger?.warn(UNSUPPORTED_BEACON_API_WARNING(PLUGINS_MANAGER));
      }

      pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(
        pluginName => pluginName !== 'BeaconQueue',
      );
    }

    // Enforce default cloud mode event delivery queue plugin is none exists
    if (
      !pluginsToLoadFromConfig.includes('XhrQueue') &&
      !pluginsToLoadFromConfig.includes('BeaconQueue')
    ) {
      pluginsToLoadFromConfig.push('XhrQueue');
    }

    // Device mode destinations related plugins
    if (
      getNonCloudDestinations(state.nativeDestinations.configuredDestinations.value ?? [])
        .length === 0
    ) {
      pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(
        pluginName =>
          ![
            'DeviceModeDestinations',
            'DeviceModeTransformation',
            'NativeDestinationQueue',
          ].includes(pluginName),
      );
    }

    // Consent Management related plugins
    const supportedConsentManagerPlugins: string[] = Object.values(ConsentManagersToPluginNameMap);
    let filterCondition = (pluginName: PluginName) =>
      !(
        pluginName !== state.consents.activeConsentManagerPluginName.value &&
        supportedConsentManagerPlugins.includes(pluginName)
      );

    if (!state.consents.enabled.value) {
      filterCondition = (pluginName: PluginName) =>
        !supportedConsentManagerPlugins.includes(pluginName);
    }

    pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(filterCondition);

    // Storage encryption related plugins
    const supportedStorageEncryptionPlugins: string[] = Object.values(
      StorageEncryptionVersionsToPluginNameMap,
    );
    pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(
      pluginName =>
        !(
          pluginName !== state.storage.encryptionPluginName.value &&
          supportedStorageEncryptionPlugins.includes(pluginName)
        ),
    );

    // Storage migrator related plugins
    if (!state.storage.migrate.value) {
      pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(
        pluginName => pluginName !== 'StorageMigrator',
      );
    }

    return [...(Object.keys(getMandatoryPluginsMap()) as PluginName[]), ...pluginsToLoadFromConfig];
  }

  /**
   * Determine the list of plugins that should be activated
   */
  setActivePlugins() {
    const pluginsToLoad = this.getPluginsToLoadBasedOnConfig();
    // Merging available mandatory and optional plugin name list
    const availablePlugins = [...Object.keys(pluginsInventory), ...pluginNamesList];
    const activePlugins: PluginName[] = [];
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
          )}. Load option plugins: ${state.plugins.pluginsToLoadFromConfig.value.join(',')}`,
        ),
      );
    }

    batch(() => {
      state.plugins.totalPluginsToLoad.value = pluginsToLoad.length;
      state.plugins.activePlugins.value = activePlugins;
      state.plugins.failedPlugins.value = failedPlugins;
    });
  }

  /**
   * Register plugins that are direct imports to PluginEngine
   */
  registerLocalPlugins() {
    Object.values(pluginsInventory).forEach(localPlugin => {
      if (
        isFunction(localPlugin) &&
        state.plugins.activePlugins.value.includes(localPlugin().name)
      ) {
        this.register([localPlugin()]);
      }
    });
  }

  /**
   * Register plugins that are dynamic imports to PluginEngine
   */
  registerRemotePlugins() {
    const remotePluginsList = remotePluginsInventory(
      state.plugins.activePlugins.value as PluginName[],
    );

    Promise.all(
      Object.keys(remotePluginsList).map(async remotePluginKey => {
        await remotePluginsList[remotePluginKey as PluginName]()
          .then((remotePluginModule: any) => this.register([remotePluginModule.default()]))
          .catch(err => {
            // TODO: add retry here if dynamic import fails
            state.plugins.failedPlugins.value = [
              ...state.plugins.failedPlugins.value,
              remotePluginKey,
            ];
            this.onError(err, remotePluginKey);
          });
      }),
    ).catch(err => {
      this.onError(err);
    });
  }

  /**
   * Extension point invoke that allows multiple plugins to be registered to it with error handling
   */
  invokeMultiple<T = any>(extPoint?: string, ...args: any[]): Nullable<T>[] {
    try {
      return this.engine.invokeMultiple(extPoint, ...args);
    } catch (e) {
      this.onError(e, extPoint);
      return [];
    }
  }

  /**
   * Extension point invoke that allows a single plugin to be registered to it with error handling
   */
  invokeSingle<T = any>(extPoint?: string, ...args: any[]): Nullable<T> {
    try {
      return this.engine.invokeSingle(extPoint, ...args);
    } catch (e) {
      this.onError(e, extPoint);
      return null;
    }
  }

  /**
   * Plugin engine register with error handling
   */
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
  onError(error: unknown, customMessage?: string): void {
    if (this.errorHandler) {
      this.errorHandler.onError(error, PLUGINS_MANAGER, customMessage);
    } else {
      throw error;
    }
  }
}

export { PluginsManager };
