/* eslint-disable class-methods-use-this */
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import get from 'get-value';
import logger from '../logUtil';
import { Cookie } from './cookie';
import { Store } from './store';
import { defaultInMemoryStorage } from './memoryStorage';

const defaults = {
  userId: 'userId',
  userTraits: 'userTraits',
  anonymousId: 'anonymousId',
  groupId: 'groupId',
  groupTraits: 'groupTraits',
  pageInitialReferrer: 'pageInitialReferrer',
  pageInitialReferringDomain: 'pageInitialReferringDomain',
  sessionInfo: 'sessionInfo',
  authToken: 'authToken',

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
  key: 'Rudder',
};

const anonymousIdKeyMap = {
  segment: 'ajs_anonymous_id',
};

/**
 * Json stringify the given value
 * @param {*} value
 */
function stringify(value) {
  return JSON.stringify(value);
}

/**
 * JSON parse the value
 * @param {*} value
 */
function parse(value) {
  // if not parsable, return as is without json parse
  try {
    return value ? JSON.parse(value) : null;
  } catch (e) {
    logger.error(e);
    return value || null;
  }
}

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
  if (value.substring(0, defaults.prefix.length) === defaults.prefix) {
    return AES.decrypt(value.substring(defaults.prefix.length), defaults.key).toString(Utf8);
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
    this.storageEntries = {
      [defaults.userId]: {
        key: defaults.user_storage_key,
        storage: defaultInMemoryStorage,
      },
      [defaults.userTraits]: {
        key: defaults.user_storage_trait,
        storage: defaultInMemoryStorage,
      },
      [defaults.anonymousId]: {
        key: defaults.user_storage_anonymousId,
        storage: defaultInMemoryStorage,
      },
      [defaults.groupId]: {
        key: defaults.group_storage_key,
        storage: defaultInMemoryStorage,
      },
      [defaults.groupTraits]: {
        key: defaults.group_storage_trait,
        storage: defaultInMemoryStorage,
      },
      [defaults.pageInitialReferrer]: {
        key: defaults.page_storage_init_referrer,
        storage: defaultInMemoryStorage,
      },
      [defaults.pageInitialReferringDomain]: {
        key: defaults.page_storage_init_referring_domain,
        storage: defaultInMemoryStorage,
      },
      [defaults.sessionInfo]: {
        key: defaults.session_info,
        storage: defaultInMemoryStorage,
      },
      [defaults.authToken]: {
        key: defaults.auth_token,
        storage: defaultInMemoryStorage,
      },
    };
  }

  options(opts = {}) {
    const globalStorageType = opts.type;

    Object.keys(this.storageEntries).forEach((entry) => {
      const storageType = get(opts, `entries.${entry}.type`) || globalStorageType || 'cookie';
      let selectedStorage = null;
      switch (storageType) {
        case 'cookie':
          {
            if (Cookie.isSupportAvailable) {
              selectedStorage = Cookie;
            } else if (Store.isSupportAvailable) {
              selectedStorage = Store;
            } else {
              selectedStorage = defaultInMemoryStorage;
            }
            break;
          }
        case 'localStorage':
          {
            if (Store.isSupportAvailable) {
              selectedStorage = Store;
            } else {
              selectedStorage = defaultInMemoryStorage;
            }
            break;
          }
        case 'memoryStorage':
          selectedStorage = defaultInMemoryStorage;
          break;
        case 'none':
        default:
          selectedStorage = null;
          break;
      }
      if (selectedStorage) {
        selectedStorage.options(opts);
      }
      this.storageEntries[entry].storage = selectedStorage;
      this.migrateDataFromPreviousStorage(selectedStorage, entry);
    });
  }

  migrateDataFromPreviousStorage(curStorage, entry) {
    // in the increasing order of preference
    const storages = [Store, Cookie];
    storages.forEach((stg) => {
      if (stg !== curStorage && stg.isSupportAvailable) {
        const value = stg.get(this.storageEntries[entry].key);
        if (value) {
          if (curStorage) {
            curStorage.set(this.storageEntries[entry].key, value);
          }
          stg.remove(this.storageEntries[entry].key);
        }
      }
    });
  }

  /**
   *
   * @param {*} entry
   * @param {*} value
   */
  setItem(entry, value) {
    if (this.storageEntries[entry] && this.storageEntries[entry].storage) {
      this.storageEntries[entry].storage.set(this.storageEntries[entry].key, encryptValue(stringify(value)));
    }
  }

  /**
   *
   * @param {*} entry
   * @param {*} value
   */
  setStringItem(entry, value) {
    if (typeof value !== 'string') {
      logger.error(`[Storage] ${entry} should be string`);
      return;
    }
    this.setItem(entry, value);
  }

  /**
   *
   * @param {*} value
   */
  setUserId(value) {
    this.setStringItem(defaults.userId, value);
  }

  /**
   *
   * @param {*} value
   */
  setUserTraits(value) {
    this.setItem(defaults.userTraits, value);
  }

  /**
   *
   * @param {*} value
   */
  setGroupId(value) {
    this.setStringItem(defaults.groupId, value);
  }

  /**
   *
   * @param {*} value
   */
  setGroupTraits(value) {
    this.setItem(defaults.groupTraits, value);
  }

  /**
   *
   * @param {*} value
   */
  setAnonymousId(value) {
    this.setStringItem(defaults.anonymousId, value);
  }

  /**
   * @param {*} value
   */
  setInitialReferrer(value) {
    this.setItem(defaults.pageInitialReferrer, value);
  }

  /**
   * @param {*} value
   */
  setInitialReferringDomain(value) {
    this.setItem(defaults.pageInitialReferringDomain, value);
  }

  /**
   * Set session information
   * @param {*} value
   */
  setSessionInfo(value) {
    this.setItem(defaults.sessionInfo, value);
  }

  /**
   * Set auth token for CT server
   * @param {*} value
   */
  setAuthToken(value) {
    this.setItem(defaults.authToken, value);
  }

  /**
   *
   * @param {*} entry
   */
  getItem(entry) {
    if (this.storageEntries[entry] && this.storageEntries[entry].storage) {
      return parse(decryptValue(this.storageEntries[entry].storage.get(this.storageEntries[entry].key)));
    }
    return null;
  }

  /**
   * get the stored userId
   */
  getUserId() {
    return this.getItem(defaults.userId);
  }

  /**
   * get the stored user traits
   */
  getUserTraits() {
    return this.getItem(defaults.userTraits);
  }

  /**
   * get the stored userId
   */
  getGroupId() {
    return this.getItem(defaults.groupId);
  }

  /**
   * get the stored user traits
   */
  getGroupTraits() {
    return this.getItem(defaults.groupTraits);
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
        if (Store.isSupportAvailable) {
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
    const rlAnonymousId = this.getItem(defaults.anonymousId);
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
    return this.getItem(defaults.pageInitialReferrer);
  }

  /**
   * get stored initial referring domain
   */
  getInitialReferringDomain() {
    return this.getItem(defaults.pageInitialReferringDomain);
  }

  /**
   * get the stored session info
   */
  getSessionInfo() {
    return this.getItem(defaults.sessionInfo);
  }

  /**
   * get the auth token
   */
  getAuthToken() {
    return this.getItem(defaults.authToken);
  }

  /**
   *
   * @param {*} entry
   */
  removeItem(entry) {
    if (this.storageEntries[entry] && this.storageEntries[entry].storage) {
      return this.storageEntries[entry].storage.remove(this.storageEntries[entry].key);
    }
    return false;
  }

  removeSessionInfo() {
    this.removeItem(defaults.sessionInfo);
  }

  /**
   * remove stored keys
   */
  clear(flag) {
    this.removeItem(defaults.userId);
    this.removeItem(defaults.userTraits);
    this.removeItem(defaults.groupId);
    this.removeItem(defaults.groupTraits);
    this.removeItem(defaults.authToken);

    if (flag) {
      this.removeItem(defaults.anonymousId);
    }
  }
}

export { Storage };
