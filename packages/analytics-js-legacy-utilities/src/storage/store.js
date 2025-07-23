import store from 'storejs';
import { mergeDeepRight } from '../ObjectUtils';

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

    // Override the default options with the provided options
    this.sOpts = mergeDeepRight(
      {
        enabled: true,
      },
      options,
    );

    this.enabled = this.sOpts.enabled && this.enabled;
    return this.sOpts;
  }

  /**
   *
   * @param {*} key
   * @param {*} value
   */
  // eslint-disable-next-line class-methods-use-this
  set(key, value) {
    return store.set(key, value);
  }

  /**
   *
   * @param {*} key
   */
  // eslint-disable-next-line class-methods-use-this
  get(key) {
    return store.get(key);
  }

  /**
   *
   * @param {*} key
   */
  // eslint-disable-next-line class-methods-use-this
  remove(key) {
    return store.remove(key);
  }

  /**
   * Function to check local storage is accessible or not
   * @returns boolean
   */
  checkSupportAvailability() {
    try {
      const name = 'test_rudder_ls';
      this.set(name, true);

      if (this.get(name)) {
        this.remove(name);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}

// Exporting only the instance
const Store = new StoreLocal({});

export { Store };
