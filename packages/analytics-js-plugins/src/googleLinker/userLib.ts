/**
 * An interface to fetch user device details.
 */
const USER_INTERFACE = {
  /**
   * @returns {string} user language
   */
  getUserLanguage: (): string => navigator?.language,

  /**
   * @returns {string} userAgent
   */
  getUserAgent: (): string => navigator?.userAgent,
};

export { USER_INTERFACE };
