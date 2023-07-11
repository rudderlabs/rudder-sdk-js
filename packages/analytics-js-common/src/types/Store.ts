import { IErrorHandler } from './ErrorHandler';
import { ILogger } from './Logger';
import { IPluginsManager } from './PluginsManager';
import { Nullable } from './Nullable';
import { CookieSameSite } from './LoadOptions';

export type StoreId = 'clientData' | 'eventQueue' | string;

export type StorageType = 'localStorage' | 'sessionStorage' | 'memoryStorage' | 'cookieStorage';

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
  setStore(storeConfig: IStoreConfig): IStore;
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
  pluginManager?: IPluginsManager;
  createValidKey(key: string): string | undefined;
  swapQueueStoreToInMemoryEngine(): void;
  set(key: string, value: any): void;
  get<T = any>(key: string): Nullable<T>;
  remove(key: string): void;
  getOriginalEngine(): IStorage;
  decrypt(value?: Nullable<string>): Nullable<string>;
  encrypt(value: any): string;
  crypto(value: string, mode: 'encrypt' | 'decrypt'): string;
  onError(error: Error | unknown): void;
}

export interface IStorage extends Storage {
  configure?(options: StorageOptions): void;
  isEnabled?: boolean;
}

export type StorageOptions = Partial<
  ICookieStorageOptions | ILocalStorageOptions | IInMemoryStorageOptions
>;

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

export type CookieOptions = {
  maxage?: number;
  expires?: Date;
  path?: string;
  domain?: string;
  secure?: boolean;
};
