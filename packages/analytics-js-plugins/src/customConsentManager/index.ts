/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { CUSTOM_CONSENT_MANAGER_PLUGIN } from './constants';
import { DESTINATION_CONSENT_STATUS_ERROR } from './logMessages';

const pluginName: PluginName = 'CustomConsentManager';

const CustomConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(state: ApplicationState, logger?: ILogger): void {
      // Nothing to initialize
    },

    updateConsentsInfo(
      state: ApplicationState,
      storeManager?: IStoreManager,
      logger?: ILogger,
    ): void {
      // Nothing to update. Already provided by the user
    },

    isDestinationConsented(
      state: ApplicationState,
      destConfig: DestinationConfig,
      errorHandler?: IErrorHandler,
      logger?: ILogger,
    ): boolean {
      if (!state.consents.initialized.value) {
        return true;
      }

      const allowedConsentIds = state.consents.data.value.allowedConsentIds as string[];

      try {
        const { consentManagement } = destConfig;

        // If the destination does not have consent management config, events should be sent.
        if (!consentManagement) {
          return true;
        }

        // Get the corresponding consents for the destination
        const cmpConfig = consentManagement.find(c => c.provider === state.consents.provider.value);

        // If there are no consents configured for the destination for the current provider, events should be sent.
        if (!cmpConfig?.consents) {
          return true;
        }

        const configuredConsents = cmpConfig.consents.map(c => c.consent.trim()).filter(n => n);
        const resolutionStrategy =
          cmpConfig.resolutionStrategy ?? state.consents.resolutionStrategy.value;

        // match the configured consents with user provided consents as per
        // the configured resolution strategy
        const matchPredicate = (consent: string) => allowedConsentIds.includes(consent);
        switch (resolutionStrategy) {
          case 'or':
            return configuredConsents.some(matchPredicate) || configuredConsents.length === 0;
          case 'and':
          default:
            return configuredConsents.every(matchPredicate);
        }
      } catch (err: any) {
        errorHandler?.onError(err, CUSTOM_CONSENT_MANAGER_PLUGIN, DESTINATION_CONSENT_STATUS_ERROR);
        return true;
      }
    },
  },
});

export { CustomConsentManager };

export default CustomConsentManager;
