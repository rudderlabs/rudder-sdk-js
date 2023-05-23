import { CookieConsentOptions } from './types';

/**
 * A function to get the name of the consent manager with enabled true set in the load options
 * @param cookieConsentOptions Input provided as load option
 * @returns string|undefined
 *
 * Example input: {
 *   oneTrust:{
 *     enabled: true
 *   }
 * }
 *
 * Output: 'oneTrust'
 */
const getUserSelectedConsentManager = (cookieConsentOptions?: CookieConsentOptions) => {
  if (!cookieConsentOptions) {
    return undefined;
  }
  const providedConsentManagers = Object.keys(cookieConsentOptions);
  if (providedConsentManagers.length > 0) {
    return providedConsentManagers.find((e: any) => e && cookieConsentOptions[e].enabled === true);
  }
  return undefined;
};

export { getUserSelectedConsentManager };
