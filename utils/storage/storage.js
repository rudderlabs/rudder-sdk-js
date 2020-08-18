/* eslint-disable import/prefer-default-export */
/* eslint-disable eqeqeq */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
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

const v1Defaults = {
  user_storage_key: "rl_user_id_v1",
  user_storage_trait: "rl_trait_v1",
  user_storage_anonymousId: "rl_anonymous_id_v1",
  group_storage_key: "rl_group_id_v1",
  group_storage_trait: "rl_group_trait_v1",
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

  checkIfMigrate() {
    try {
      return !this.getItem(v1Defaults.user_storage_anonymousId);
    } catch (e) {
      logger.debug(e);
      return true;
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
      logger.debug(e);
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
    if (
      !value ||
      (typeof value === "string" && this.trim(value) === "") ||
      typeof value !== "string"
    ) {
      return value;
    }
    // value = this.parse(value);
    while (value.indexOf(defaults.prefix) >= 0) {
      const index = value.indexOf(defaults.prefix);
      const substring = value.substring(index + defaults.prefix.length);
      const dvalue = AES.decrypt(substring, defaults.key).toString(Utf8);
      value = dvalue;
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
  setUserId(value, migrate) {
    if (typeof value !== "string") {
      logger.error("[Storage] setUserId:: userId should be string");
      return;
    }
    this.storage.set(
      migrate ? defaults.user_storage_key : v1Defaults.user_storage_key,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   *
   * @param {*} value
   */
  setUserTraits(value, migrate) {
    this.storage.set(
      migrate ? defaults.user_storage_trait : v1Defaults.user_storage_trait,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   *
   * @param {*} value
   */
  setGroupId(value, migrate) {
    if (typeof value !== "string") {
      logger.error("[Storage] setGroupId:: groupId should be string");
      return;
    }
    this.storage.set(
      migrate ? defaults.group_storage_key : v1Defaults.group_storage_key,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   *
   * @param {*} value
   */
  setGroupTraits(value, migrate) {
    this.storage.set(
      migrate ? defaults.group_storage_trait : v1Defaults.group_storage_trait,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   *
   * @param {*} value
   */
  setAnonymousId(value, migrate) {
    if (typeof value !== "string") {
      logger.error("[Storage] setAnonymousId:: anonymousId should be string");
      return;
    }
    this.storage.set(
      migrate
        ? defaults.user_storage_anonymousId
        : v1Defaults.user_storage_anonymousId,
      this.encryptValue(this.stringify(value))
    );
  }

  /**
   *
   * @param {*} key
   */
  getItem(key) {
    const item = this.storage.get(key);
    const decryptedValue = this.decryptValue(item);
    const parsedValue = this.parse(decryptedValue);
    return parsedValue;
  }

  /**
   * get the stored userId
   */
  getUserId(migrate) {
    const userId = this.storage.get(
      migrate ? defaults.user_storage_key : v1Defaults.user_storage_key
    );
    const decryptedValue = this.decryptValue(userId);
    const parsedValue = this.parse(decryptedValue);
    return parsedValue;
  }

  /**
   * get the stored user traits
   */
  getUserTraits(migrate) {
    const traits = this.storage.get(
      migrate ? defaults.user_storage_trait : v1Defaults.user_storage_trait
    );
    const decryptedValue = this.decryptValue(traits);
    const parsedValue = this.parse(decryptedValue);
    return parsedValue;
  }

  /**
   * get the stored userId
   */
  getGroupId(migrate) {
    const groupId = this.storage.get(
      migrate ? defaults.group_storage_key : v1Defaults.group_storage_key
    );
    const decryptedValue = this.decryptValue(groupId);
    const parsedValue = this.parse(decryptedValue);
    return parsedValue;
  }

  /**
   * get the stored user traits
   */
  getGroupTraits(migrate) {
    const groupTraits = this.storage.get(
      migrate ? defaults.group_storage_trait : v1Defaults.group_storage_trait
    );
    const decryptedValue = this.decryptValue(groupTraits);
    const parsedValue = this.parse(decryptedValue);
    return parsedValue;
  }

  /**
   * get stored anonymous id
   */
  getAnonymousId(migrate) {
    const anonymousId = this.storage.get(
      migrate
        ? defaults.user_storage_anonymousId
        : v1Defaults.user_storage_anonymousId
    );
    const decryptedValue = this.decryptValue(anonymousId);
    const parsedValue = this.parse(decryptedValue);
    return parsedValue;
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
    this.storage.remove(v1Defaults.user_storage_key);
    this.storage.remove(v1Defaults.user_storage_trait);
    this.storage.remove(v1Defaults.group_storage_key);
    this.storage.remove(v1Defaults.group_storage_trait);
    // this.storage.remove(defaults.user_storage_anonymousId);
  }

  getPrefix() {
    return defaults.prefix;
  }
}

export { Storage };
