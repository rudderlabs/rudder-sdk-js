/* eslint-disable class-methods-use-this */
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
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
  return value.replace(/^\s+|\s+$/gm, "");
}

/**
 * decrypt value
 * @param {*} value
 */
function decryptValue(value) {
  if (!value || (typeof value === "string" && trim(value) === "")) {
    return value;
  }
  if (value.substring(0, defaults.prefix.length) === defaults.prefix) {
    return AES.decrypt(
      value.substring(defaults.prefix.length),
      defaults.key
    ).toString(Utf8);
  }
  return value;
}

/**
 * AES encrypt value with constant prefix
 * @param {*} value
 */
function encryptValue(value) {
  if (trim(value) === "") {
    return value;
  }
  const prefixedVal = `${defaults.prefix}${AES.encrypt(
    value,
    defaults.key
  ).toString()}`;

  return prefixedVal;
}

/**
 * An object that handles persisting key-val from Analytics
 */
class Storage {
  constructor() {
    // First try setting the storage to cookie else to localstorage
    Cookie.set("rudder_cookies", true);

    if (Cookie.get("rudder_cookies")) {
      Cookie.remove("rudder_cookies");
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
   *
   * @param {*} key
   * @param {*} value
   */
  setItem(key, value) {
    this.storage.set(key, encryptValue(stringify(value)));
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  setStringItem(key, value) {
    if (typeof value !== "string") {
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
   *
   * @param {*} key
   */
  getItem(key) {
    return parse(decryptValue(this.storage.get(key)));
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
   * get stored anonymous id
   */
  getAnonymousId() {
    return this.getItem(defaults.user_storage_anonymousId);
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

// eslint-disable-next-line import/prefer-default-export
export { Storage };
