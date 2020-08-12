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
  prefix: "RudderEncrypt:",
  key: "Rudder",
};

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
   * get stored anonymous id
   */
  getAnonymousId() {
    return this.parse(
      this.decryptValue(this.storage.get(defaults.user_storage_anonymousId))
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
  clear() {
    this.storage.remove(defaults.user_storage_key);
    this.storage.remove(defaults.user_storage_trait);
    this.storage.remove(defaults.group_storage_key);
    this.storage.remove(defaults.group_storage_trait);
    // this.storage.remove(defaults.user_storage_anonymousId);
  }
}

export { Storage };
