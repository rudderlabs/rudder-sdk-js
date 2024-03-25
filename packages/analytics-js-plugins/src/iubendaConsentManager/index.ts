/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { IUBENDA_CONSENT_MANAGER_PLUGIN } from './constants';
import { checks, storages, string } from '../shared-chunks/common';
import { DESTINATION_CONSENT_STATUS_ERROR, IUBENDA_ACCESS_ERROR } from './logMessages';

const pluginName: PluginName = 'IubendaConsentManager';

const IubendaConsentManager = (): ExtensionPlugin => ({
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
      // eslint-disable-next-line no-underscore-dangle
      if (!(globalThis as any)._iub) {
        logger?.error(IUBENDA_ACCESS_ERROR(IUBENDA_CONSENT_MANAGER_PLUGIN));
        state.consents.initialized.value = false;
        return;
      }

      // eslint-disable-next-line no-underscore-dangle
      if (!(globalThis as any)._iub?.cs?.consent?.purposes) {
        state.consents.initialized.value = false;
        return;
      }

      try {
        const allowedConsentIds: string[] = [];
        const deniedConsentIds: string[] = [];

        // eslint-disable-next-line no-underscore-dangle
        const { purposes = {} } = (globalThis as any)._iub.cs.api.getPreferences();

        Object.entries(purposes).forEach(e => {
          const purposeCode = e[0];
          const isConsented = e[1];
          if (isConsented) {
            allowedConsentIds.push(purposeCode);
          } else {
            deniedConsentIds.push(purposeCode);
          }
        })

        state.consents.initialized.value = true;
        state.consents.data.value = { allowedConsentIds, deniedConsentIds };
      } catch (err) {
        logger?.error(IUBENDA_ACCESS_ERROR(IUBENDA_CONSENT_MANAGER_PLUGIN), err);
      }
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
      const matchPredicate = (consent: string) => allowedConsentIds.includes(consent);

      try {
        const { iubendaConsentPurposes, consentManagement } = destConfig;

        // If the destination does not have consent management config, events should be sent.
        if (consentManagement) {
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
          switch (resolutionStrategy) {
            case 'or':
              return configuredConsents.some(matchPredicate) || configuredConsents.length === 0;
            case 'and':
            default:
              return configuredConsents.every(matchPredicate);
          }
        }

        if (iubendaConsentPurposes) {
          const configuredConsents = iubendaConsentPurposes.map(p => p.purpose.trim()).filter(n => n);

          // Check if any of the destination's mapped ketch purposes are consented by the user in the browser.
          return configuredConsents.some(matchPredicate) || configuredConsents.length === 0;
        }

        return true;
      } catch (err) {
        errorHandler?.onError(err, IUBENDA_CONSENT_MANAGER_PLUGIN, DESTINATION_CONSENT_STATUS_ERROR);
        return true;
      }
    },
  },
});

export { IubendaConsentManager };

export default IubendaConsentManager;
