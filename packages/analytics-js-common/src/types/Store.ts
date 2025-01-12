import type { IErrorHandler } from './ErrorHandler';
import type { ILogger } from './Logger';
import type { IPluginsManager } from './PluginsManager';
import type { Nullable } from './Nullable';
import type { StorageType, CookieOptions, CookieSameSite } from './Storage';

export type StoreId = string;

export interface IStoreConfig {
  name: string;
  id: StoreId;
  isEncrypted?: boolean;
  validKeys?: string[];
  noCompoundKey?: boolean;
  errorHandler: IErrorHandler;
  logger: ILogger;
  type?: StorageType;
}

export interface IStoreManager {
  stores?: Record<StoreId, IStore>;
  isInitialized?: boolean;
  errorHandler: IErrorHandler;
  logger: ILogger;
  init(): void;
  initializeStorageState(): void;
  setStore(storeConfig: IStoreConfig): IStore;
  getStore(id: StoreId): IStore | undefined;
}

export interface IStore {
  id: string;
  name: string;
  isEncrypted: boolean;
  validKeys: string[];
  engine: IStorage;
  originalEngine: IStorage;
  noKeyValidation?: boolean;
  noCompoundKey?: boolean;
  errorHandler: IErrorHandler;
  logger: ILogger;
  pluginsManager: IPluginsManager;
  createValidKey(key: string): string | undefined;
  swapQueueStoreToInMemoryEngine(): void;
  set(key: string, value: any): void;
  get<T = any>(key: string): Nullable<T>;
  remove(key: string): void;
  getOriginalEngine(): IStorage;
  decrypt(value?: Nullable<string>): Nullable<string>;
  encrypt(value: any): string;
  crypto(value: string, mode: 'encrypt' | 'decrypt'): string;
  onError(error: unknown): void;
}

export interface IStorage extends Storage {
  configure?(options: StorageOptions): void;
  keys(): string[];
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
  sameDomainCookiesOnly?: boolean;
}

export interface ILocalStorageOptions {
  enabled?: boolean;
}

export interface IInMemoryStorageOptions {
  enabled?: boolean;
}

export interface ISessionStorageOptions {
  enabled?: boolean;
}
