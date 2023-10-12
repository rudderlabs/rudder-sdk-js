import { isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { COOKIE_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { isStorageAvailable } from '../../../components/capabilitiesManager/detection';
import { cookie } from '../component-cookie';
import { getDefaultCookieOptions } from './defaultOptions';
/**
 * A storage utility to persist values in cookies via Storage interface
 */
class CookieStorage {
  constructor(options = {}, logger) {
    this.isSupportAvailable = true;
    this.isEnabled = true;
    this.length = 0;
    if (CookieStorage.globalSingleton) {
      // eslint-disable-next-line no-constructor-return
      return CookieStorage.globalSingleton;
    }
    this.options = getDefaultCookieOptions();
    this.logger = logger;
    this.configure(options);
    CookieStorage.globalSingleton = this;
  }
  configure(options) {
    var _a;
    this.options = mergeDeepRight((_a = this.options) !== null && _a !== void 0 ? _a : {}, options);
    this.isSupportAvailable = isStorageAvailable(COOKIE_STORAGE, this, this.logger);
    this.isEnabled = Boolean(this.options.enabled && this.isSupportAvailable);
    return this.options;
  }
  setItem(key, value) {
    cookie(key, value, this.options, this.logger);
    this.length = Object.keys(cookie()).length;
    return true;
  }
  // eslint-disable-next-line class-methods-use-this
  getItem(key) {
    const value = cookie(key);
    return isUndefined(value) ? null : value;
  }
  removeItem(key) {
    const result = this.setItem(key, null);
    this.length = Object.keys(cookie()).length;
    return result;
  }
  // eslint-disable-next-line class-methods-use-this
  clear() {
    // Not implemented
    // getting a list of all cookie storage keys and remove all values
    // sounds risky to do as it will take on all top domain cookies
    // better to explicitly clear specific ones if needed
  }
  // This cannot be implemented for cookies
  // eslint-disable-next-line class-methods-use-this
  key(index) {
    const cookies = cookie();
    const cookieNames = Object.keys(cookies);
    return isUndefined(cookieNames[index]) ? null : cookieNames[index];
  }
}
CookieStorage.globalSingleton = null;
export { CookieStorage };
