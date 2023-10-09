import {
  ICookieStorageOptions,
  IInMemoryStorageOptions,
  ILocalStorageOptions,
  ISessionStorageOptions,
  IStorage,
} from '@rudderstack/analytics-js-common/types/Store';
import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import { defaultLogger } from '../../Logger';
import { CookieStorage } from './CookieStorage';
import { defaultInMemoryStorage } from './InMemoryStorage';
import { defaultLocalStorage } from './LocalStorage';
import { defaultSessionStorage } from './sessionStorage';

// TODO: create session storage client (similar to localstorage if needed)

/**
 * A utility to retrieve the storage singleton instance by type
 */
const getStorageEngine = (type?: StorageType): IStorage => {
  switch (type) {
    case LOCAL_STORAGE:
      return defaultLocalStorage;
    case SESSION_STORAGE:
      return defaultSessionStorage;
    case MEMORY_STORAGE:
      return defaultInMemoryStorage;
    case COOKIE_STORAGE:
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
 * Configure in memory storage singleton
 */
const configureSessionStorageEngine = (options: Partial<ISessionStorageOptions>) => {
  defaultSessionStorage.configure(options);
};

/**
 * Configure all storage singleton instances
 */
const configureStorageEngines = (
  cookieOptions: Partial<ICookieStorageOptions> = {},
  localStorageOptions: Partial<ILocalStorageOptions> = {},
  inMemoryStorageOptions: Partial<IInMemoryStorageOptions> = {},
  sessionStorageOptions: Partial<ISessionStorageOptions> = {},
) => {
  configureCookieStorageEngine(cookieOptions);
  configureLocalStorageEngine(localStorageOptions);
  configureInMemoryStorageEngine(inMemoryStorageOptions);
  configureSessionStorageEngine(sessionStorageOptions);
};

export {
  getStorageEngine,
  configureCookieStorageEngine,
  configureLocalStorageEngine,
  configureInMemoryStorageEngine,
  configureSessionStorageEngine,
  configureStorageEngines,
};
