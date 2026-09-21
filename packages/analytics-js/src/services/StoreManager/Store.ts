import { trim } from '@rudderstack/analytics-js-common/utilities/string';
import { isNullOrUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import type { IStorage, IStore, IStoreConfig } from '@rudderstack/analytics-js-common/types/Store';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { MEMORY_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { isStorageQuotaExceeded } from '@rudderstack/analytics-js-common/utilities/storage';
import {
  STORAGE_QUOTA_EXCEEDED_WARNING,
  STORE_DATA_FETCH_ERROR,
  STORE_DATA_SAVE_ERROR,
} from '../../constants/logMessages';
import { getStorageEngine } from './storages/storageEngine';
import { state } from '../../state';

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
  noSwapOnQuota?: boolean;
  errorHandler: IErrorHandler;
  logger: ILogger;
  pluginsManager: IPluginsManager;

  constructor(config: IStoreConfig, engine: IStorage, pluginsManager: IPluginsManager) {
    this.id = config.id;
    this.name = config.name;
    this.isEncrypted = config.isEncrypted ?? false;
    this.validKeys = config.validKeys ?? {};
    this.engine = engine;
    this.noKeyValidation = Object.keys(this.validKeys).length === 0;
    this.noCompoundKey = config.noCompoundKey;
    this.noSwapOnQuota = config.noSwapOnQuota;
    this.originalEngine = this.engine;
    this.errorHandler = config.errorHandler;
    this.logger = config.logger;
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
    const { validKeys, noCompoundKey } = this;
    const inMemoryStorage = getStorageEngine(MEMORY_STORAGE);
    const durableEngine = this.engine;

    // grab existing data, but only for this page's queue instance, not all
    // better to keep other queues in localstorage to be flushed later
    // than to pull them into memory and remove them from durable storage
    const existingEntries = Object.values(validKeys).map(
      storeKey => [storeKey, this.get(storeKey)] as [string, any],
    );

    // Client data stores keep their durable copy. Dropping rl_user_id and the
    // other cookie keys here would lose the identity on the next page load.
    const canDropDurableCopy = !noCompoundKey && durableEngine !== inMemoryStorage;

    this.engine = inMemoryStorage;

    existingEntries.forEach(([storeKey, value]) => {
      if (isNullOrUndefined(value)) {
        return;
      }

      // Write through set() so the values are serialised and keyed exactly as
      // every later read expects them.
      this.set(storeKey, value);

      // Only give up the durable copy once the value is readable from memory:
      // set() swallows serialisation and storage failures, and get() returns
      // null on a parse or decryption failure.
      const validKey = this.createValidKey(storeKey);
      if (canDropDurableCopy && validKey && !isNullOrUndefined(this.get(storeKey))) {
        try {
          durableEngine.removeItem(validKey);
        } catch {
          // The durable engine can refuse a removal (NS_ERROR_STORAGE_BUSY). The
          // value is already safe in memory, so leave the stale copy for a later
          // cleanup rather than aborting the migration - this runs inside set()'s
          // catch, and throwing here would lose the value that triggered it.
        }
      }
    });
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
        this.logger.warn(STORAGE_QUOTA_EXCEEDED_WARNING(`Store ${this.id}`));

        if (this.noSwapOnQuota) {
          return;
        }

        // switch to inMemory engine
        this.swapQueueStoreToInMemoryEngine();
        // and save it there
        this.set(key, value);
      } else {
        const customMessage = STORE_DATA_SAVE_ERROR(key);
        this.onError(err, customMessage, customMessage);
      }
    }
  }

  /**
   * Get by Key.
   */
  get<T = any>(key: string): Nullable<T> {
    const validKey = this.createValidKey(key);
    let storedValue;
    let decryptedValue;
    let isRetrieved = false;

    try {
      if (!validKey) {
        return null;
      }

      storedValue = this.engine.getItem(validKey);
      decryptedValue = this.decrypt(storedValue);

      if (isNullOrUndefined(decryptedValue) || decryptedValue === '') {
        return null;
      }

      isRetrieved = true;
      // storejs that is used in localstorage engine already deserializes json strings but swallows errors
      return JSON.parse(decryptedValue as string);
    } catch (err) {
      // Both encryption plugins, and `crypto` with no decrypt extension point registered, return
      // an unrecognised format untouched, so an unchanged value may still be readable; keep it.
      const isDecrypted = !this.isEncrypted || decryptedValue !== storedValue;

      // Drop a parse failure so a later read is a clean miss instead of the same error on every
      // poll, and only while the entry still holds what was read. Web Storage has no conditional
      // delete, so that narrows rather than closes the window in which another tab's write is
      // dropped; the cost there is a restarted reclaim handshake, since queued events are written
      // only by the context that owns the store. The compare is serialized because storejs
      // deserializes on every read, and uses `JSON.stringify` because `stringifyWithoutCircular`
      // returns null on failure, which would make two unserializable values compare equal.
      try {
        if (
          isRetrieved &&
          isDecrypted &&
          JSON.stringify(this.engine.getItem(validKey as string)) === JSON.stringify(storedValue)
        ) {
          this.remove(key);
        }
      } catch {
        // The engine can refuse the re-read or the removal; a later read retries.
      }

      const encryptionPluginName = state.storage.encryptionPluginName.value;
      // Skip error reporting only when the encryption plugin is configured but failed to load
      const shouldReportError =
        !encryptionPluginName || !state.plugins.failedPlugins.value.includes(encryptionPluginName);
      if (shouldReportError) {
        const customMessage = STORE_DATA_FETCH_ERROR(key);
        this.onError(err, customMessage, customMessage);
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

    return typeof formattedValue === 'undefined' ? value : (formattedValue ?? '');
  }

  /**
   * Handle errors
   */
  onError(error: unknown, customMessage?: string, groupingHash?: string) {
    this.errorHandler.onError({
      error,
      context: `Store ${this.id}`,
      customMessage,
      groupingHash,
    });
  }
}

export { Store };
