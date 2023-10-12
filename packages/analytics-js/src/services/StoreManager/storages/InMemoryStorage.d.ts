import { IInMemoryStorageOptions, IStorage } from '@rudderstack/analytics-js-common/types/Store';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
/**
 * A storage utility to retain values in memory via Storage interface
 */
declare class InMemoryStorage implements IStorage {
  logger?: ILogger;
  options: IInMemoryStorageOptions;
  isEnabled: boolean;
  length: number;
  data: Record<string, any>;
  constructor(options?: IInMemoryStorageOptions, logger?: ILogger);
  configure(options: Partial<IInMemoryStorageOptions>): IInMemoryStorageOptions;
  setItem(key: string, value: any): any;
  getItem(key: string): any;
  removeItem(key: string): null;
  clear(): void;
  key(index: number): string;
}
declare const defaultInMemoryStorage: InMemoryStorage;
export { InMemoryStorage, defaultInMemoryStorage };
