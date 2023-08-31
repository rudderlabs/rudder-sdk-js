import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import {
  ICookieStorageOptions,
  IInMemoryStorageOptions,
  ILocalStorageOptions,
} from '@rudderstack/analytics-js-common/types/Store';
import {
  CLIENT_DATA_STORE_COOKIE,
  CLIENT_DATA_STORE_LS,
  CLIENT_DATA_STORE_MEMORY,
} from '@rudderstack/analytics-js/constants/storage';

export type StoreManagerOptions = {
  cookieOptions?: Partial<ICookieStorageOptions>;
  localStorageOptions?: Partial<ILocalStorageOptions>;
  inMemoryStorageOptions?: Partial<IInMemoryStorageOptions>;
};

export const storageClientDataStoreNameMap: Record<string, string> = {
  [COOKIE_STORAGE]: CLIENT_DATA_STORE_COOKIE,
  [LOCAL_STORAGE]: CLIENT_DATA_STORE_LS,
  [MEMORY_STORAGE]: CLIENT_DATA_STORE_MEMORY,
};
