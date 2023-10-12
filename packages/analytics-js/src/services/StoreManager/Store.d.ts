import { IStorage, IStore, IStoreConfig } from '@rudderstack/analytics-js-common/types/Store';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
/**
 * Store Implementation with dedicated storage
 */
declare class Store implements IStore {
  id: string;
  name: string;
  isEncrypted: boolean;
  validKeys: Record<string, string>;
  engine: IStorage;
  originalEngine: IStorage;
  noKeyValidation?: boolean;
  noCompoundKey?: boolean;
  errorHandler?: IErrorHandler;
  hasErrorHandler: boolean;
  logger?: ILogger;
  pluginsManager?: IPluginsManager;
  constructor(config: IStoreConfig, engine?: IStorage, pluginsManager?: IPluginsManager);
  /**
   * Ensure the key is valid and with correct format
   */
  createValidKey(key: string): string | undefined;
  /**
   * Switch to inMemoryEngine, bringing any existing data with.
   */
  swapQueueStoreToInMemoryEngine(): void;
  /**
   * Set value by key.
   */
  set(key: string, value: any): void;
  /**
   * Get by Key.
   */
  get<T = any>(key: string): Nullable<T>;
  /**
   * Remove by Key.
   */
  remove(key: string): void;
  /**
   * Get original engine
   */
  getOriginalEngine(): IStorage;
  /**
   * Decrypt values
   */
  decrypt(value?: Nullable<string>): Nullable<string>;
  /**
   * Encrypt value
   */
  encrypt(value: Nullable<any>): string;
  /**
   * Extension point to use with encryption plugins
   */
  crypto(value: Nullable<any>, mode: 'encrypt' | 'decrypt'): string;
  /**
   * Handle errors
   */
  onError(error: unknown): void;
}
export { Store };
