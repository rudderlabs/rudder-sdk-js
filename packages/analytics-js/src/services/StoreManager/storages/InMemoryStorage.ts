import { IInMemoryStorageOptions, IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { mergeDeepRight } from '@rudderstack/analytics-js-common/utilities';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { getDefaultInMemoryStorageOptions } from './defaultOptions';

/**
 * A storage utility to retain values in memory via Storage interface
 */
class InMemoryStorage implements IStorage {
  logger?: ILogger;
  options: IInMemoryStorageOptions;
  isEnabled = true;
  length = 0;
  data: Record<string, any> = {};

  constructor(options?: IInMemoryStorageOptions, logger?: ILogger) {
    this.options = getDefaultInMemoryStorageOptions();
    this.logger = logger;
    this.configure(options ?? {});
  }

  configure(options: Partial<IInMemoryStorageOptions>): IInMemoryStorageOptions {
    this.options = mergeDeepRight(this.options, options);
    this.isEnabled = Boolean(this.options.enabled);
    return this.options;
  }

  setItem(key: string, value: any): any {
    this.data[key] = value;
    this.length = Object.keys(this.data).length;
    return value;
  }

  getItem(key: string): any {
    if (key in this.data) {
      return this.data[key];
    }
    return null;
  }

  removeItem(key: string) {
    if (key in this.data) {
      delete this.data[key];
    }
    this.length = Object.keys(this.data).length;
    return null;
  }

  clear() {
    this.data = {};
    this.length = 0;
  }

  key(index: number): string {
    return Object.keys(this.data)[index];
  }
}

const defaultInMemoryStorage = new InMemoryStorage({}, defaultLogger);

export { InMemoryStorage, defaultInMemoryStorage };
