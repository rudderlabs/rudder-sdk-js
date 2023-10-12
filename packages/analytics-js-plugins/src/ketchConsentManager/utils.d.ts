import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { ConsentInfo } from '@rudderstack/analytics-js-common/types/Consent';
import { KetchConsentData } from './types';
/**
 * Gets the consent data from the Ketch's consent cookie
 * @param storeManager Store manager instance
 * @param logger Logger instance
 * @returns Consent data from the consent cookie
 */
declare const getKetchConsentData: (
  storeManager?: IStoreManager,
  logger?: ILogger,
) => KetchConsentData | undefined;
/**
 * Gets the consent data in the format expected by the application state
 * @param ketchConsentData Consent data derived from the consent cookie
 * @returns Consent data
 */
declare const getConsentData: (ketchConsentData?: KetchConsentData) => ConsentInfo;
declare const updateConsentStateFromData: (
  state: ApplicationState,
  ketchConsentData: KetchConsentData,
) => void;
export { getKetchConsentData, getConsentData, updateConsentStateFromData };
