import logger from "../logUtil"
let defaults = {
  user_storage_key: "rl_user_id",
  user_storage_trait: "rl_trait",
  user_storage_anonymousId: "rl_anonymous_id"
};
class Storage {
  constructor() {
    this.storage = window.localStorage;
  }
  setItem(key, value) {
    let stringValue = "";
    if (typeof value == "string") {
      stringValue = value;
    }
    if (typeof value == "object") {
      stringValue = JSON.stringify(value);
    }
    this.storage.setItem(key, stringValue);
  }
  setUserId(value) {
    if (typeof value != "string") {
      logger.error("userId should be string");
      return;
    }
    this.storage.setItem(defaults.user_storage_key, value);
    return;
  }
  setUserTraits(value) {
    if (typeof value != "object") {
      logger.error("traits should be object");
      return;
    }
    this.storage.setItem(defaults.user_storage_trait, JSON.stringify(value));
    return;
  }
  setAnonymousId(value) {
    if (typeof value != "string") {
      logger.error("anonymousId should be string");
      return;
    }
    this.storage.setItem(defaults.user_storage_anonymousId, value);
    return;
  }
  getItem(key) {
    let stringValue = this.storage.getItem(key);
    return JSON.parse(stringValue);
  }
  getUserId() {
    return this.storage.getItem(defaults.user_storage_key);
  }
  getUserTraits() {
    return JSON.parse(this.storage.getItem(defaults.user_storage_trait));
  }
  getAnonymousId() {
    return this.storage.getItem(defaults.user_storage_anonymousId);
  }
  removeItem(key) {
    this.storage.removeItem(key);
  }
  clear() {
    this.storage.removeItem(defaults.user_storage_key);
    this.storage.removeItem(defaults.user_storage_trait);
    this.storage.removeItem(defaults.user_storage_anonymousId);
  }
}

export { Storage };
