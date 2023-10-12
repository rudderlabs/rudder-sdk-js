import { ILocalStorageOptions, IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
/**
 * A storage utility to persist values in localstorage via Storage interface
 */
declare class LocalStorage implements IStorage {
  logger?: ILogger;
  options: ILocalStorageOptions;
  isSupportAvailable: boolean;
  isEnabled: boolean;
  length: number;
  constructor(options?: ILocalStorageOptions, logger?: ILogger);
  configure(options: Partial<ILocalStorageOptions>): ILocalStorageOptions;
  setItem(key: string, value: any): void;
  getItem(key: string): any;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string;
}
declare const defaultLocalStorage: LocalStorage;
export { LocalStorage, defaultLocalStorage };
