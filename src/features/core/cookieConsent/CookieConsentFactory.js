import { OneTrust } from './OneTrust';

class CookieConsentFactory {
  static initialize(cookieConsentOptions) {
    /**
     *
     * check which type of cookie consent manager needs to be called if enabled
     * for now we have only OneTrust.
     * But if new cookie consent manager options are implemented,
     * we need to make sure only one of them is enabled by the user in the
     * load options
     *
     */
    if (cookieConsentOptions?.oneTrust?.enabled) {
      // This is P1. When we have an ui in source side to turn on/off of cookie consent
      // if (sourceConfig &&
      //     sourceConfig.cookieConsentManager &&
      // sourceConfig.cookieConsentManager.oneTrust &&
      // sourceConfig.cookieConsentManager.oneTrustenabled) {
      return new OneTrust();

      // }
    }
    return null;
  }
}

export default CookieConsentFactory;
