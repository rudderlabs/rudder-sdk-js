/* eslint-disable no-param-reassign */
import { ApplicationState, ILogger, DestinationConfig, IStoreManager } from '../types/common';
import { ExtensionPlugin, ConsentInfo } from '../types/plugins';
import { isUndefined } from '../utilities/common';
import { KETCH_CONSENT_MANAGER_PLUGIN } from './constants';
import { getConsentData, getKetchConsentData } from './utils';

const pluginName = 'KetchConsentManager';

const KetchConsentManager = (): ExtensionPlugin => ({
  name: pluginName,
  deps: [],
  initialize: (state: ApplicationState) => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    getConsentInfo(storeManager?: IStoreManager, logger?: ILogger): ConsentInfo {
      // TODO: Define below callbacks
      // window.updateKetchConsent
      // window.getKetchUserConsentedPurposes
      // window.getKetchUserDeniedPurposes

      let ketchConsentData;
      if (!isUndefined((globalThis as any).ketchConsent)) {
        ketchConsentData = (globalThis as any).ketchConsent;
      } else {
        ketchConsentData = getKetchConsentData(storeManager, logger);
      }

      const consentData = getConsentData(ketchConsentData);
      return { consentManagerInitialized: true, ...consentData };
    },

    isDestinationConsented(
      state: ApplicationState,
      destConfig: DestinationConfig,
      logger?: ILogger,
    ): boolean {
      const { consentManagerInitialized, allowedConsents } = state.consents;
      if (!consentManagerInitialized.value) {
        return true;
      }

      try {
        const { ketchConsentPurposes } = destConfig;

        // If the destination do not have this mapping events will be sent.
        if (!ketchConsentPurposes || ketchConsentPurposes.length === 0) {
          return true;
        }

        const purposes = ketchConsentPurposes.map(p => p.purpose).filter(n => n);

        // Check if any of the destination's mapped ketch purposes are consented by the user in the browser.
        const containsAnyOfConsent = purposes.some(element =>
          (allowedConsents.value as string[]).includes(element.trim()),
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
