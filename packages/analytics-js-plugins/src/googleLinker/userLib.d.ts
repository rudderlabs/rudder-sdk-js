/**
 * An interface to fetch user device details.
 */
declare const USER_INTERFACE: {
  /**
   * @returns {string} user language
   */
  getUserLanguage: () => string;
  /**
   * @returns {string} userAgent
   */
  getUserAgent: () => string;
};
export { USER_INTERFACE };
