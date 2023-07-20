import {
  ICookieStorageOptions,
  IInMemoryStorageOptions,
  ILocalStorageOptions,
} from '@rudderstack/analytics-js-common/types/Store';

export type StoreManagerOptions = {
  cookieOptions?: Partial<ICookieStorageOptions>;
  localStorageOptions?: Partial<ILocalStorageOptions>;
  inMemoryStorageOptions?: Partial<IInMemoryStorageOptions>;
};
