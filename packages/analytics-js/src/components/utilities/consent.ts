import { CookieConsentOptions } from '@rudderstack/analytics-js/state/types';
import { isNonEmptyObject } from './object';

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
  cookieConsentOptions?: CookieConsentOptions,
): string | undefined => {
  if (!isNonEmptyObject(cookieConsentOptions)) {
    return undefined;
  }

  const validCookieConsentOptions = cookieConsentOptions as CookieConsentOptions;
  return Object.keys(validCookieConsentOptions).find(
    e => e && validCookieConsentOptions[e].enabled === true,
  );
};

export { getUserSelectedConsentManager };
