import {
  ICookieStorageOptions,
  IInMemoryStorageOptions,
  ILocalStorageOptions,
  ISessionStorageOptions,
  IStorage,
} from '@rudderstack/analytics-js-common/types/Store';
import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
/**
 * A utility to retrieve the storage singleton instance by type
 */
declare const getStorageEngine: (type?: StorageType) => IStorage;
/**
 * Configure cookie storage singleton
 */
declare const configureCookieStorageEngine: (options: Partial<ICookieStorageOptions>) => void;
/**
 * Configure local storage singleton
 */
declare const configureLocalStorageEngine: (options: Partial<ILocalStorageOptions>) => void;
/**
 * Configure in memory storage singleton
 */
declare const configureInMemoryStorageEngine: (options: Partial<IInMemoryStorageOptions>) => void;
/**
 * Configure session storage singleton
 */
declare const configureSessionStorageEngine: (options: Partial<ISessionStorageOptions>) => void;
/**
 * Configure all storage singleton instances
 */
declare const configureStorageEngines: (
  cookieOptions?: Partial<ICookieStorageOptions>,
  localStorageOptions?: Partial<ILocalStorageOptions>,
  inMemoryStorageOptions?: Partial<IInMemoryStorageOptions>,
  sessionStorageOptions?: Partial<ISessionStorageOptions>,
) => void;
export {
  getStorageEngine,
  configureCookieStorageEngine,
  configureLocalStorageEngine,
  configureInMemoryStorageEngine,
  configureSessionStorageEngine,
  configureStorageEngines,
};
