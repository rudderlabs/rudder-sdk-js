import { SDK_VERSION_CONFIG_KEY, SDK_V1, SDK_V2 } from './constants';

/**
 * Resolves the Customer.io client version from the destination config.
 * Only an explicit 'v2' selects 2.x; anything else, including a missing key, is 1.x so existing
 * destinations keep loading the legacy snippet.
 * @param {Object} config destination config
 * @returns {string} SDK_V1 or SDK_V2
 */
const getSdkVersion = config => (config?.[SDK_VERSION_CONFIG_KEY] === SDK_V2 ? SDK_V2 : SDK_V1);

export { getSdkVersion };
