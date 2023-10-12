import { IStoreConfig, IStoreManager, StoreId } from '@rudderstack/analytics-js-common/types/Store';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { Store } from './Store';
/**
 * A service to manage stores & available storage client configurations
 */
declare class StoreManager implements IStoreManager {
  stores: Record<StoreId, Store>;
  isInitialized: boolean;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  pluginsManager?: IPluginsManager;
  hasErrorHandler: boolean;
  constructor(pluginsManager?: IPluginsManager, errorHandler?: IErrorHandler, logger?: ILogger);
  /**
   * Configure available storage client instances
   */
  init(): void;
  /**
   * Create store to persist data used by the SDK like session, used details etc
   */
  initClientDataStore(): void;
  /**
   * Create a new store
   */
  setStore(storeConfig: IStoreConfig): Store;
  /**
   * Retrieve a store
   */
  getStore(id: StoreId): Store | undefined;
  /**
   * Handle errors
   */
  onError(error: unknown): void;
}
export { StoreManager };
