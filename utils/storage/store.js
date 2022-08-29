import defaults from '@ndhoule/defaults';
import store from 'storejs';

/**
 * An object utility to persist user and other values in localstorage
 */
class StoreLocal {
  constructor(options) {
    this.sOpts = {};
    this.enabled = this.checkSupportAvailability();
    this.options(options);
  }

  /**
   *
   * @param {*} options
   */
  options(options = {}) {
    if (arguments.length === 0) return this.sOpts;

    defaults(options, { enabled: true });

    this.enabled = options.enabled && this.enabled;
    this.sOpts = options;
    return this.sOpts;
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  set(key, value) {
    return store.set(key, value);
  }

  /**
   *
   * @param {*} key
   */
  get(key) {
    return store.get(key);
  }

  /**
   *
   * @param {*} key
   */
  remove(key) {
    return store.remove(key);
  }

  /**
   * Function to check local storage is accessible or not
   * @returns boolean
   */
  checkSupportAvailability() {
    const name = 'test_rudder_ls';
    this.set(name, true);

    if (this.get(name)) {
      this.remove(name);
      return true;
    }
    return false;
  }
}

// Exporting only the instance
const Store = new StoreLocal({});

export { Store };
