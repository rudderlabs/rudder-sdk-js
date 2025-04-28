/* eslint-disable class-methods-use-this */
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import get from 'get-value';
import { logger } from '../logUtil';
import { Cookie } from './cookie';
import { Store } from './store';
import { fromBase64 } from './v3DecryptionUtils';
import { stringifyWithoutCircularV1 } from '../ObjectUtils';

const defaults = {
  user_storage_key: 'rl_user_id',
  user_storage_trait: 'rl_trait',
  user_storage_anonymousId: 'rl_anonymous_id',
  group_storage_key: 'rl_group_id',
  group_storage_trait: 'rl_group_trait',
  page_storage_init_referrer: 'rl_page_init_referrer',
  page_storage_init_referring_domain: 'rl_page_init_referring_domain',
  session_info: 'rl_session',
  auth_token: 'rl_auth_token',
  prefix: 'RudderEncrypt:',
  prefixV3: 'RS_ENC_v3_', // prefix for v3 encryption
  key: 'Rudder',
};

const anonymousIdKeyMap = {
  segment: 'ajs_anonymous_id',
};

const CORRUPTED_COOKIES_WARNING = key =>
  `Unable to retrieve the cookie data for ${key}. The data is dropped. This can potentially stem from using SDK v3 on other sites or web pages that can share cookies with this webpage. Please use the same SDK (v3) version everywhere as soon as possible.`;

/**
 * trim using regex for browser polyfill
 * @param {*} value
 */
function trim(value) {
  return value.replace(/^\s+|\s+$/gm, '');
}

/**
 * decrypt value
 * @param {*} value
 */
function decryptValue(value) {
  if (!value || typeof value !== 'string' || trim(value) === '') {
    return value;
  }
  if (value.startsWith(defaults.prefix)) {
    return AES.decrypt(value.substring(defaults.prefix.length), defaults.key).toString(Utf8);
  }

  // Try if it is v3 encrypted value
  if (value.startsWith(defaults.prefixV3)) {
    return fromBase64(value.substring(defaults.prefixV3.length));
  }
  return value;
}

/**
 * AES encrypt value with constant prefix
 * @param {*} value
 */
function encryptValue(value) {
  if (trim(value) === '') {
    return value;
  }
  const prefixedVal = `${defaults.prefix}${AES.encrypt(value, defaults.key).toString()}`;

  return prefixedVal;
}

/**
 * An object that handles persisting key-val from Analytics
 */
class Storage {
  constructor() {
    // First try setting the storage to cookie else to localstorage

    if (Cookie.isSupportAvailable) {
      this.storage = Cookie;
      return;
    }

    // localStorage is enabled.
    if (Store.enabled) {
      this.storage = Store;
    }

    if (!this.storage) {
      logger.error('No storage is available :: initializing the SDK without storage');
    }
  }

  options(options = {}) {
    this.storage.options(options);
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  setItem(key, value) {
    const sanitizedValue = stringifyWithoutCircularV1(value);
    if (sanitizedValue !== null) {
      this.storage.set(key, encryptValue(sanitizedValue));
    }
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  setStringItem(key, value) {
    if (typeof value !== 'string') {
      logger.error(`[Storage] ${key} should be string`);
      return;
    }
    this.setItem(key, value);
  }

  /**
   *
   * @param {*} value
   */
  setUserId(value) {
    this.setStringItem(defaults.user_storage_key, value);
  }

  /**
   *
   * @param {*} value
   */
  setUserTraits(value) {
    this.setItem(defaults.user_storage_trait, value);
  }

  /**
   *
   * @param {*} value
   */
  setGroupId(value) {
    this.setStringItem(defaults.group_storage_key, value);
  }

  /**
   *
   * @param {*} value
   */
  setGroupTraits(value) {
    this.setItem(defaults.group_storage_trait, value);
  }

  /**
   *
   * @param {*} value
   */
  setAnonymousId(value) {
    this.setStringItem(defaults.user_storage_anonymousId, value);
  }

  /**
   * @param {*} value
   */
  setInitialReferrer(value) {
    this.setItem(defaults.page_storage_init_referrer, value);
  }

  /**
   * @param {*} value
   */
  setInitialReferringDomain(value) {
    this.setItem(defaults.page_storage_init_referring_domain, value);
  }

  /**
   * Set session information
   * @param {*} value
   */
  setSessionInfo(value) {
    this.setItem(defaults.session_info, value);
  }

  /**
   * Set auth token for CT server
   * @param {*} value
   */
  setAuthToken(value) {
    this.setItem(defaults.auth_token, value);
  }

  /**
   *
   * @param {*} key
   */
  getItem(key) {
    try {
      let currentValue = this.storage.get(key);

      let decryptedValue = decryptValue(currentValue);
      currentValue = decryptedValue ? JSON.parse(decryptedValue) : null;

      // Recursively decrypt the value until we reach a point where the value
      // is not encrypted anymore
      while (typeof currentValue === 'string') {
        decryptedValue = decryptValue(currentValue);

        // If the decrypted value is the same as the current value,
        // then it's not encrypted anymore
        if (decryptedValue === currentValue) {
          break;
        }

        currentValue = JSON.parse(decryptedValue);
      }

      return currentValue;
    } catch (err) {
      // Log the error and drop the value
      logger.error(CORRUPTED_COOKIES_WARNING(key), err);
      return null;
    }
  }

  /**
   * get the stored userId
   */
  getUserId() {
    return this.getItem(defaults.user_storage_key);
  }

  /**
   * get the stored user traits
   */
  getUserTraits() {
    return this.getItem(defaults.user_storage_trait);
  }

  /**
   * get the stored userId
   */
  getGroupId() {
    return this.getItem(defaults.group_storage_key);
  }

  /**
   * get the stored user traits
   */
  getGroupTraits() {
    return this.getItem(defaults.group_storage_trait);
  }

  /**
   * Function to fetch anonymousId from external source
   * @param {string} key source of the anonymousId
   * @returns string
   */
  fetchExternalAnonymousId(source) {
    let anonId;
    const key = source.toLowerCase();
    if (!Object.keys(anonymousIdKeyMap).includes(key)) {
      return anonId;
    }
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (key) {
      case 'segment':
        /**
         * First check the local storage for anonymousId
         * Ref: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
         */
        if (Store.enabled) {
          anonId = Store.get(anonymousIdKeyMap[key]);
        }
        // If anonymousId is not present in local storage and check cookie support exists
        // fetch it from cookie
        if (!anonId && Cookie.isSupportAvailable) {
          anonId = Cookie.get(anonymousIdKeyMap[key]);
        }
        return anonId;

      default:
        return anonId;
    }
  }

  /**
   * get stored anonymous id
   *
   * Use cases:
   * 1. getAnonymousId() ->  anonymousIdOptions is undefined this function will return rl_anonymous_id
   * if present otherwise undefined
   *
   * 2. getAnonymousId(anonymousIdOptions) -> In case anonymousIdOptions is present this function will check
   * if rl_anonymous_id is present then it will return that
   *
   * otherwise it will validate the anonymousIdOptions and try to fetch the anonymous Id from the provided source.
   * Finally if no anonymous Id is present in the source it will return undefined.
   *
   * anonymousIdOptions example:
   *  {
        autoCapture: {
          enabled: true,
          source: "segment",
        },
      }
   *
   */
  getAnonymousId(anonymousIdOptions) {
    // fetch the rl_anonymous_id from storage
    const rlAnonymousId = this.getItem(defaults.user_storage_anonymousId);
    /**
     * If RS's anonymous ID is available, return from here.
     *
     * The user, while migrating from a different analytics SDK,
     * will only need to auto-capture the anonymous ID when the RS SDK
     * loads for the first time.
     *
     * The captured anonymous ID would be available in RS's persistent storage
     * for all the subsequent SDK runs.
     * So, instead of always grabbing the ID from the migration source when
     * the options are specified, it is first checked in the RS's persistent storage.
     *
     * Moreover, the user can also clear the anonymous ID from the storage via
     * the 'reset' API, which renders the migration source's data useless.
     */
    if (rlAnonymousId) {
      return rlAnonymousId;
    }
    // validate the provided anonymousIdOptions argument
    const source = get(anonymousIdOptions, 'autoCapture.source');
    if (get(anonymousIdOptions, 'autoCapture.enabled') === true && typeof source === 'string') {
      // fetch the anonymousId from the external source
      // ex - segment
      const anonId = this.fetchExternalAnonymousId(source);
      if (anonId) return anonId; // return anonymousId if present
    }

    return rlAnonymousId; // return undefined
  }

  /**
   * get stored initial referrer
   */
  getInitialReferrer() {
    return this.getItem(defaults.page_storage_init_referrer);
  }

  /**
   * get stored initial referring domain
   */
  getInitialReferringDomain() {
    return this.getItem(defaults.page_storage_init_referring_domain);
  }

  /**
   * get the stored session info
   */
  getSessionInfo() {
    return this.getItem(defaults.session_info);
  }

  /**
   * get the auth token
   */
  getAuthToken() {
    return this.getItem(defaults.auth_token);
  }

  /**
   *
   * @param {*} key
   */
  removeItem(key) {
    return this.storage.remove(key);
  }

  removeSessionInfo() {
    this.removeItem(defaults.session_info);
  }

  /**
   * remove stored keys
   */
  clear(flag) {
    this.storage.remove(defaults.user_storage_key);
    this.storage.remove(defaults.user_storage_trait);
    this.storage.remove(defaults.group_storage_key);
    this.storage.remove(defaults.group_storage_trait);
    this.storage.remove(defaults.auth_token);
    if (flag) {
      this.storage.remove(defaults.user_storage_anonymousId);
    }
  }
}

export { Storage };
