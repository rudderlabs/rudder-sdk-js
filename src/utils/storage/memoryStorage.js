import { mergeDeepRight } from '../ObjectUtils';

/**
 * A storage utility to retain values in memory via Storage interface
 */
class InMemoryStorage {
  opts;

  isEnabled = true;

  length = 0;

  data = {};

  constructor(options) {
    this.opts = { enabled: true };
    this.options(options ?? {});
    this.isSupportAvailable = true;
  }

  options(inOpts) {
    this.opts = mergeDeepRight(this.opts, inOpts.memoryStorage || {});
    this.isEnabled = Boolean(this.opts.enabled);
    return this.opts;
  }

  set(key, value) {
    this.data[key] = value;
    this.length = Object.keys(this.data).length;
    return value;
  }

  get(key) {
    if (key in this.data) {
      return this.data[key];
    }
    return null;
  }

  remove(key) {
    if (key in this.data) {
      delete this.data[key];
    }
    this.length = Object.keys(this.data).length;
    return true;
  }

  clear() {
    this.data = {};
    this.length = 0;
  }

  key(index) {
    return Object.keys(this.data)[index];
  }
}

const defaultInMemoryStorage = new InMemoryStorage({});

export { InMemoryStorage, defaultInMemoryStorage };
