import { ICookieStorageOptions, IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
/**
 * A storage utility to persist values in cookies via Storage interface
 */
declare class CookieStorage implements IStorage {
  static globalSingleton: Nullable<CookieStorage>;
  logger?: ILogger;
  options?: ICookieStorageOptions;
  isSupportAvailable: boolean;
  isEnabled: boolean;
  length: number;
  constructor(options?: Partial<ICookieStorageOptions>, logger?: ILogger);
  configure(options: Partial<ICookieStorageOptions>): ICookieStorageOptions;
  setItem(key: string, value: Nullable<string>): boolean;
  getItem(key: string): Nullable<string>;
  removeItem(key: string): boolean;
  clear(): void;
  key(index: number): Nullable<string>;
}
export { CookieStorage };
