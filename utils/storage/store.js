import defaults from "@ndhoule/defaults";
import store from "storejs";

/**
 * An object utility to persist user and other values in localstorage
 */
class StoreLocal {
  constructor(options) {
    this.sOptions = {};
    this.enabled = false;
    this.options(options);
  }

  /**
   *
   * @param {*} options
   */
  options(options = {}) {
    if (arguments.length === 0) return this.sOptions;

    defaults(options, { enabled: true });

    this.enabled = options.enabled && store.enabled;
    this.sOptions = options;
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  set(key, value) {
    if (!this.enabled) return false;
    return store.set(key, value);
  }

  /**
   *
   * @param {*} key
   */
  get(key) {
    if (!this.enabled) return null;
    return store.get(key);
  }

  /**
   *
   * @param {*} key
   */
  remove(key) {
    if (!this.enabled) return false;
    return store.remove(key);
  }
}

// Exporting only the instance
const Store = new StoreLocal({});

export { Store };
