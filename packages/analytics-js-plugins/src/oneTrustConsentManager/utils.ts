/* eslint-disable no-param-reassign */
import { ApplicationState } from '../types/common';
import { ConsentInfo } from '../types/plugins';

const updateConsentState = (state: ApplicationState, consentData: ConsentInfo) => {
  state.consents.consentManagerInitialized.value = consentData.initialized;
  state.consents.allowedConsents.value = consentData.allowedConsents ?? {};
  state.consents.deniedConsentIds.value = consentData.deniedConsentIds ?? [];
};

export { updateConsentState };
