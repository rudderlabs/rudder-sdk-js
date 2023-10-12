import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { defaultLogger } from '../../Logger';
import { getDefaultInMemoryStorageOptions } from './defaultOptions';
/**
 * A storage utility to retain values in memory via Storage interface
 */
class InMemoryStorage {
  constructor(options, logger) {
    this.isEnabled = true;
    this.length = 0;
    this.data = {};
    this.options = getDefaultInMemoryStorageOptions();
    this.logger = logger;
    this.configure(options !== null && options !== void 0 ? options : {});
  }
  configure(options) {
    this.options = mergeDeepRight(this.options, options);
    this.isEnabled = Boolean(this.options.enabled);
    return this.options;
  }
  setItem(key, value) {
    this.data[key] = value;
    this.length = Object.keys(this.data).length;
    return value;
  }
  getItem(key) {
    if (key in this.data) {
      return this.data[key];
    }
    return null;
  }
  removeItem(key) {
    if (key in this.data) {
      delete this.data[key];
    }
    this.length = Object.keys(this.data).length;
    return null;
  }
  clear() {
    this.data = {};
    this.length = 0;
  }
  key(index) {
    return Object.keys(this.data)[index];
  }
}
const defaultInMemoryStorage = new InMemoryStorage({}, defaultLogger);
export { InMemoryStorage, defaultInMemoryStorage };
