/* eslint-disable no-param-reassign */
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { ConsentsInfo } from '@rudderstack/analytics-js-common/types/Consent';
import { isDefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { checks, storages, string } from '../shared-chunks/common';
import { KETCH_CONSENT_COOKIE_PARSE_ERROR, KETCH_CONSENT_COOKIE_READ_ERROR } from './logMessages';
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
      type: storages.COOKIE_STORAGE,
    });
    rawConsentCookieData = dataStore?.engine.getItem(KETCH_CONSENT_COOKIE_NAME_V1);
  } catch (err) {
    logger?.error(KETCH_CONSENT_COOKIE_READ_ERROR(KETCH_CONSENT_MANAGER_PLUGIN), err);
    return undefined;
  }

  if (checks.isNullOrUndefined(rawConsentCookieData)) {
    return undefined;
  }

  // Decode and parse the cookie data to JSON
  let consentCookieData: KetchConsentCookieData;
  try {
    consentCookieData = JSON.parse(string.fromBase64(rawConsentCookieData as string));
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
const getConsentData = (ketchConsentData?: KetchConsentData): ConsentsInfo => {
  const allowedConsents: string[] = [];
  const deniedConsents: string[] = [];
  if (ketchConsentData) {
    Object.entries(ketchConsentData).forEach(e => {
      const purposeCode = e[0];
      const isConsented = e[1];
      if (isConsented) {
        allowedConsents.push(purposeCode);
      } else {
        deniedConsents.push(purposeCode);
      }
    });
  }

  return { allowedConsents, deniedConsents };
};

const updateConsentStateFromData = (
  state: ApplicationState,
  ketchConsentData: KetchConsentData,
) => {
  const consentData = getConsentData(ketchConsentData);
  state.consents.initialized.value = isDefined(ketchConsentData);
  state.consents.data.value = consentData;
};

export { getKetchConsentData, getConsentData, updateConsentStateFromData };
