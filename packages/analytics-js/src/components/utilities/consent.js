import { isNonEmptyObject } from '@rudderstack/analytics-js-common/utilities/object';
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
const getUserSelectedConsentManager = cookieConsentOptions => {
  if (!isNonEmptyObject(cookieConsentOptions)) {
    return undefined;
  }
  const validCookieConsentOptions = cookieConsentOptions;
  return Object.keys(validCookieConsentOptions).find(
    e => e && validCookieConsentOptions[e].enabled === true,
  );
};
export { getUserSelectedConsentManager };
