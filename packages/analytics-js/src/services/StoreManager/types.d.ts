import {
  ICookieStorageOptions,
  IInMemoryStorageOptions,
  ILocalStorageOptions,
  ISessionStorageOptions,
} from '@rudderstack/analytics-js-common/types/Store';
export type StoreManagerOptions = {
  cookieOptions?: Partial<ICookieStorageOptions>;
  localStorageOptions?: Partial<ILocalStorageOptions>;
  inMemoryStorageOptions?: Partial<IInMemoryStorageOptions>;
  sessionStorageOptions?: Partial<ISessionStorageOptions>;
};
export declare const storageClientDataStoreNameMap: Record<string, string>;
