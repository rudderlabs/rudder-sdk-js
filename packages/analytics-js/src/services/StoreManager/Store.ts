import { trim } from '@rudderstack/analytics-js-common/utilities/string';
import { isNullOrUndefined, isString } from '@rudderstack/analytics-js-common/utilities/checks';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import type { IStorage, IStore, IStoreConfig } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { LOCAL_STORAGE, MEMORY_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { getMutatedError } from '@rudderstack/analytics-js-common/utilities/errors';
import { defaultLogger } from '../Logger';
import { defaultErrorHandler } from '../ErrorHandler';
import { isStorageQuotaExceeded } from '../../components/capabilitiesManager/detection';
import {
  BAD_COOKIES_WARNING,
  STORAGE_QUOTA_EXCEEDED_WARNING,
  STORE_DATA_FETCH_ERROR,
  STORE_DATA_SAVE_ERROR,
} from '../../constants/logMessages';
import { getStorageEngine } from './storages/storageEngine';

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
  pluginsManager?: IPluginsManager;

  constructor(config: IStoreConfig, engine?: IStorage, pluginsManager?: IPluginsManager) {
    this.id = config.id;
    this.name = config.name;
    this.isEncrypted = config.isEncrypted ?? false;
    this.validKeys = config.validKeys ?? {};
    this.engine = engine ?? getStorageEngine(LOCAL_STORAGE);
    this.noKeyValidation = Object.keys(this.validKeys).length === 0;
    this.noCompoundKey = config.noCompoundKey;
    this.originalEngine = this.engine;
    this.errorHandler = config.errorHandler ?? defaultErrorHandler;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.logger = config.logger ?? defaultLogger;
    this.pluginsManager = pluginsManager;
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
    const inMemoryStorage = getStorageEngine(MEMORY_STORAGE);

    // grab existing data, but only for this page's queue instance, not all
    // better to keep other queues in localstorage to be flushed later
    // than to pull them into memory and remove them from durable storage
    Object.keys(validKeys).forEach(key => {
      const value = this.get(validKeys[key] as string);
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
        this.logger?.warn(STORAGE_QUOTA_EXCEEDED_WARNING(`Store ${this.id}`));
        // switch to inMemory engine
        this.swapQueueStoreToInMemoryEngine();
        // and save it there
        this.set(key, value);
      } else {
        this.onError(getMutatedError(err, STORE_DATA_SAVE_ERROR(key)));
      }
    }
  }

  /**
   * Get by Key.
   */
  get<T = any>(key: string): Nullable<T> {
    const validKey = this.createValidKey(key);
    let decryptedValue;

    try {
      if (!validKey) {
        return null;
      }

      decryptedValue = this.decrypt(this.engine.getItem(validKey));

      if (isNullOrUndefined(decryptedValue)) {
        return null;
      }

      // storejs that is used in localstorage engine already deserializes json strings but swallows errors
      return JSON.parse(decryptedValue as string);
    } catch (err) {
      this.onError(new Error(`${STORE_DATA_FETCH_ERROR(key)}: ${(err as Error).message}`));

      // A hack for warning the users of potential partial SDK version migrations
      if (isString(decryptedValue) && decryptedValue.startsWith('RudderEncrypt:')) {
        this.logger?.warn(BAD_COOKIES_WARNING(key));
      }

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
  encrypt(value: Nullable<any>): string {
    return this.crypto(value, 'encrypt');
  }

  /**
   * Extension point to use with encryption plugins
   */
  crypto(value: Nullable<any>, mode: 'encrypt' | 'decrypt'): string {
    const noEncryption =
      !this.isEncrypted || !value || typeof value !== 'string' || trim(value) === '';

    if (noEncryption) {
      return value;
    }

    const extensionPointName = `storage.${mode}`;
    const formattedValue = this.pluginsManager
      ? this.pluginsManager.invokeSingle<string>(extensionPointName, value)
      : value;

    return typeof formattedValue === 'undefined' ? value : formattedValue ?? '';
  }

  /**
   * Handle errors
   */
  onError(error: unknown) {
    if (this.hasErrorHandler) {
      this.errorHandler?.onError(error, `Store ${this.id}`);
    } else {
      throw error;
    }
  }
}

export { Store };
