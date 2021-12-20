import * as OneTrust from "./OneTrust";

const cookieConsent = {
  OneTrust: OneTrust.default,
};
const callCookieConsentManager = (response, destConfig) => {
  const sourceConfig = response.source.config;
  let cookieConsentInstance;
  // if (sourceConfig.cookieConsentManager.oneTrust.enabled) {
  const cookieConsentClass = cookieConsent.OneTrust;
  cookieConsentInstance = new cookieConsentClass(sourceConfig, destConfig);
  const enable = cookieConsentInstance.init();
  return enable;
  // }
};

const getIntegrationsAfterCookieConsent = (clientIntegrations, response) => {
  const clientIntegrationsEnabled = [];
  clientIntegrations.forEach((intg) => {
    const destConfig = intg.config;
    const enable = callCookieConsentManager(response, destConfig);
    if (enable) {
      clientIntegrationsEnabled.push(intg);
    }
  });
  return clientIntegrationsEnabled;
};

export { getIntegrationsAfterCookieConsent };
