import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { trim } from '@rudderstack/analytics-js/components/utilities/string';
import { Nullable } from '@rudderstack/analytics-js/types';
import { isStorageQuotaExceeded } from '@rudderstack/analytics-js/components/capabilitiesManager/detection';
import { IPluginsManager } from '@rudderstack/analytics-js/components/pluginsManager/types';
import { isNullOrUndefined } from '@rudderstack/analytics-js/components/utilities/checks';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js/components/utilities/json';
import { getStorageEngine } from './storages/storageEngine';
import { IStorage, IStore, IStoreConfig } from './types';

/**
 * Store Implementation with dedicated storage
 */
class Store implements IStore {
  id: string;
  name: string;
  isEncrypted: boolean;
  validKeys: Record<string, string>;
  engine: IStorage;
  originalEngine: IStorage;
  noKeyValidation?: boolean;
  noCompoundKey?: boolean;
  errorHandler?: IErrorHandler;
  hasErrorHandler = false;
  logger?: ILogger;
  pluginManager?: IPluginsManager;
  hasLogger = false;

  constructor(config: IStoreConfig, engine?: IStorage, pluginManager?: IPluginsManager) {
    this.id = config.id;
    this.name = config.name;
    this.isEncrypted = config.isEncrypted || false;
    this.validKeys = config.validKeys || {};
    this.engine = engine || getStorageEngine('localStorage');
    this.noKeyValidation = Object.keys(this.validKeys).length === 0;
    this.noCompoundKey = config.noCompoundKey;
    this.originalEngine = this.engine;
    this.errorHandler = config.errorHandler || defaultErrorHandler;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.logger = config.logger || defaultLogger;
    this.hasLogger = Boolean(this.logger);
    this.pluginManager = pluginManager;
  }

  /**
   * Ensure the key is valid and with correct format
   */
  createValidKey(key: string): string | undefined {
    const { name, id, validKeys, noKeyValidation, noCompoundKey } = this;

    if (noKeyValidation) {
      return noCompoundKey ? key : [name, id, key].join('.');
    }

    // validate and return undefined if invalid key
    let compoundKey;
    Object.values(validKeys).forEach(validKeyName => {
      if (validKeyName === key) {
        compoundKey = noCompoundKey ? key : [name, id, key].join('.');
      }
    });

    return compoundKey;
  }

  /**
   * Switch to inMemoryEngine, bringing any existing data with.
   */
  swapQueueStoreToInMemoryEngine() {
    const { name, id, validKeys, noCompoundKey } = this;
    const inMemoryStorage = getStorageEngine('memoryStorage');

    // grab existing data, but only for this page's queue instance, not all
    // better to keep other queues in localstorage to be flushed later
    // than to pull them into memory and remove them from durable storage
    Object.keys(validKeys).forEach(key => {
      const value = this.get(validKeys[key]);
      const validKey = noCompoundKey ? key : [name, id, key].join('.');

      inMemoryStorage.setItem(validKey, value);
      // TODO: are we sure we want to drop clientData
      //  if cookies are not available and localstorage is full?
      this.remove(key);
    });

    this.engine = inMemoryStorage;
  }

  /**
   * Set value by key.
   */
  set(key: string, value: any) {
    const validKey = this.createValidKey(key);

    if (!validKey) {
      return;
    }

    try {
      // storejs that is used in localstorage engine already stringifies json
      this.engine.setItem(
        validKey,
        this.encrypt(stringifyWithoutCircular(value, false, [], this.logger)),
      );
    } catch (err) {
      if (isStorageQuotaExceeded(err)) {
        this.logger?.warn(
          'Storage is full or unavailable, switching to in memory storage. Data will not be persisted.',
        );
        // switch to inMemory engine
        this.swapQueueStoreToInMemoryEngine();
        // and save it there
        this.set(key, value);
      } else {
        this.onError(
          new Error(
            `Value for '${validKey}' cannot be persisted to storage, ${(err as Error).message}`,
          ),
        );
      }
    }
  }

  /**
   * Get by Key.
   */
  get<T = any>(key: string): Nullable<T> {
    const validKey = this.createValidKey(key);

    try {
      if (!validKey) {
        return null;
      }

      const str = this.decrypt(this.engine.getItem(validKey));

      if (isNullOrUndefined(str)) {
        return null;
      }

      // storejs that is used in localstorage engine already deserializes json strings but swallows errors
      return JSON.parse(str as string);
    } catch (err) {
      this.onError(
        new Error(
          `Value for '${validKey}' cannot be retrieved/parsed from storage, ${
            (err as Error).message
          }`,
        ),
      );
      return null;
    }
  }

  /**
   * Remove by Key.
   */
  remove(key: string) {
    const validKey = this.createValidKey(key);

    if (validKey) {
      this.engine.removeItem(validKey);
    }
  }

  /**
   * Get original engine
   */
  getOriginalEngine(): IStorage {
    return this.originalEngine;
  }

  /**
   * Decrypt values
   */
  decrypt(value?: Nullable<string>): Nullable<string> {
    if (isNullOrUndefined(value)) {
      return null;
    }

    return this.crypto(value as string, 'decrypt');
  }

  /**
   * Encrypt value
   */
  encrypt(value: any): string {
    return this.crypto(value, 'encrypt');
  }

  /**
   * Extension point to use with encryption plugins
   */
  crypto(value: string, mode: 'encrypt' | 'decrypt'): string {
    const noEncryption = !this.isEncrypted || !value || trim(value) === '';

    if (noEncryption) {
      return value;
    }

    const extensionPointName = `storage.${mode}`;
    const formattedValue = this.pluginManager
      ? this.pluginManager.invokeSingle<string>(extensionPointName, value)
      : value;

    return typeof formattedValue === 'undefined' ? value : formattedValue ?? '';
  }

  /**
   * Handle errors
   */
  onError(error: Error | unknown) {
    if (this.hasErrorHandler) {
      this.errorHandler?.onError(error, `Store ${this.id}`);
    } else {
      throw error;
    }
  }
}

export { Store };
