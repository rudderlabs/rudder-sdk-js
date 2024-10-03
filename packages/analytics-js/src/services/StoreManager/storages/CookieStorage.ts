import { isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import type { ICookieStorageOptions, IStorage } from '@rudderstack/analytics-js-common/types/Store';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { COOKIE_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { cookie } from '@rudderstack/analytics-js-cookies/component-cookie';
import { isStorageAvailable } from '../../../components/capabilitiesManager/detection';
import { getDefaultCookieOptions } from './defaultOptions';

/**
 * A storage utility to persist values in cookies via Storage interface
 */
class CookieStorage implements IStorage {
  static globalSingleton: Nullable<CookieStorage>;
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
    if (options.sameDomainCookiesOnly) {
      delete this.options.domain;
    }
    this.isSupportAvailable = isStorageAvailable(COOKIE_STORAGE, this);
    this.isEnabled = Boolean(this.options.enabled && this.isSupportAvailable);
    return this.options;
  }

  setItem(key: string, value: Nullable<string>): boolean {
    cookie(key, value, this.options, this.logger);
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

  key(index: number): Nullable<string> {
    const curKeys = this.keys();
    return curKeys[index] ?? null;
  }

  // eslint-disable-next-line class-methods-use-this
  keys(): string[] {
    return Object.keys(cookie());
  }
}

export { CookieStorage };
