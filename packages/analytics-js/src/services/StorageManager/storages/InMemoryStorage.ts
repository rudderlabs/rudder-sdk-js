import * as R from 'ramda';
import { Logger } from '@rudderstack/analytics-js/services/Logger';
import { IInMemoryStorageOptions } from '../types';
import { getDefaultInMemoryStorageOptions } from './defaultOptions';

class InMemoryStorage {
  logger?: Logger;
  options: IInMemoryStorageOptions;
  isEnabled = true;
  length = 0;
  data: Record<string, any> = {};

  constructor(options: IInMemoryStorageOptions = {}, logger?: Logger) {
    this.options = getDefaultInMemoryStorageOptions();
    this.logger = logger;
    this.configure(options);
  }

  configure(options: Partial<IInMemoryStorageOptions>): IInMemoryStorageOptions {
    this.options = R.mergeRight(this.options, options);
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

const defaultInMemoryStorage = new InMemoryStorage();

export { InMemoryStorage, defaultInMemoryStorage };
