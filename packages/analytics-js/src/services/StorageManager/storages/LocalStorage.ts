import store from 'storejs';
import { isStorageAvailable } from '@rudderstack/analytics-js/components/capabilitiesManager/detection';
import { Logger } from '@rudderstack/analytics-js/services/Logger';
import * as R from 'ramda';
import { ILocalStorageOptions } from '../types';
import { getDefaultLocalStorageOptions } from './defaultOptions';

// TODO: can we remove the storejs dependency to save bundlesize?
//  check if the get, set overloads and search methods are used at all
//  if we do ensure we provide types to support overloads as per storejs docs
//  https://www.npmjs.com/package/storejs
class LocalStorage {
  logger?: Logger;
  options: ILocalStorageOptions;
  isSupportAvailable = true;
  isEnabled = true;
  length = 0;

  constructor(options: ILocalStorageOptions = {}, logger?: Logger) {
    this.options = getDefaultLocalStorageOptions();
    this.logger = logger;
    this.configure(options);
  }

  configure(options: Partial<ILocalStorageOptions>): ILocalStorageOptions {
    this.options = R.mergeRight(this.options, options);
    this.isSupportAvailable = isStorageAvailable('localStorage', this);
    this.isEnabled = Boolean(this.options.enabled && this.isSupportAvailable);
    return this.options;
  }

  // eslint-disable-next-line class-methods-use-this
  setItem(key: string, value: any) {
    store.set(key, value);
    this.length = store.keys().length;
  }

  // eslint-disable-next-line class-methods-use-this
  getItem(key: string): any {
    const value = store.get(key);
    return typeof value === 'undefined' ? null : value;
  }

  // eslint-disable-next-line class-methods-use-this
  removeItem(key: string) {
    store.remove(key);
    this.length = store.keys().length;
  }

  // eslint-disable-next-line class-methods-use-this
  clear() {
    store.clear();
    this.length = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  key(index: number): string {
    return store.keys()[index];
  }
}

const defaultLocalStorage = new LocalStorage();

export { LocalStorage, defaultLocalStorage };
