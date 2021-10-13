import { tsImportEqualsDeclaration } from "@babel/types";
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

const storageTypes = {
  COOKIES: { name: "cookies", instance: Cookie },
  LOCAL_STORAGE: { name: "localstorage", instance: Store },
};

const DEF_STORAGE_NAME = storageTypes.COOKIES.name;

/**
 * An object that handles persisting key-val from Analytics
 */
class Storage {
  constructor() {
    this.cookieSupportExists = false;
    this.lsSupportExists = false;
    this.storage = undefined;
    this.storageName = "";

    // Note: The logic below heavily relies on the fact
    // that only 2 storage types are supported in the SDK
    // TODO: Need to rewrite as this solution is not extendable.

    // Check cookie support
    // First try setting the storage to cookie else to localstorage
    const cookieInst = storageTypes.COOKIES.instance;
    cookieInst.set("rudder_cookies", true);
    if (cookieInst.get("rudder_cookies")) {
      cookieInst.remove("rudder_cookies");
      this.cookieSupportExists = true;
    }

    // Check local storage support
    // localStorage is enabled.
    const lsInst = storageTypes.LOCAL_STORAGE.instance;
    if (lsInst.enabled) {
      this.lsSupportExists = true;
    }

    // Assign storage object
    // Local Storage > Cookies
    if (this.lsSupportExists) {
      this.storage = lsInst;
      this.storageName = storageTypes.LOCAL_STORAGE.name;
      // Migrate any valid data
      if (this.cookieSupportExists) {
        this.migrateData(cookieInst, this.storage);
      }
    } else if (this.cookieSupportExists) {
      this.storage = cookieInst;
      this.storageName = storageTypes.COOKIES.name;
    }
  }

  init(defStorageName = DEF_STORAGE_NAME) {
    // Note: The logic below heavily relies on the fact
    // that only 2 storage types are supported in the SDK
    // TODO: Need to rewrite as this solution is not extendable.

    // Validate storage name
    let reqStorageName;
    if (typeof defStorageName === "string" && defStorageName)
      reqStorageName = defStorageName.trim().toLowerCase();
    else reqStorageName = DEF_STORAGE_NAME;

    // Allow only defined storage types
    if (!Object.values(storageTypes).some((x) => x.name === reqStorageName))
      reqStorageName = DEF_STORAGE_NAME;

    // If the storage type has not changed, don't proceed further
    if (reqStorageName === this.storageName) return;

    let prevStorage = this.storage;

    if (reqStorageName === storageTypes.COOKIES.name) {
      if (this.cookieSupportExists) {
        this.storage = storageTypes.COOKIES.instance;
      } else if (this.lsSupportExists) {
        // To stop data migration below
        prevStorage = undefined;
      }
    } else if (reqStorageName === storageTypes.LOCAL_STORAGE.name) {
      if (this.lsSupportExists) {
        this.storage = storageTypes.LOCAL_STORAGE.instance;
      } else if (this.cookieSupportExists) {
        // To stop data migration below
        prevStorage = undefined;
      }
    }

    // Migrate any valid data from previous storage type to current
    if (this.storage && prevStorage) {
      this.migrateData(prevStorage, this.storage);
    }
    this.storageName = reqStorageName;
  }

  migrateData(prevStorage, curStorage) {
    logger.debug("Migrating data from previous storage to current");
    const dataNames = Object.values(defaults).filter((val) =>
      val.startsWith("rl_")
    );
    dataNames.forEach((dName) => {
      const dVal = prevStorage.get(dName);
      if (this.isValidData(dVal)) {
        curStorage.set(dName, dVal);
      }
      prevStorage.remove(dName);
    });
  }

  isValidData(val) {
    return !(!val || (typeof val === "string" && this.trim(val) === ""));
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
    if (!this.isValidData(value)) {
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
   * get stored anonymous id
   */
  getAnonymousId() {
    return this.parse(
      this.decryptValue(this.storage.get(defaults.user_storage_anonymousId))
    );
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
