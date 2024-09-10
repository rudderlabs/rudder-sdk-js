import type { IErrorHandler } from './ErrorHandler';
import type { ILogger } from './Logger';
import type { IPluginsManager } from './PluginsManager';
import type { Nullable } from './Nullable';
import type { StorageType, CookieOptions, CookieSameSite } from './Storage';

export interface IStoreConfig {
  name: string;
  id: string;
  isEncrypted?: boolean;
  validKeys?: string[];
  noCompoundKey?: boolean;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  type?: StorageType;
}

export interface IStoreManager {
  private_stores?: Record<string, IStore>;
  private_isInitialized?: boolean;
  private_errorHandler?: IErrorHandler;
  private_logger?: ILogger;
  init(): void;
  initializeStorageState(): void;
  setStore(storeConfig: IStoreConfig): IStore;
  getStore(id: string): IStore | undefined;
}

export interface IStore {
  private_id: string;
  private_name: string;
  private_isEncrypted: boolean;
  private_validKeys: string[];
  private_engine: IStorage;
  private_originalEngine: IStorage;
  private_noKeyValidation?: boolean;
  private_noCompoundKey?: boolean;
  private_errorHandler?: IErrorHandler;
  private_logger?: ILogger;
  private_pluginsManager?: IPluginsManager;
  private_createValidKey(key: string): string | undefined;
  swapQueueStoreToInMemoryEngine(): void;
  set(key: string, value: any): void;
  get<T = any>(key: string): Nullable<T>;
  remove(key: string): void;
  getOriginalEngine(): IStorage;
  private_decrypt(value?: Nullable<string>): Nullable<string>;
  private_encrypt(value: any): string;
  private_crypto(value: string, mode: 'encrypt' | 'decrypt'): string;
  private_onError(error: any): void;
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
