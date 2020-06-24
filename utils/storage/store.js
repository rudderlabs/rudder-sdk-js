import defaults from "@ndhoule/defaults";
import store from "@segment/store";

/**
 * An object utility to persist user and other values in localstorage
 */
class StoreLocal {
  constructor(options) {
    this._options = {};
    this.enabled = false;
    this.options(options);
  }

  /**
   *
   * @param {*} options
   */
  options(options = {}) {
    if (arguments.length === 0) return this._options;

    defaults(options, { enabled: true });

    this.enabled = options.enabled && store.enabled;
    this._options = options;
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
