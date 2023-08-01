import { isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { ICookieStorageOptions, IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { COOKIE_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities';
import { isStorageAvailable } from '../../../components/capabilitiesManager/detection';
import { cookie } from '../component-cookie';
import { getDefaultCookieOptions } from './defaultOptions';

/**
 * A storage utility to persist values in cookies via Storage interface
 */
class CookieStorage implements IStorage {
  static globalSingleton: Nullable<CookieStorage> = null;
  logger?: ILogger;
  options?: ICookieStorageOptions;
  isSupportAvailable = true;
  isEnabled = true;
  length = 0;

  constructor(options: Partial<ICookieStorageOptions> = {}, logger?: ILogger) {
    if (CookieStorage.globalSingleton) {
      // eslint-disable-next-line no-constructor-return
      return CookieStorage.globalSingleton;
    }

    this.options = getDefaultCookieOptions();
    this.logger = logger;
    this.configure(options);

    CookieStorage.globalSingleton = this;
  }

  configure(options: Partial<ICookieStorageOptions>): ICookieStorageOptions {
    this.options = mergeDeepRight(this.options ?? {}, options);
    this.isSupportAvailable = isStorageAvailable(COOKIE_STORAGE, this, this.logger);
    this.isEnabled = Boolean(this.options.enabled && this.isSupportAvailable);
    return this.options;
  }

  setItem(key: string, value: Nullable<string>): boolean {
    cookie(key, value, this.options);
    this.length = Object.keys(cookie()).length;
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  getItem(key: string): Nullable<string> {
    const value = cookie(key);
    return isUndefined(value) ? null : value;
  }

  removeItem(key: string): boolean {
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
  key(index: number): Nullable<string> {
    const cookies = cookie();
    const cookieNames = Object.keys(cookies);
    return isUndefined(cookieNames[index]) ? null : cookieNames[index];
  }
}

export { CookieStorage };
