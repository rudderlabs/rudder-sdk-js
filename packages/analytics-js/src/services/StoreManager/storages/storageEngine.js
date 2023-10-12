import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import { defaultLogger } from '../../Logger';
import { CookieStorage } from './CookieStorage';
import { defaultInMemoryStorage } from './InMemoryStorage';
import { defaultLocalStorage } from './LocalStorage';
import { defaultSessionStorage } from './sessionStorage';
// TODO: create session storage client (similar to localstorage if needed)
/**
 * A utility to retrieve the storage singleton instance by type
 */
const getStorageEngine = type => {
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
const configureCookieStorageEngine = options => {
  new CookieStorage({}, defaultLogger).configure(options);
};
/**
 * Configure local storage singleton
 */
const configureLocalStorageEngine = options => {
  defaultLocalStorage.configure(options);
};
/**
 * Configure in memory storage singleton
 */
const configureInMemoryStorageEngine = options => {
  defaultInMemoryStorage.configure(options);
};
/**
 * Configure session storage singleton
 */
const configureSessionStorageEngine = options => {
  defaultSessionStorage.configure(options);
};
/**
 * Configure all storage singleton instances
 */
const configureStorageEngines = (
  cookieOptions = {},
  localStorageOptions = {},
  inMemoryStorageOptions = {},
  sessionStorageOptions = {},
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
