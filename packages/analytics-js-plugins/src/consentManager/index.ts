/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  ILogger,
  IPluginsManager,
  DestinationConfig,
} from '../types/common';
import { Batch } from './type';

const pluginName = PluginName.ConsentManager;

const ConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(
      state: ApplicationState,
      pluginsManager: IPluginsManager,
      batch: Batch,
      logger?: ILogger,
    ): void {
      logger?.debug('ConsentManager initialization');

      // Initialize selected consent manager and get the consent info
      const { consentProviderInitialized, allowedConsents, deniedConsentIds } =
        pluginsManager.invokeSingle(`consentProvider.getConsentInfo`, logger);

      // Only if the selected consent manager initialization is successful
      // set consent info in state
      if (consentProviderInitialized) {
        batch(() => {
          state.consents.consentProviderInitialized.value = true;
          state.consents.allowedConsents.value = allowedConsents ?? {};
          state.consents.deniedConsentIds.value = deniedConsentIds ?? [];
        });
      }
    },

    isDestinationConsented(
      state: ApplicationState,
      pluginsManager: IPluginsManager,
      destConfig: DestinationConfig,
      logger: ILogger,
    ): boolean {
      return pluginsManager.invokeSingle(
        `consentProvider.isDestinationConsented`,
        state,
        destConfig,
        logger,
      ) as boolean;
    },
  },
});

export { ConsentManager };

export default ConsentManager;
