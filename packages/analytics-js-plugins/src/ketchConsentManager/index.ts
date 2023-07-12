/* eslint-disable no-param-reassign */
import { ApplicationState, ILogger, DestinationConfig, IStoreManager } from '../types/common';
import { ExtensionPlugin } from '../types/plugins';
import { isUndefined } from '../utilities/common';
import { KETCH_CONSENT_MANAGER_PLUGIN } from './constants';
import { KetchConsentData } from './types';
import { getConsentData, getKetchConsentData } from './utils';

const pluginName = 'KetchConsentManager';

const KetchConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(state: ApplicationState, storeManager?: IStoreManager, logger?: ILogger): void {
      const updateConsentStateFromData = (ketchConsentData: KetchConsentData) => {
        const consentData = getConsentData(ketchConsentData);
        state.consents.data.value = consentData;
      };

      // getKetchUserConsentedPurposes returns current ketch opted-in purposes
      // This will be helpful for debugging
      (globalThis as any).getKetchUserConsentedPurposes = () =>
        (state.consents.data.value.allowedConsents as string[])?.slice();

      // getKetchUserDeniedPurposes returns current ketch opted-out purposes
      // This will be helpful for debugging
      (globalThis as any).getKetchUserDeniedPurposes = () =>
        (state.consents.data.value.deniedConsentIds as string[])?.slice();

      // updateKetchConsent callback function to update current consent purpose state
      // this will be called from ketch rudderstack plugin
      (globalThis as any).updateKetchConsent = updateConsentStateFromData;

      // retrieve consent data and update the state
      let ketchConsentData;
      if (!isUndefined((globalThis as any).ketchConsent)) {
        ketchConsentData = (globalThis as any).ketchConsent;
      } else {
        ketchConsentData = getKetchConsentData(storeManager, logger);
      }

      updateConsentStateFromData(ketchConsentData);
    },

    isDestinationConsented(
      state: ApplicationState,
      destConfig: DestinationConfig,
      logger?: ILogger,
    ): boolean {
      const consentData = state.consents.data.value;
      if (!consentData || !consentData.initialized) {
        return true;
      }
      const allowedConsents = consentData.allowedConsents as string[];

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
        logger?.error(
          `${KETCH_CONSENT_MANAGER_PLUGIN}:: Failed to determine the consent status for the destination. Please check the destination configuration and try again.`,
          err,
        );
        return true;
      }
    },
  },
});

export { KetchConsentManager };

export default KetchConsentManager;
