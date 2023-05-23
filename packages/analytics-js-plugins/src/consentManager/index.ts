/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  ILogger,
  IPluginsManager,
} from '../types/common';

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
      selectedConsentManager: string,
      logger?: ILogger,
    ): void {
      logger?.debug('ConsentManager initialization');

      if (selectedConsentManager) {
        // Initialize selected consent manager and get the consent info
        const { consentManagerInitialized, allowedConsentIds, deniedConsentIds } =
          pluginsManager.invokeSingle(`${selectedConsentManager}.init`, logger);

        // Only if the selected consent manager initialization is successful
        // set consent info in state
        if (consentManagerInitialized) {
          state.consents.consentManagerInitialized.value = true;
          state.consents.allowedConsentIds.value = allowedConsentIds ?? [];
          state.consents.deniedConsentIds.value = deniedConsentIds ?? [];
        }
      }
    },
  },
});

export { ConsentManager };

export default ConsentManager;
