/* eslint-disable no-param-reassign */
import { ApplicationState, ILogger, IStoreManager } from '../types/common';
import { ConsentInfo } from '../types/plugins';
import { COOKIE_STORAGE, fromBase64 } from '../utilities/common';
import { KETCH_CONSENT_COOKIE_V1, KETCH_CONSENT_MANAGER_PLUGIN } from './constants';
import { KetchConsentCookieData, KetchConsentData } from './types';

const getKetchConsentData = (
  storeManager?: IStoreManager,
  logger?: ILogger,
): KetchConsentData | undefined => {
  const dataStore = storeManager?.setStore({
    id: KETCH_CONSENT_MANAGER_PLUGIN,
    name: KETCH_CONSENT_MANAGER_PLUGIN,
    type: COOKIE_STORAGE,
  });

  const consentData = dataStore?.get(KETCH_CONSENT_COOKIE_V1);
  if (!consentData) {
    return undefined;
  }

  let consentCookieData: KetchConsentCookieData;
  try {
    consentCookieData = JSON.parse(fromBase64(consentData));
  } catch (e) {
    logger?.error(`${KETCH_CONSENT_MANAGER_PLUGIN}:: Failed to parse the consent cookie.`, e);
    return undefined;
  }

  if (!consentCookieData) {
    return undefined;
  }

  const consentPurposes: KetchConsentData = {};
  Object.entries(consentCookieData).forEach(pEntry => {
    const purposeCode = pEntry[0];
    const purposeValue = pEntry[1];
    consentPurposes[purposeCode] = purposeValue?.status === 'granted';
  });
  return consentPurposes;
};

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

const updateConsentState = (state: ApplicationState, consentData: ConsentInfo) => {
  state.consents.consentManagerInitialized.value = true;
  state.consents.allowedConsents.value = consentData.allowedConsents ?? [];
  state.consents.deniedConsentIds.value = consentData.deniedConsentIds ?? [];
};

export { getKetchConsentData, getConsentData, updateConsentState };
