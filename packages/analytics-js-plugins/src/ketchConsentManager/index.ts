/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { DESTINATION_CONSENT_STATUS_ERROR } from './logMessages';
import { KETCH_CONSENT_MANAGER_PLUGIN } from './constants';
import type { KetchConsentData } from './types';
import { getKetchConsentData, updateConsentStateFromData } from './utils';
import { isUndefined } from '../shared-chunks/common';

const pluginName: PluginName = 'KetchConsentManager';

const KetchConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(state: ApplicationState, logger?: ILogger): void {
      // getKetchUserConsentedPurposes returns current ketch opted-in purposes
      // This will be helpful for debugging
      (globalThis as any).getKetchUserConsentedPurposes = () =>
        (state.consents.data.value.allowedConsentIds as string[])?.slice();

      // getKetchUserDeniedPurposes returns current ketch opted-out purposes
      // This will be helpful for debugging
      (globalThis as any).getKetchUserDeniedPurposes = () =>
        (state.consents.data.value.deniedConsentIds as string[])?.slice();

      // updateKetchConsent callback function to update current consent purpose state
      // this will be called from ketch rudderstack plugin
      (globalThis as any).updateKetchConsent = (ketchConsentData: KetchConsentData) => {
        updateConsentStateFromData(state, ketchConsentData);
      };
    },

    updateConsentsInfo(
      state: ApplicationState,
      storeManager?: IStoreManager,
      logger?: ILogger,
    ): void {
      // retrieve consent data and update the state
      let ketchConsentData;
      if (!isUndefined((globalThis as any).ketchConsent)) {
        ketchConsentData = (globalThis as any).ketchConsent;
      } else {
        ketchConsentData = getKetchConsentData(storeManager, logger);
      }

      updateConsentStateFromData(state, ketchConsentData);
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
        const { ketchConsentPurposes, consentManagement } = destConfig;
        const matchPredicate = (consent: string) => allowedConsentIds.includes(consent);

        // Generic consent management
        if (consentManagement) {
          // Get the corresponding consents for the destination
          const cmpConsents = consentManagement.find(
            c => c.provider === state.consents.provider.value,
          )?.consents;

          // If there are no consents configured for the destination for the current provider, events should be sent.
          if (!cmpConsents) {
            return true;
          }

          const configuredConsents = cmpConsents.map(c => c.consent.trim()).filter(n => n);

          // match the configured consents with user provided consents as per
          // the configured resolution strategy
          switch (state.consents.resolutionStrategy.value) {
            case 'or':
              return configuredConsents.some(matchPredicate) || configuredConsents.length === 0;
            case 'and':
            default:
              return configuredConsents.every(matchPredicate);
          }

          // Legacy cookie consent management
          // TODO: To be removed once the source config API is updated to support generic consent management
        } else if (ketchConsentPurposes) {
          const configuredConsents = ketchConsentPurposes.map(p => p.purpose.trim()).filter(n => n);

          // Check if any of the destination's mapped ketch purposes are consented by the user in the browser.
          return configuredConsents.some(matchPredicate) || configuredConsents.length === 0;
        }

        // If there are no consents configured for the destination for the current provider, events should be sent.
        return true;
      } catch (err) {
        errorHandler?.onError({
          error: err,
          context: KETCH_CONSENT_MANAGER_PLUGIN,
          customMessage: DESTINATION_CONSENT_STATUS_ERROR,
        });
        return true;
      }
    },
  },
});

export { KetchConsentManager };

export default KetchConsentManager;
