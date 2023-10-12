import {
  COOKIE_STORAGE,
  LOCAL_STORAGE,
  MEMORY_STORAGE,
  SESSION_STORAGE,
} from '@rudderstack/analytics-js-common/constants/storages';
import {
  ICookieStorageOptions,
  IInMemoryStorageOptions,
  ILocalStorageOptions,
  ISessionStorageOptions,
} from '@rudderstack/analytics-js-common/types/Store';
import {
  CLIENT_DATA_STORE_COOKIE,
  CLIENT_DATA_STORE_LS,
  CLIENT_DATA_STORE_MEMORY,
  CLIENT_DATA_STORE_SESSION,
} from '../../constants/storage';

export type StoreManagerOptions = {
  cookieOptions?: Partial<ICookieStorageOptions>;
  localStorageOptions?: Partial<ILocalStorageOptions>;
  inMemoryStorageOptions?: Partial<IInMemoryStorageOptions>;
  sessionStorageOptions?: Partial<ISessionStorageOptions>;
};

export const storageClientDataStoreNameMap: Record<string, string> = {
  [COOKIE_STORAGE]: CLIENT_DATA_STORE_COOKIE,
  [LOCAL_STORAGE]: CLIENT_DATA_STORE_LS,
  [MEMORY_STORAGE]: CLIENT_DATA_STORE_MEMORY,
  [SESSION_STORAGE]: CLIENT_DATA_STORE_SESSION,
};
