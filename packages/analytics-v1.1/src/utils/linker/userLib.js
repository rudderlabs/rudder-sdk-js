/**
 * @description An interface to fetch user device details.
 * @version v1.0.0
 */

const USER_INTERFACE = {
  /**
   * @param {*} req
   * @returns {string} user language
   */
  getUserLanguage: () => navigator && navigator.language,

  /**
   * @param {*} req
   * @returns {string} userAgent
   */
  getUserAgent: () => navigator && navigator.userAgent,
};

export default USER_INTERFACE;
