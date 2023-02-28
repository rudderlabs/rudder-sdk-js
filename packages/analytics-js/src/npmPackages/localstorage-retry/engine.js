import { v4 as uuid } from '@lukeed/uuid';

/**
 * @type Class
 */
var inMemoryStore = {
  _data: {},
  length: 0,
  setItem: function (key, value) {
    this._data[key] = value;
    this.length = Object.keys(this._data).length;
    return value;
  },
  getItem: function (key) {
    if (key in this._data) {
      return this._data[key];
    }
    return null;
  },
  removeItem: function (key) {
    if (key in this._data) {
      delete this._data[key];
    }
    this.length = Object.keys(this._data).length;
    return null;
  },
  clear: function () {
    this._data = {};
    this.length = 0;
  },
  key: function (index) {
    return Object.keys(this._data)[index];
  },
};

function isSupportedNatively() {
  try {
    if (!window.localStorage) return false;
    var key = uuid();
    window.localStorage.setItem(key, 'test_value');
    var value = window.localStorage.getItem(key);
    window.localStorage.removeItem(key);

    // handle localStorage silently failing
    return value === 'test_value';
  } catch (e) {
    // Can throw if localStorage is disabled
    return false;
  }
}

function pickStorage() {
  if (isSupportedNatively()) {
    return window.localStorage;
  }
  // fall back to in-memory
  return inMemoryStore;
}

// Return a shared instance
const defaultEngine = pickStorage();
// Expose the in-memory store explicitly for testing
const inMemoryEngine = inMemoryStore;

export { defaultEngine, inMemoryEngine };
