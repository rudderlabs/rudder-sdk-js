/* eslint-disable class-methods-use-this */
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import get from "get-value";
import logger from "../logUtil";
import { Cookie } from "./cookie";
import { Store } from "./store";

const defaults = {
  user_storage_key: "rl_user_id",
  user_storage_trait: "rl_trait",
  user_storage_anonymousId: "rl_anonymous_id",
  group_storage_key: "rl_group_id",
  group_storage_trait: "rl_group_trait",
  page_storage_init_referrer: "rl_page_init_referrer",
  page_storage_init_referring_domain: "rl_page_init_referring_domain",
  prefix: "RudderEncrypt:",
  key: "Rudder",
};

const anonymousIdKeyMap = {
  segment: "ajs_anonymous_id",
};

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
      throw Error("Could not initialize the SDK :: no storage is available");
    }
  }

  options(options = {}) {
    this.storage.options(options);
  }

  /**
   * Json stringify the given value
   * @param {*} value
   */
  stringify(value) {
    return JSON.stringify(value);
  }

  /**
   * JSON parse the value
   * @param {*} value
   */
  parse(value) {
    // if not parseable, return as is without json parse
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
  trim(value) {
    return value.replace(/^\s+|\s+$/gm, "");
  }

  /**
   * AES encrypt value with constant prefix
   * @param {*} value
   */
  encryptValue(value) {
    if (this.trim(value) == "") {
      return value;
    }
    const prefixedVal = `${defaults.prefix}${AES.encrypt(
      value,
      defaults.key
    ).toString()}`;

    return prefixedVal;
  }

  /**
   * decrypt value
   * @param {*} value
   */
  decryptValue(value) {
    if (!value || (typeof value === "string" && this.trim(value) == "")) {
      return value;
    }
    if (value.substring(0, defaults.prefix.length) == defaults.prefix) {
      return AES.decrypt(
        value.substring(defaults.prefix.length),
        defaults.key
      ).toString(Utf8);
    }
    return value;
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  setItem(key, value) {
    this.storage.set(key, this.encryptValue(this.stringify(value)));
  }

  /**
   *
   * @param {*} value
   */
  setUserId(value) {
    if (typeof value !== "string") {
      logger.error("[Storage] setUserId:: userId should be string");
      return;
    }
    this.storage.set(
      defaults.user_storage_key,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   *
   * @param {*} value
   */
  setUserTraits(value) {
    this.storage.set(
      defaults.user_storage_trait,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   *
   * @param {*} value
   */
  setGroupId(value) {
    if (typeof value !== "string") {
      logger.error("[Storage] setGroupId:: groupId should be string");
      return;
    }
    this.storage.set(
      defaults.group_storage_key,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   *
   * @param {*} value
   */
  setGroupTraits(value) {
    this.storage.set(
      defaults.group_storage_trait,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   *
   * @param {*} value
   */
  setAnonymousId(value) {
    if (typeof value !== "string") {
      logger.error("[Storage] setAnonymousId:: anonymousId should be string");
      return;
    }
    this.storage.set(
      defaults.user_storage_anonymousId,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   * @param {*} value
   */
  setInitialReferrer(value) {
    this.storage.set(
      defaults.page_storage_init_referrer,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   * @param {*} value
   */
  setInitialReferringDomain(value) {
    this.storage.set(
      defaults.page_storage_init_referring_domain,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   *
   * @param {*} key
   */
  getItem(key) {
    return this.parse(this.decryptValue(this.storage.get(key)));
  }

  /**
   * get the stored userId
   */
  getUserId() {
    return this.parse(
      this.decryptValue(this.storage.get(defaults.user_storage_key))
    );
  }

  /**
   * get the stored user traits
   */
  getUserTraits() {
    return this.parse(
      this.decryptValue(this.storage.get(defaults.user_storage_trait))
    );
  }

  /**
   * get the stored userId
   */
  getGroupId() {
    return this.parse(
      this.decryptValue(this.storage.get(defaults.group_storage_key))
    );
  }

  /**
   * get the stored user traits
   */
  getGroupTraits() {
    return this.parse(
      this.decryptValue(this.storage.get(defaults.group_storage_trait))
    );
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
    switch (key) {
      case "segment":
        /**
         * First check the local storage for anonymousId
         * Ref: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/#identify
         */
        if (Store.enabled) {
          anonId = Store.get(anonymousIdKeyMap[key]);
        }
        // If anonymousId is not present in local storage and check cookie support exists
        // fetch it from cookie
        if (!anonId && Cookie.IsCookieSupported()) {
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
    const rlAnonymousId = this.parse(
      this.decryptValue(this.storage.get(defaults.user_storage_anonymousId))
    );
    /**
     * If rl_anonymous_id is already present return the value rather then executing the rest of the block
     */
    if (rlAnonymousId) {
      return rlAnonymousId;
    }
    // validate the provided anonymousIdOptions argument
    const source = get(anonymousIdOptions, "autoCapture.source");
    if (
      get(anonymousIdOptions, "autoCapture.enabled") === true &&
      typeof source === "string"
    ) {
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
  getInitialReferrer(value) {
    return this.parse(
      this.decryptValue(this.storage.get(defaults.page_storage_init_referrer))
    );
  }

  /**
   * get stored initial referring domain
   */
  getInitialReferringDomain(value) {
    return this.parse(
      this.decryptValue(
        this.storage.get(defaults.page_storage_init_referring_domain)
      )
    );
  }

  /**
   *
   * @param {*} key
   */
  removeItem(key) {
    return this.storage.remove(key);
  }

  /**
   * remove stored keys
   */
  clear(flag) {
    this.storage.remove(defaults.user_storage_key);
    this.storage.remove(defaults.user_storage_trait);
    this.storage.remove(defaults.group_storage_key);
    this.storage.remove(defaults.group_storage_trait);
    if (flag) {
      this.storage.remove(defaults.user_storage_anonymousId);
    }
  }
}

export { Storage };
