import { CookieStorage } from '@rudderstack/analytics-js/services/StoreManager/storages/CookieStorage';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import {
  IStorage,
  StorageType,
  ICookieStorageOptions,
  ILocalStorageOptions,
  IInMemoryStorageOptions,
} from '../types';
import { defaultInMemoryStorage } from './InMemoryStorage';
import { defaultLocalStorage } from './LocalStorage';

// TODO: create session storage client (similar to localstorage if needed)

/**
 * A utility to retrieve the storage singleton instance by type
 */
const getStorageEngine = (type?: StorageType): IStorage => {
  switch (type) {
    case 'localStorage':
      return defaultLocalStorage;
    case 'sessionStorage':
      return globalThis.sessionStorage;
    case 'memoryStorage':
      return defaultInMemoryStorage;
    case 'cookieStorage':
      return new CookieStorage({}, defaultLogger);
    default:
      return defaultInMemoryStorage;
  }
};

/**
 * Configure cookie storage singleton
 */
const configureCookieStorageEngine = (options: Partial<ICookieStorageOptions>) => {
  new CookieStorage({}, defaultLogger).configure(options);
};

/**
 * Configure local storage singleton
 */
const configureLocalStorageEngine = (options: Partial<ILocalStorageOptions>) => {
  defaultLocalStorage.configure(options);
};

/**
 * Configure in memory storage singleton
 */
const configureInMemoryStorageEngine = (options: Partial<IInMemoryStorageOptions>) => {
  defaultInMemoryStorage.configure(options);
};

/**
 * Configure all storage singleton instances
 */
const configureStorageEngines = (
  cookieOptions: Partial<ICookieStorageOptions> = {},
  localStorageOptions: Partial<ILocalStorageOptions> = {},
  inMemoryStorageOptions: Partial<IInMemoryStorageOptions> = {},
) => {
  configureCookieStorageEngine(cookieOptions);
  configureLocalStorageEngine(localStorageOptions);
  configureInMemoryStorageEngine(inMemoryStorageOptions);
};

export {
  getStorageEngine,
  configureCookieStorageEngine,
  configureLocalStorageEngine,
  configureInMemoryStorageEngine,
  configureStorageEngines,
};
