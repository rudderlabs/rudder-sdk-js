import {
  ICookieStorageOptions,
  IInMemoryStorageOptions,
  ILocalStorageOptions,
  ISessionStorageOptions,
} from '@rudderstack/analytics-js-common/types/Store';
declare const getDefaultCookieOptions: () => ICookieStorageOptions;
declare const getDefaultLocalStorageOptions: () => ILocalStorageOptions;
declare const getDefaultSessionStorageOptions: () => ISessionStorageOptions;
declare const getDefaultInMemoryStorageOptions: () => IInMemoryStorageOptions;
export {
  getDefaultCookieOptions,
  getDefaultLocalStorageOptions,
  getDefaultInMemoryStorageOptions,
  getDefaultSessionStorageOptions,
};
