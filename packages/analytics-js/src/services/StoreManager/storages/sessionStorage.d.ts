import { ISessionStorageOptions, IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
/**
 * A storage utility to persist values in SessionStorage via Storage interface
 */
declare class SessionStorage implements IStorage {
  logger?: ILogger;
  options: ISessionStorageOptions;
  isSupportAvailable: boolean;
  isEnabled: boolean;
  length: number;
  store: Storage;
  constructor(options?: ISessionStorageOptions, logger?: ILogger);
  configure(options: Partial<ISessionStorageOptions>): ISessionStorageOptions;
  setItem(key: string, value: any): void;
  getItem(key: string): any;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
}
declare const defaultSessionStorage: SessionStorage;
export { SessionStorage, defaultSessionStorage };
