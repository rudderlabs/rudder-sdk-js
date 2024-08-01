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
import { isDefined, isFunction } from '@rudderstack/analytics-js-common/utilities/checks';
import { generateMisconfiguredPluginsWarning } from '../../constants/logMessages';
import { setExposedGlobal } from '../utilities/globals';
import { state } from '../../state';
import {
  ConsentManagersToPluginNameMap,
  StorageEncryptionVersionsToPluginNameMap,
  DataPlaneEventsTransportToPluginNameMap,
} from '../configManager/constants';
import { pluginNamesList } from './pluginNames';
import {
  getMandatoryPluginsMap,
  pluginsInventory,
  remotePluginsInventory,
} from './pluginsInventory';
import type { PluginsGroup } from './types';

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

    // TODO: Uncomment below lines after removing deprecated plugin
    // Filter deprecated plugins
    // pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(pluginName => {
    //   if (deprecatedPluginsList.includes(pluginName)) {
    //     this.logger?.warn(DEPRECATED_PLUGIN_WARNING(PLUGINS_MANAGER, pluginName));
    //     return false;
    //   }
    //   return true;
    // });

    const pluginGroupsToProcess: PluginsGroup[] = [
      {
        configurationStatus: () => isDefined(state.dataPlaneEvents.eventsQueuePluginName.value),
        configurationStatusStr: 'Data plane events delivery is enabled',
        activePluginName: state.dataPlaneEvents.eventsQueuePluginName.value,
        supportedPlugins: Object.values(DataPlaneEventsTransportToPluginNameMap),
        shouldAddMissingPlugins: true,
      },
      {
        configurationStatus: () => state.reporting.isErrorReportingEnabled.value,
        configurationStatusStr: 'Error reporting is enabled',
        supportedPlugins: ['ErrorReporting', 'Bugsnag'] as PluginName[], // TODO: Remove deprecated plugin- Bugsnag
      },
      {
        configurationStatus: () =>
          getNonCloudDestinations(state.nativeDestinations.configuredDestinations.value).length > 0,
        configurationStatusStr: 'Device mode destinations are connected to the source',
        supportedPlugins: ['DeviceModeDestinations', 'NativeDestinationQueue'] as PluginName[],
      },
      {
        configurationStatus: () =>
          getNonCloudDestinations(state.nativeDestinations.configuredDestinations.value).some(
            destination => destination.shouldApplyDeviceModeTransformation,
          ),
        configurationStatusStr:
          'Device mode transformations are enabled for at least one destination',
        supportedPlugins: ['DeviceModeTransformation'] as PluginName[],
      },
      {
        configurationStatus: () => isDefined(state.consents.activeConsentManagerPluginName.value),
        configurationStatusStr: 'Consent management is enabled',
        activePluginName: state.consents.activeConsentManagerPluginName.value,
        supportedPlugins: Object.values(ConsentManagersToPluginNameMap),
      },
      {
        configurationStatus: () => isDefined(state.storage.encryptionPluginName.value),
        configurationStatusStr: 'Storage encryption is enabled',
        activePluginName: state.storage.encryptionPluginName.value,
        supportedPlugins: Object.values(StorageEncryptionVersionsToPluginNameMap),
      },
      {
        configurationStatus: () => state.storage.migrate.value,
        configurationStatusStr: 'Storage migration is enabled',
        supportedPlugins: ['StorageMigrator'],
      },
    ];

    const addMissingPlugins = false;
    pluginGroupsToProcess.forEach(group => {
      if (group.configurationStatus()) {
        pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(
          group.activePluginName
            ? pluginName =>
                !(
                  pluginName !== group.activePluginName &&
                  group.supportedPlugins.includes(pluginName)
                )
            : pluginName => isDefined(pluginName), // pass through
        );

        this.addMissingPlugins(group, addMissingPlugins, pluginsToLoadFromConfig);
      } else {
        pluginsToLoadFromConfig = pluginsToLoadFromConfig.filter(
          group.basePlugins !== undefined
            ? pluginName =>
                !(
                  (group.basePlugins as PluginName[]).includes(pluginName) ||
                  group.supportedPlugins.includes(pluginName)
                )
            : pluginName => !group.supportedPlugins.includes(pluginName),
        );
      }
    });

    return [...(Object.keys(getMandatoryPluginsMap()) as PluginName[]), ...pluginsToLoadFromConfig];
  }

  private addMissingPlugins(
    group: PluginsGroup,
    addMissingPlugins: boolean,
    pluginsToLoadFromConfig: PluginName[],
  ) {
    const shouldAddMissingPlugins = group.shouldAddMissingPlugins || addMissingPlugins;
    let pluginsToConfigure;
    if (group.activePluginName) {
      pluginsToConfigure = [...(group.basePlugins || []), group.activePluginName] as PluginName[];
    } else {
      pluginsToConfigure = [...group.supportedPlugins];
    }

    const missingPlugins = pluginsToConfigure.filter(
      pluginName => !pluginsToLoadFromConfig.includes(pluginName),
    );
    if (missingPlugins.length > 0) {
      if (shouldAddMissingPlugins) {
        pluginsToLoadFromConfig.push(...missingPlugins);
      }

      this.logger?.warn(
        generateMisconfiguredPluginsWarning(
          PLUGINS_MANAGER,
          group.configurationStatusStr,
          missingPlugins,
          shouldAddMissingPlugins,
        ),
      );
    }
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
