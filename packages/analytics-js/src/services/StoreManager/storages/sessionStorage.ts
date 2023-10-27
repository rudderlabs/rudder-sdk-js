import type {
  ISessionStorageOptions,
  IStorage,
} from '@rudderstack/analytics-js-common/types/Store';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities/object';
import { isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import { SESSION_STORAGE } from '@rudderstack/analytics-js-common/constants/storages';
import { isStorageAvailable } from '../../../components/capabilitiesManager/detection';
import { defaultLogger } from '../../Logger';
import { getDefaultSessionStorageOptions } from './defaultOptions';

/**
 * A storage utility to persist values in SessionStorage via Storage interface
 */
class SessionStorage implements IStorage {
  logger?: ILogger;
  options: ISessionStorageOptions;
  isSupportAvailable = true;
  isEnabled = true;
  length = 0;
  store = globalThis.sessionStorage;

  constructor(options: ISessionStorageOptions = {}, logger?: ILogger) {
    this.options = getDefaultSessionStorageOptions();
    this.logger = logger;
    this.configure(options);
  }

  configure(options: Partial<ISessionStorageOptions>): ISessionStorageOptions {
    this.options = mergeDeepRight(this.options, options);
    this.isSupportAvailable = isStorageAvailable(SESSION_STORAGE, this, this.logger);
    this.isEnabled = Boolean(this.options.enabled && this.isSupportAvailable);
    return this.options;
  }

  setItem(key: string, value: any) {
    this.store.setItem(key, value);
    this.length = this.store.length;
  }

  getItem(key: string): any {
    const value = this.store.getItem(key);
    return isUndefined(value) ? null : value;
  }

  removeItem(key: string) {
    this.store.removeItem(key);
    this.length = this.store.length;
  }

  clear() {
    this.store.clear();
    this.length = 0;
  }

  key(index: number): string | null {
    return this.store.key(index);
  }
}

const defaultSessionStorage = new SessionStorage({}, defaultLogger);

export { SessionStorage, defaultSessionStorage };
