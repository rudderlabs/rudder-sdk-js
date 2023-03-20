import {
  IStorage,
  StorageType,
  ICookieStorageOptions,
  ILocalStorageOptions,
  IInMemoryStorageOptions,
} from '../types';
import { defaultInMemoryStorage } from './InMemoryStorage';
import { defaultCookieStorage } from './CookieStorage';
import { defaultLocalStorage } from './LocalStorage';

const getStorageEngine = (type?: StorageType): IStorage => {
  switch (type) {
    case 'localStorage':
      return defaultLocalStorage;
    case 'sessionStorage':
      return window.sessionStorage;
    case 'memoryStorage':
      return defaultInMemoryStorage;
    case 'cookieStorage':
      return defaultCookieStorage;
    default:
      return defaultInMemoryStorage;
  }
};

const configureCookieStorageEngine = (options: Partial<ICookieStorageOptions>) => {
  defaultCookieStorage.configure(options);
};

const configureLocalStorageEngine = (options: Partial<ILocalStorageOptions>) => {
  defaultLocalStorage.configure(options);
};

const configureInMemoryStorageEngine = (options: Partial<IInMemoryStorageOptions>) => {
  defaultInMemoryStorage.configure(options);
};

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
