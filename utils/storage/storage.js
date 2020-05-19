import logger from "../logUtil";
import { Cookie } from "./cookie";
import { Store } from "./store";
let defaults = {
  user_storage_key: "rl_user_id",
  user_storage_trait: "rl_trait",
  user_storage_anonymousId: "rl_anonymous_id",
  group_storage_key: "rl_group_id",
  group_storage_trait: "rl_group_trait"
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
      return;
    }
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  setItem(key, value) {
    this.storage.set(key, value);
  }

  /**
   *
   * @param {*} value
   */
  setUserId(value) {
    if (typeof value != "string") {
      logger.error("[Storage] setUserId:: userId should be string");
      return;
    }
    this.storage.set(defaults.user_storage_key, value);
    return;
  }

  /**
   *
   * @param {*} value
   */
  setUserTraits(value) {
    this.storage.set(defaults.user_storage_trait, value);
    return;
  }

  /**
   *
   * @param {*} value
   */
  setGroupId(value) {
    if (typeof value != "string") {
      logger.error("[Storage] setGroupId:: groupId should be string");
      return;
    }
    this.storage.set(defaults.group_storage_key, value);
    return;
  }

  /**
   *
   * @param {*} value
   */
  setGroupTraits(value) {
    this.storage.set(defaults.group_storage_trait, value);
    return;
  }

  /**
   *
   * @param {*} value
   */
  setAnonymousId(value) {
    if (typeof value != "string") {
      logger.error("[Storage] setAnonymousId:: anonymousId should be string");
      return;
    }
    this.storage.set(defaults.user_storage_anonymousId, value);
    return;
  }

  /**
   *
   * @param {*} key
   */
  getItem(key) {
    return this.storage.get(key);
  }

  /**
   * get the stored userId
   */
  getUserId() {
    return this.storage.get(defaults.user_storage_key);
  }

  /**
   * get the stored user traits
   */
  getUserTraits() {
    return this.storage.get(defaults.user_storage_trait);
  }

  /**
   * get the stored userId
   */
  getGroupId() {
    return this.storage.get(defaults.group_storage_key);
  }

  /**
   * get the stored user traits
   */
  getGroupTraits() {
    return this.storage.get(defaults.group_storage_trait);
  }

  /**
   * get stored anonymous id
   */
  getAnonymousId() {
    return this.storage.get(defaults.user_storage_anonymousId);
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
    // this.storage.remove(defaults.user_storage_anonymousId);
  }
}

export { Storage };
