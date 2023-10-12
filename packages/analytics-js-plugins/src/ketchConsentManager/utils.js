import { checks, storages, string } from '../shared-chunks/common';
import { KETCH_CONSENT_COOKIE_PARSE_ERROR, KETCH_CONSENT_COOKIE_READ_ERROR } from './logMessages';
import { KETCH_CONSENT_COOKIE_NAME_V1, KETCH_CONSENT_MANAGER_PLUGIN } from './constants';
/**
 * Gets the consent data from the Ketch's consent cookie
 * @param storeManager Store manager instance
 * @param logger Logger instance
 * @returns Consent data from the consent cookie
 */
const getKetchConsentData = (storeManager, logger) => {
  let rawConsentCookieData = null;
  try {
    // Create a data store instance to read the consent cookie
    const dataStore =
      storeManager === null || storeManager === void 0
        ? void 0
        : storeManager.setStore({
            id: KETCH_CONSENT_MANAGER_PLUGIN,
            name: KETCH_CONSENT_MANAGER_PLUGIN,
            type: storages.COOKIE_STORAGE,
          });
    rawConsentCookieData =
      dataStore === null || dataStore === void 0
        ? void 0
        : dataStore.engine.getItem(KETCH_CONSENT_COOKIE_NAME_V1);
  } catch (err) {
    logger === null || logger === void 0
      ? void 0
      : logger.error(KETCH_CONSENT_COOKIE_READ_ERROR(KETCH_CONSENT_MANAGER_PLUGIN), err);
    return undefined;
  }
  if (checks.isNullOrUndefined(rawConsentCookieData)) {
    return undefined;
  }
  // Decode and parse the cookie data to JSON
  let consentCookieData;
  try {
    consentCookieData = JSON.parse(string.fromBase64(rawConsentCookieData));
  } catch (err) {
    logger === null || logger === void 0
      ? void 0
      : logger.error(KETCH_CONSENT_COOKIE_PARSE_ERROR(KETCH_CONSENT_MANAGER_PLUGIN), err);
    return undefined;
  }
  if (!consentCookieData) {
    return undefined;
  }
  // Convert the cookie data to consent data
  const consentPurposes = {};
  Object.entries(consentCookieData).forEach(pEntry => {
    const purposeCode = pEntry[0];
    const purposeValue = pEntry[1];
    consentPurposes[purposeCode] =
      (purposeValue === null || purposeValue === void 0 ? void 0 : purposeValue.status) ===
      'granted';
  });
  return consentPurposes;
};
/**
 * Gets the consent data in the format expected by the application state
 * @param ketchConsentData Consent data derived from the consent cookie
 * @returns Consent data
 */
const getConsentData = ketchConsentData => {
  const allowedConsents = [];
  const deniedConsentIds = [];
  let initialized = false;
  if (ketchConsentData) {
    Object.entries(ketchConsentData).forEach(e => {
      const purposeCode = e[0];
      const isConsented = e[1];
      if (isConsented) {
        allowedConsents.push(purposeCode);
      } else {
        deniedConsentIds.push(purposeCode);
      }
    });
    initialized = true;
  }
  return { initialized, allowedConsents, deniedConsentIds };
};
const updateConsentStateFromData = (state, ketchConsentData) => {
  const consentData = getConsentData(ketchConsentData);
  state.consents.data.value = consentData;
};
export { getKetchConsentData, getConsentData, updateConsentStateFromData };
