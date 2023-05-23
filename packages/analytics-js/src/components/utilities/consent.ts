import { CookieConsentOptions } from '@rudderstack/analytics-js/state/types';

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
const getUserSelectedConsentManager = (
  cookieConsentOptions: CookieConsentOptions,
): string | undefined => {
  if (
    !cookieConsentOptions ||
    typeof cookieConsentOptions !== 'object' ||
    Object.keys(cookieConsentOptions).length <= 0
  ) {
    return undefined;
  }
  return Object.keys(cookieConsentOptions).find(e => e && cookieConsentOptions[e].enabled === true);
};

export { getUserSelectedConsentManager };
