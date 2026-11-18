import type { ILocalStorageOptions, IStorage } from '@rudderstack/analytics-js-common/types/Store';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { LOCAL_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { isStorageAvailable } from '@rudderstack/analytics-js-common/utilities/storage';
import { defaultLogger } from '../../Logger';
import { LOCAL_STORAGE_PROBE_KEY } from '../../../constants/storage';
import { getDefaultLocalStorageOptions } from './defaultOptions';
import { InMemoryStorage } from './InMemoryStorage';

const selectStorage = (): Storage => {
  try {
    const storage = window.localStorage;
    storage.setItem(LOCAL_STORAGE_PROBE_KEY, 'yes');
    storage.removeItem(LOCAL_STORAGE_PROBE_KEY);
    return storage;
  } catch {
    return new InMemoryStorage();
  }
};

const storage = selectStorage();

/**
 * A storage utility to persist values in localstorage via Storage interface
 */
class LocalStorage implements IStorage {
  logger?: ILogger;
  options: ILocalStorageOptions;
  isSupportAvailable = true;
  isEnabled = true;
  length = 0;

  constructor(logger?: ILogger) {
    this.options = getDefaultLocalStorageOptions();
    this.logger = logger;
  }

  configure(options?: Partial<ILocalStorageOptions>): ILocalStorageOptions {
    this.options = mergeDeepRight(this.options, options ?? {});
    this.isSupportAvailable = isStorageAvailable(LOCAL_STORAGE);
    this.isEnabled = Boolean(this.options.enabled && this.isSupportAvailable);
    return this.options;
  }

  setItem(key: string, value: unknown) {
    if (key) {
      // Keep the same encoding used by existing SDK storage entries.
      const encoded =
        typeof value === 'function' ? String(value) : (JSON.stringify(value) ?? 'undefined');
      storage.setItem(key, encoded);
    }
    this.length = storage.length;
  }

  getItem(key: string): any {
    const value = storage.getItem(key);
    if (typeof value !== 'string') {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  removeItem(key: string) {
    storage.removeItem(key);
    this.length = storage.length;
  }

  clear() {
    storage.clear();
    this.length = 0;
  }

  key(index: number): Nullable<string> {
    const curKeys = this.keys();
    return curKeys[index] ?? null;
  }

  keys(): string[] {
    const keys: string[] = [];
    const { length } = storage;
    for (let index = 0; index < length; index += 1) {
      const key = storage.key(index);
      if (key !== null) {
        keys.push(key);
      }
    }
    return keys;
  }
}

const defaultLocalStorage = new LocalStorage(defaultLogger);

export { LocalStorage, defaultLocalStorage };
