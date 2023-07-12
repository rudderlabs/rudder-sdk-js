import { ILogger, IStoreManager } from '../types/common';
import { COOKIE_STORAGE, fromBase64 } from '../utilities/common';
import { KETCH_CONSENT_COOKIE_V1, KETCH_CONSENT_MANAGER_PLUGIN } from './constants';
import { ConsentData, KetchConsentData, KetchConsentPurposes } from './types';

const getKetchConsentData = (
  storeManager?: IStoreManager,
  logger?: ILogger,
): KetchConsentPurposes | undefined => {
  const dataStore = storeManager?.setStore({
    id: KETCH_CONSENT_MANAGER_PLUGIN,
    name: KETCH_CONSENT_MANAGER_PLUGIN,
    type: COOKIE_STORAGE,
  });

  const consentData = dataStore?.get(KETCH_CONSENT_COOKIE_V1);
  if (!consentData) {
    return undefined;
  }

  let consentObj: KetchConsentData;
  try {
    consentObj = JSON.parse(fromBase64(consentData));
  } catch (e) {
    logger?.error(`${KETCH_CONSENT_MANAGER_PLUGIN}:: Failed to parse the consent cookie.`, e);
    return undefined;
  }

  if (!consentObj) {
    return undefined;
  }

  const consentPurposes: KetchConsentPurposes = {};
  Object.entries(consentObj).forEach(pEntry => {
    const purposeCode = pEntry[0];
    const purposeValue = pEntry[1];
    consentPurposes[purposeCode] = purposeValue?.status === 'granted';
  });
  return consentPurposes;
};

const getConsentData = (ketchConsentData?: KetchConsentPurposes): ConsentData => {
  const allowedConsents: string[] = [];
  const deniedConsentIds: string[] = [];

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
  }

  return { allowedConsents, deniedConsentIds };
};

export { getKetchConsentData, getConsentData };
