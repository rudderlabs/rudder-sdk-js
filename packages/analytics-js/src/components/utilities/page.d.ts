import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
/**
 * Get the referrer URL
 * @returns The referrer URL
 */
declare const getReferrer: () => string;
/**
 * To get the canonical URL of the page
 * @returns canonical URL
 */
declare const getCanonicalUrl: () => string;
declare const getUserAgent: () => Nullable<string>;
declare const getLanguage: () => Nullable<string>;
/**
 * Default page properties
 * @returns Default page properties
 */
declare const getDefaultPageProperties: () => Record<string, any>;
export { getCanonicalUrl, getReferrer, getUserAgent, getLanguage, getDefaultPageProperties };
