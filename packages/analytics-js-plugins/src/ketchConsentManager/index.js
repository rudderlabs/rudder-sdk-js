import { checks } from '../shared-chunks/common';
import { DESTINATION_CONSENT_STATUS_ERROR } from './logMessages';
import { KETCH_CONSENT_MANAGER_PLUGIN } from './constants';
import { getKetchConsentData, updateConsentStateFromData } from './utils';
const pluginName = 'KetchConsentManager';
const KetchConsentManager = () => ({
  name: pluginName,
  deps: [],
  initialize: state => {
    state.plugins.loadedPlugins.value = [...state.plugins.loadedPlugins.value, pluginName];
  },
  consentManager: {
    init(state, storeManager, logger) {
      // getKetchUserConsentedPurposes returns current ketch opted-in purposes
      // This will be helpful for debugging
      globalThis.getKetchUserConsentedPurposes = () => {
        var _a;
        return (_a = state.consents.data.value.allowedConsents) === null || _a === void 0
          ? void 0
          : _a.slice();
      };
      // getKetchUserDeniedPurposes returns current ketch opted-out purposes
      // This will be helpful for debugging
      globalThis.getKetchUserDeniedPurposes = () => {
        var _a;
        return (_a = state.consents.data.value.deniedConsentIds) === null || _a === void 0
          ? void 0
          : _a.slice();
      };
      // updateKetchConsent callback function to update current consent purpose state
      // this will be called from ketch rudderstack plugin
      globalThis.updateKetchConsent = ketchConsentData => {
        updateConsentStateFromData(state, ketchConsentData);
      };
      // retrieve consent data and update the state
      let ketchConsentData;
      if (!checks.isUndefined(globalThis.ketchConsent)) {
        ketchConsentData = globalThis.ketchConsent;
      } else {
        ketchConsentData = getKetchConsentData(storeManager, logger);
      }
      updateConsentStateFromData(state, ketchConsentData);
    },
    isDestinationConsented(state, destConfig, errorHandler, logger) {
      const consentData = state.consents.data.value;
      if (!consentData.initialized) {
        return true;
      }
      const allowedConsents = consentData.allowedConsents;
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
        errorHandler === null || errorHandler === void 0
          ? void 0
          : errorHandler.onError(
              err,
              KETCH_CONSENT_MANAGER_PLUGIN,
              DESTINATION_CONSENT_STATUS_ERROR,
            );
        return true;
      }
    },
  },
});
export { KetchConsentManager };
export default KetchConsentManager;
