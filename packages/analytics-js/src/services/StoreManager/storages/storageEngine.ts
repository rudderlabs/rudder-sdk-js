import type {
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
import type { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import { state } from '../../../state';
import { defaultInMemoryStorage } from './InMemoryStorage';
import { defaultLocalStorage } from './LocalStorage';
import { defaultSessionStorage } from './sessionStorage';
import { defaultCookieStorage } from './CookieStorage';

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
      return defaultCookieStorage;
    default:
      return defaultInMemoryStorage;
  }
};

/**
 * Configure cookie storage singleton
 */
const configureCookieStorageEngine = (options: Partial<ICookieStorageOptions>) => {
  const cookieStorageOptions = defaultCookieStorage.configure(options);

  // Update the state with the final cookie storage options
  state.storage.cookie.value = {
    maxage: cookieStorageOptions.maxage,
    path: cookieStorageOptions.path,
    domain: cookieStorageOptions.domain,
    samesite: cookieStorageOptions.samesite,
    expires: cookieStorageOptions.expires,
    secure: cookieStorageOptions.secure,
  };
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
 * Configure session storage singleton
 */
const configureSessionStorageEngine = (options: Partial<ISessionStorageOptions>) => {
  defaultSessionStorage.configure(options);
};

/**
 * Configure all storage singleton instances
 */
const configureStorageEngines = (
  cookieStorageOptions: Partial<ICookieStorageOptions> = {},
  localStorageOptions: Partial<ILocalStorageOptions> = {},
  inMemoryStorageOptions: Partial<IInMemoryStorageOptions> = {},
  sessionStorageOptions: Partial<ISessionStorageOptions> = {},
) => {
  configureCookieStorageEngine(cookieStorageOptions);
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
