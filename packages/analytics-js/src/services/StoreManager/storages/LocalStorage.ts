import store from 'storejs';
import { ILocalStorageOptions, IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { isUndefined, mergeDeepRight } from '@rudderstack/analytics-js-common/utilities';
import { LOCAL_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { isStorageAvailable } from '../../../components/capabilitiesManager/detection';
import { defaultLogger } from '../../Logger/Logger';
import { getDefaultLocalStorageOptions } from './defaultOptions';

// TODO: can we remove the storejs dependency to save bundle size?
//  check if the get, set overloads and search methods are used at all
//  if we do, ensure we provide types to support overloads as per storejs docs
//  https://www.npmjs.com/package/storejs
/**
 * A storage utility to persist values in localstorage via Storage interface
 */
class LocalStorage implements IStorage {
  logger?: ILogger;
  options: ILocalStorageOptions;
  isSupportAvailable = true;
  isEnabled = true;
  length = 0;

  constructor(options: ILocalStorageOptions = {}, logger?: ILogger) {
    this.options = getDefaultLocalStorageOptions();
    this.logger = logger;
    this.configure(options);
  }

  configure(options: Partial<ILocalStorageOptions>): ILocalStorageOptions {
    this.options = mergeDeepRight(this.options, options);
    this.isSupportAvailable = isStorageAvailable(LOCAL_STORAGE, this, this.logger);
    this.isEnabled = Boolean(this.options.enabled && this.isSupportAvailable);
    return this.options;
  }

  setItem(key: string, value: any) {
    store.set(key, value);
    this.length = store.keys().length;
  }

  // eslint-disable-next-line class-methods-use-this
  getItem(key: string): any {
    const value = store.get(key);
    return isUndefined(value) ? null : value;
  }

  removeItem(key: string) {
    store.remove(key);
    this.length = store.keys().length;
  }

  clear() {
    store.clear();
    this.length = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  key(index: number): string {
    return store.keys()[index];
  }
}

const defaultLocalStorage = new LocalStorage({}, defaultLogger);

export { LocalStorage, defaultLocalStorage };
