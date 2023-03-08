import { GenericObject } from '../../types';
import { defaultStorageEngine, inMemoryStorageEngine } from './storage';
import { isStorageQuotaExceeded } from '../../components/capabilitiesManager/detection';

// TODO: should we use the same store engine for everything??
/**
 * Store Implementation with dedicated storage
 */
class Store {
  id: string;

  name: string;

  keys: GenericObject;

  engine: Storage;

  originalEngine: Storage;

  constructor(name: string, id: string, keys?: GenericObject, optionalEngine?: Storage) {
    this.id = id;
    this.name = name;
    this.keys = keys || {};
    this.engine = optionalEngine || defaultStorageEngine;
    this.originalEngine = this.engine;
  }

  /**
   * Ensure the key is valid
   */
  createValidKey(key: string): string | undefined {
    const { name, id, keys } = this;

    if (Object.keys(keys).length === 0) {
      return [name, id, key].join('.');
    }

    // validate and return undefined if invalid key
    let compoundKey;
    Object.values(keys).forEach(existingKeyName => {
      if (existingKeyName === key) {
        compoundKey = [name, id, key].join('.');
      }
    });

    return compoundKey;
  }

  /**
   * Switch to inMemoryEngine, bringing any existing data with.
   */
  swapToInMemoryEngine() {
    // grab existing data, but only for this page's queue instance, not all
    // better to keep other queues in localstorage to be flushed later
    // than to pull them into memory and remove them from durable storage
    Object.keys(this.keys).forEach(key => {
      const value = this.get(this.keys[key]);
      const compoundKey = [this.name, this.id, key].join('.');

      inMemoryStorageEngine.setItem(compoundKey, value);
      this.remove(key);
    });

    this.engine = inMemoryStorageEngine;
  }

  /**
   * Set value by key.
   */
  set(key: string, value: any) {
    const compoundKey = this.createValidKey(key);

    if (!compoundKey) {
      return;
    }

    try {
      this.engine.setItem(compoundKey, JSON.stringify(value));
    } catch (err) {
      if (isStorageQuotaExceeded(err)) {
        // switch to inMemory engine
        this.swapToInMemoryEngine();
        // and save it there
        this.set(key, value);
      }
    }
  }

  /**
   * Get by Key.
   */
  get(key: string): any {
    try {
      const validKey = this.createValidKey(key);

      if (!validKey) {
        return null;
      }

      const str = this.engine.getItem(validKey);

      // TODO: make isNull, isUndefined & isEmpty helpers
      if (str === null || str === undefined) {
        return null;
      }

      return JSON.parse(str);
    } catch (err) {
      console.error(`error: value 'validKey' cannot be retrieved/parsed from storage`);
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
  getOriginalEngine(): Storage {
    return this.originalEngine;
  }
}

export { Store };
