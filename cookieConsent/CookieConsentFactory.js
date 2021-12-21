import * as OneTrust from "./OneTrust";

const cookieConsent = {
  OneTrust: OneTrust.default,
};
class CookieConsentFactory {
  constructor(sourceConfig) {
    // if (sourceConfig.cookieConsentManager.oneTrust.enabled) {
    const CookieConsentClass = cookieConsent.OneTrust;
    return new CookieConsentClass();
    // }
  }
}

export default CookieConsentFactory;
