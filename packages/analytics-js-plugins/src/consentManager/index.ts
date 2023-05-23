/* eslint-disable no-param-reassign */
import {
  ExtensionPlugin,
  PluginName,
  ApplicationState,
  ILogger,
  IPluginsManager,
} from '../types/common';
import { SUPPORTED_CONSENT_MANAGERS } from './constants';
import { getUserSelectedConsentManager } from './utils';

const pluginName = PluginName.ConsentManager;

const ConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    console.log('inside ConsentManager initialize');
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(state: ApplicationState, pluginsManager: IPluginsManager, logger?: ILogger): void {
      console.log('inside ConsentManager init');
      // Get user selected consent manager
      const selectedConsentManager: string | undefined = getUserSelectedConsentManager(
        state.consents.cookieConsentOptions.value,
      );
      // Check to verify SDK supports the selected consent manager
      if (selectedConsentManager && !SUPPORTED_CONSENT_MANAGERS.includes(selectedConsentManager)) {
        logger?.error(`[ConsentManager]:: Provided consent manager is not supported.`);
        return;
      }

      if (selectedConsentManager) {
        // Initialize selected consent manager
        pluginsManager.invokeSingle(`${selectedConsentManager}.init`, logger);

        // Fetch the consented category Ids
        const allowedConsentIds = pluginsManager.invokeSingle(
          `${selectedConsentManager}.getConsent`,
        );

        // Fetch the denied consent category Ids
        const deniedConsentIds = pluginsManager.invokeSingle(
          `${selectedConsentManager}.getDeniedConsent`,
        );

        state.consents.allowedConsentIds.value = allowedConsentIds ?? [];
        state.consents.deniedConsentIds.value = deniedConsentIds ?? [];
      }
    },
  },
});

export { ConsentManager };

export default ConsentManager;
