/**
 * An interface to fetch user device details.
 */
const USER_INTERFACE = {
  /**
   * @returns {string} user language
   */
  getUserLanguage: () => (navigator === null || navigator === void 0 ? void 0 : navigator.language),
  /**
   * @returns {string} userAgent
   */
  getUserAgent: () => (navigator === null || navigator === void 0 ? void 0 : navigator.userAgent),
};
export { USER_INTERFACE };
