/* eslint-disable no-param-reassign */
import { ApplicationState, ILogger, IPluginsManager, DestinationConfig } from '../types/common';
import { ExtensionPlugin } from '../types/plugins';
import { Batch } from './type';

const pluginName = 'ConsentOrchestrator';

const ConsentOrchestrator = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentOrchestrator: {
    init(
      state: ApplicationState,
      pluginsManager: IPluginsManager,
      batch: Batch,
      logger?: ILogger,
    ): void {
      // Initialize selected consent manager and get the consent info
      const { consentManagerInitialized, allowedConsents, deniedConsentIds } =
        pluginsManager.invokeSingle(`consentManager.getConsentInfo`, logger);

      // Only if the selected consent manager initialization is successful
      // set consent info in state
      if (consentManagerInitialized) {
        batch(() => {
          state.consents.consentManagerInitialized.value = true;
          state.consents.allowedConsents.value = allowedConsents ?? {};
          state.consents.deniedConsentIds.value = deniedConsentIds ?? [];
        });
      }
    },

    isDestinationConsented(
      state: ApplicationState,
      pluginsManager: IPluginsManager,
      destConfig: DestinationConfig,
      logger?: ILogger,
    ): boolean {
      return pluginsManager.invokeSingle(
        `consentManager.isDestinationConsented`,
        state,
        destConfig,
        logger,
      ) as boolean;
    },
  },
});

export { ConsentOrchestrator };

export default ConsentOrchestrator;
