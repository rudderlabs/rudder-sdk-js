import { CookieSameSite } from '@rudderstack/analytics-js/state/types';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { Nullable } from '@rudderstack/analytics-js/types';
import { CookieOptions } from './component-cookie';

export type StoreId = 'clientData' | 'eventQueue' | string;

export type StorageType = 'localStorage' | 'sessionStorage' | 'memoryStorage' | 'cookieStorage';

export interface IStorage extends Storage {
  configure?(options: StorageOptions): void;
  isEnabled?: boolean;
}

export interface ICookieStorageOptions extends CookieOptions {
  samesite?: CookieSameSite;
  domain?: string;
  secure?: boolean;
  enabled?: boolean;
}

export interface ILocalStorageOptions {
  enabled?: boolean;
}

export interface IInMemoryStorageOptions {
  enabled?: boolean;
}

export type StorageOptions = Partial<
  ICookieStorageOptions | ILocalStorageOptions | IInMemoryStorageOptions
>;

export type StoreManagerOptions = {
  cookieOptions?: Partial<ICookieStorageOptions>;
  localStorageOptions?: Partial<ILocalStorageOptions>;
  inMemoryStorageOptions?: Partial<IInMemoryStorageOptions>;
};

export interface IStoreConfig {
  name: string;
  id: StoreId;
  isEncrypted?: boolean;
  validKeys?: Record<string, string>;
  noCompoundKey?: boolean;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  type?: StorageType;
}

export interface IStoreManager {
  stores?: Record<StoreId, IStore>;
  isInitialized?: boolean;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  init(): void;
  initClientDataStore(): void;
  initQueueStore(): void;
  setStore(storeConfig: IStoreConfig): void;
  getStore(id: StoreId): IStore | undefined;
}

export interface IStore {
  id: string;
  name: string;
  isEncrypted: boolean;
  validKeys: Record<string, string>;
  engine: IStorage;
  originalEngine: IStorage;
  noKeyValidation?: boolean;
  noCompoundKey?: boolean;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  createValidKey(key: string): string | undefined;
  swapQueueStoreToInMemoryEngine(): void;
  set(key: string, value: any): void;
  get<T = any>(key: string): Nullable<T>;
  remove(key: string): void;
}
