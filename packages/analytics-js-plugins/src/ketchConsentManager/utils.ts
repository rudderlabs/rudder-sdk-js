/* eslint-disable no-param-reassign */
import { ApplicationState, ConsentInfo, ILogger, IStoreManager } from '../types/common';
import { COOKIE_STORAGE, fromBase64, isNullOrUndefined } from '../utilities/common';
import {
  KETCH_CONSENT_COOKIE_PARSE_ERROR,
  KETCH_CONSENT_COOKIE_READ_ERROR,
} from '../utilities/logMessages';
import { KETCH_CONSENT_COOKIE_NAME_V1, KETCH_CONSENT_MANAGER_PLUGIN } from './constants';
import { KetchConsentCookieData, KetchConsentData } from './types';

/**
 * Gets the consent data from the Ketch's consent cookie
 * @param storeManager Store manager instance
 * @param logger Logger instance
 * @returns Consent data from the consent cookie
 */
const getKetchConsentData = (
  storeManager?: IStoreManager,
  logger?: ILogger,
): KetchConsentData | undefined => {
  let rawConsentCookieData = null;
  try {
    // Create a data store instance to read the consent cookie
    const dataStore = storeManager?.setStore({
      id: KETCH_CONSENT_MANAGER_PLUGIN,
      name: KETCH_CONSENT_MANAGER_PLUGIN,
      type: COOKIE_STORAGE,
    });
    rawConsentCookieData = dataStore?.engine.getItem(KETCH_CONSENT_COOKIE_NAME_V1);
  } catch (err) {
    logger?.error(KETCH_CONSENT_COOKIE_READ_ERROR(KETCH_CONSENT_MANAGER_PLUGIN), err);
    return undefined;
  }

  if (isNullOrUndefined(rawConsentCookieData)) {
    return undefined;
  }

  // Decode and parse the cookie data to JSON
  let consentCookieData: KetchConsentCookieData;
  try {
    consentCookieData = JSON.parse(fromBase64(rawConsentCookieData as string));
  } catch (err) {
    logger?.error(KETCH_CONSENT_COOKIE_PARSE_ERROR(KETCH_CONSENT_MANAGER_PLUGIN), err);
    return undefined;
  }

  if (!consentCookieData) {
    return undefined;
  }

  // Convert the cookie data to consent data
  const consentPurposes: KetchConsentData = {};
  Object.entries(consentCookieData).forEach(pEntry => {
    const purposeCode = pEntry[0];
    const purposeValue = pEntry[1];
    consentPurposes[purposeCode] = purposeValue?.status === 'granted';
  });
  return consentPurposes;
};

/**
 * Gets the consent data in the format expected by the application state
 * @param ketchConsentData Consent data derived from the consent cookie
 * @returns Consent data
 */
const getConsentData = (ketchConsentData?: KetchConsentData): ConsentInfo => {
  const allowedConsents: string[] = [];
  const deniedConsentIds: string[] = [];
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

const updateConsentStateFromData = (
  state: ApplicationState,
  ketchConsentData: KetchConsentData,
) => {
  const consentData = getConsentData(ketchConsentData);
  state.consents.data.value = consentData;
};

export { getKetchConsentData, getConsentData, updateConsentStateFromData };
