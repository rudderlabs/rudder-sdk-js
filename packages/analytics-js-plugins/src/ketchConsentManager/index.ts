/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { ExtensionPlugin } from '@rudderstack/analytics-js-common/types/PluginEngine';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { DestinationConfig } from '@rudderstack/analytics-js-common/types/Destination';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { checks } from '../shared-chunks/common';
import { DESTINATION_CONSENT_STATUS_ERROR } from './logMessages';
import { KETCH_CONSENT_MANAGER_PLUGIN } from './constants';
import { KetchConsentData } from './types';
import { getKetchConsentData, updateConsentStateFromData } from './utils';

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
        (state.consents.data.value.allowedConsents as string[])?.slice();

      // getKetchUserDeniedPurposes returns current ketch opted-out purposes
      // This will be helpful for debugging
      (globalThis as any).getKetchUserDeniedPurposes = () =>
        (state.consents.data.value.deniedConsents as string[])?.slice();

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
      if (!checks.isUndefined((globalThis as any).ketchConsent)) {
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

      const allowedConsents = state.consents.data.value.allowedConsents as string[];

      try {
        const { ketchConsentPurposes } = destConfig;

        // If the destination do not have this mapping events will be sent.
        if (!ketchConsentPurposes || ketchConsentPurposes.length === 0) {
          return true;
        }

        const purposes = ketchConsentPurposes.map(p => p.purpose).filter(n => n);

        // Check if any of the destination's mapped ketch purposes are consented by the user in the browser.
        const containsAnyOfConsent = purposes.some(element =>
          allowedConsents.includes(element.trim()),
        );
        return containsAnyOfConsent;
      } catch (err) {
        errorHandler?.onError(err, KETCH_CONSENT_MANAGER_PLUGIN, DESTINATION_CONSENT_STATUS_ERROR);
        return true;
      }
    },
  },
});

export { KetchConsentManager };

export default KetchConsentManager;
