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

  constructor(config: IStoreConfig, engine?: IStorage, pluginsManager?: IPluginsManager) {
    this.private_id = config.id;
    this.private_name = config.name;
    this.private_isEncrypted = config.isEncrypted ?? false;
    this.private_validKeys = config.validKeys ?? [];
    this.private_engine = engine ?? getStorageEngine(LOCAL_STORAGE);
    this.private_noKeyValidation = Object.keys(this.private_validKeys).length === 0;
    this.private_noCompoundKey = config.noCompoundKey;
    this.private_originalEngine = this.private_engine;
    this.private_errorHandler = config.errorHandler ?? defaultErrorHandler;
    this.private_logger = config.logger ?? defaultLogger;
    this.private_pluginsManager = pluginsManager;
  }

  /**
   * Ensure the key is valid and with correct format
   */
  private_createValidKey(key: string): string | undefined {
    const {
      private_name: name,
      private_id: id,
      private_validKeys: validKeys,
      private_noKeyValidation: noKeyValidation,
      private_noCompoundKey: noCompoundKey,
    } = this;

    if (noKeyValidation) {
      return noCompoundKey ? key : [name, id, key].join('.');
    }

    // validate and return undefined if invalid key
    let compoundKey;
    validKeys.forEach(validKeyName => {
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
    const {
      private_name: name,
      private_id: id,
      private_validKeys: validKeys,
      private_noCompoundKey: noCompoundKey,
    } = this;
    const inMemoryStorage = getStorageEngine(MEMORY_STORAGE);

    // grab existing data, but only for this page's queue instance, not all
    // better to keep other queues in localstorage to be flushed later
    // than to pull them into memory and remove them from durable storage
    validKeys.forEach(key => {
      const value = this.get(key);
      const validKey = noCompoundKey ? key : [name, id, key].join('.');

      inMemoryStorage.setItem(validKey, value);
      // TODO: are we sure we want to drop clientData
      //  if cookies are not available and localstorage is full?
      this.remove(key);
    });

    this.private_engine = inMemoryStorage;
  }

  /**
   * Set value by key.
   */
  set(key: string, value: any) {
    const validKey = this.private_createValidKey(key);

    if (!validKey) {
      return;
    }

    try {
      // storejs that is used in localstorage engine already stringifies json
      this.private_engine.setItem(
        validKey,
        this.private_encrypt(stringifyWithoutCircular(value, false, [], this.private_logger)),
      );
    } catch (err) {
      if (isStorageQuotaExceeded(err)) {
        this.private_logger?.warn(STORAGE_QUOTA_EXCEEDED_WARNING(`Store ${this.private_id}`));
        // switch to inMemory engine
        this.swapQueueStoreToInMemoryEngine();
        // and save it there
        this.set(key, value);
      } else {
        this.private_onError(getMutatedError(err, STORE_DATA_SAVE_ERROR(key)));
      }
    }
  }

  /**
   * Get by Key.
   */
  get<T = any>(key: string): Nullable<T> {
    const validKey = this.private_createValidKey(key);
    let decryptedValue;

    try {
      if (!validKey) {
        return null;
      }

      decryptedValue = this.private_decrypt(this.private_engine.getItem(validKey));

      if (isNullOrUndefined(decryptedValue)) {
        return null;
      }

      // storejs that is used in localstorage engine already deserializes json strings but swallows errors
      return JSON.parse(decryptedValue as string);
    } catch (err) {
      this.private_onError(new Error(`${STORE_DATA_FETCH_ERROR(key)}: ${(err as Error).message}`));

      // A hack for warning the users of potential partial SDK version migrations
      if (isString(decryptedValue) && decryptedValue.startsWith('RudderEncrypt:')) {
        this.private_logger?.warn(BAD_COOKIES_WARNING(key));
      }

      return null;
    }
  }

  /**
   * Remove by Key.
   */
  remove(key: string) {
    const validKey = this.private_createValidKey(key);

    if (validKey) {
      this.private_engine.removeItem(validKey);
    }
  }

  /**
   * Get original engine
   */
  getOriginalEngine(): IStorage {
    return this.private_originalEngine;
  }

  /**
   * Decrypt values
   */
  private_decrypt(value?: Nullable<string>): Nullable<string> {
    if (isNullOrUndefined(value)) {
      return null;
    }

    return this.private_crypto(value as string, 'decrypt');
  }

  /**
   * Encrypt value
   */
  private_encrypt(value: Nullable<any>): string {
    return this.private_crypto(value, 'encrypt');
  }

  /**
   * Extension point to use with encryption plugins
   */
  private_crypto(value: Nullable<any>, mode: 'encrypt' | 'decrypt'): string {
    const noEncryption =
      !this.private_isEncrypted || !value || typeof value !== 'string' || trim(value) === '';

    if (noEncryption) {
      return value;
    }

    const extensionPointName = `storage.${mode}`;
    const formattedValue = this.private_pluginsManager
      ? this.private_pluginsManager.invokeSingle<string>(extensionPointName, value)
      : value;

    return typeof formattedValue === 'undefined' ? value : (formattedValue ?? '');
  }

  /**
   * Handle errors
   */
  private_onError(error: any) {
    if (this.private_errorHandler) {
      this.private_errorHandler.onError(error, `Store ${this.private_id}`);
    } else {
      throw error;
    }
  }
}

export { Store };
