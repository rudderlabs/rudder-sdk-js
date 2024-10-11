/* eslint-disable no-param-reassign */
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { ConsentsInfo } from '@rudderstack/analytics-js-common/types/Consent';
import { isDefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { checks, storages, string } from '../shared-chunks/common';
import { IUBENDA_CONSENT_COOKIE_READ_ERROR, IUBENDA_CONSENT_COOKIE_PARSE_ERROR } from './logMessages';
import { IUBENDA_CONSENT_MANAGER_PLUGIN, IUBENDA_CONSENT_COOKIE_NAME_PATTERN } from './constants';
import type { IubendaConsentData, IubendaConsentCookieData} from './types'

/**
 * Gets the consent data from the Iubenda's consent cookie
 * @param storeManager Store manager instance
 * @param logger Logger instance
 * @returns Consent data from the consent cookie
 */
const getIubendaConsentData = (
  storeManager?: IStoreManager,
  logger?: ILogger,
): IubendaConsentData | undefined => {
  let rawConsentCookieData = null;
  try {
    
    const dataStore = storeManager?.setStore({
      id: IUBENDA_CONSENT_MANAGER_PLUGIN,
      name: IUBENDA_CONSENT_MANAGER_PLUGIN,
      type: storages.COOKIE_STORAGE,
    });
    rawConsentCookieData = dataStore?.engine.getItem(getIubendaCookieName(logger));

  } catch (err) {
    logger?.error(IUBENDA_CONSENT_COOKIE_READ_ERROR(IUBENDA_CONSENT_MANAGER_PLUGIN), err);
    return undefined;
  }

  if (checks.isNullOrUndefined(rawConsentCookieData)) {
    return undefined;
  }

  // Decode and parse the cookie data to JSON
  let consentCookieData: IubendaConsentCookieData;
  try {
    consentCookieData = JSON.parse(decodeURIComponent(rawConsentCookieData as string));
  } catch (err) {
    logger?.error(IUBENDA_CONSENT_COOKIE_PARSE_ERROR(IUBENDA_CONSENT_MANAGER_PLUGIN), err);
    return undefined;
  }

  if (!consentCookieData) {
    return undefined;
  }

  // Convert the cookie data to consent data
  const consentPurposes: IubendaConsentData = consentCookieData.purposes;
  return consentPurposes;
};

/**
 * Gets the consent data in the format expected by the application state
 * @param iubendaConsentData Consent data derived from the consent cookie
 * @returns Consent data
 */
const getConsentData = (iubendaConsentData?: IubendaConsentData): ConsentsInfo => {
  const allowedConsentIds: string[] = [];
  const deniedConsentIds: string[] = [];
  if (iubendaConsentData) {
    Object.entries(iubendaConsentData).forEach(e => {
      const purposeId = e[0];
      const isConsented = e[1];
      if (isConsented) {
        allowedConsentIds.push(purposeId);
      } else {
        deniedConsentIds.push(purposeId);
      }
    });
  }

  return { allowedConsentIds, deniedConsentIds };
};

const updateConsentStateFromData = (
  state: ApplicationState,
  iubendaConsentData: IubendaConsentData,
) => {
  const consentData = getConsentData(iubendaConsentData);
  state.consents.initialized.value = isDefined(iubendaConsentData);
  state.consents.data.value = consentData;
};
const getIubendaCookieName = ( logger?: ILogger ): string => {
  try {
    // Retrieve cookies as a string and split them into an array
    const cookies = document.cookie.split('; ');

    // Find the cookie that matches the iubenda cookie pattern
    const matchedCookie = cookies.find(cookie => {
      const [name] = cookie.split('=');
      return IUBENDA_CONSENT_COOKIE_NAME_PATTERN.test((name || "").trim());
    });

    if (!matchedCookie) {
      throw new Error('Iubenda Cookie not found with the specified pattern.');
    }

    // Extract and return the cookie name
    const [name] = matchedCookie.split('=');
    return name || "";
  } catch (err) {
    logger?.error(IUBENDA_CONSENT_COOKIE_READ_ERROR(IUBENDA_CONSENT_MANAGER_PLUGIN), err);
    return "";
  }
};

export { getIubendaConsentData, getConsentData, updateConsentStateFromData, getIubendaCookieName };
