import { CookieConsentOptions } from '@rudderstack/analytics-js-common/types/Consent';
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
declare const getUserSelectedConsentManager: (
  cookieConsentOptions?: CookieConsentOptions,
) => string | undefined;
export { getUserSelectedConsentManager };
