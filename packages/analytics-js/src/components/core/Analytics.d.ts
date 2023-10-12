import { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { LifecycleStatus } from '@rudderstack/analytics-js-common/types/ApplicationLifecycle';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import {
  AnonymousIdOptions,
  LoadOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ApiCallback } from '@rudderstack/analytics-js-common/types/EventApi';
import {
  AliasCallOptions,
  GroupCallOptions,
  IdentifyCallOptions,
  PageCallOptions,
  TrackCallOptions,
} from '@rudderstack/analytics-js-common/utilities/eventMethodOverloads';
import { Store } from '../../services/StoreManager';
import { ICapabilitiesManager } from '../capabilitiesManager/types';
import { IEventManager } from '../eventManager/types';
import { IUserSessionManager } from '../userSessionManager/types';
import { IConfigManager } from '../configManager/types';
import { PreloadedEventCall } from '../preloadBuffer/types';
import { BufferQueue } from './BufferQueue';
import { IEventRepository } from '../eventRepository/types';
import { IAnalytics } from './IAnalytics';
declare class Analytics implements IAnalytics {
  preloadBuffer: BufferQueue<PreloadedEventCall>;
  initialized: boolean;
  status?: LifecycleStatus;
  logger: ILogger;
  errorHandler: IErrorHandler;
  httpClient: IHttpClient;
  externalSrcLoader: IExternalSrcLoader;
  capabilitiesManager: ICapabilitiesManager;
  pluginsManager?: IPluginsManager;
  storeManager?: IStoreManager;
  configManager?: IConfigManager;
  eventRepository?: IEventRepository;
  eventManager?: IEventManager;
  userSessionManager?: IUserSessionManager;
  clientDataStore?: Store;
  /**
   * Initialize services and components or use default ones if singletons
   */
  constructor();
  /**
   * Start application lifecycle if not already started
   */
  load(
    writeKey: string,
    dataPlaneUrl?: string | Partial<LoadOptions>,
    loadOptions?: Partial<LoadOptions>,
  ): void;
  /**
   * Orchestrate the lifecycle of the application phases/status
   */
  startLifecycle(): void;
  /**
   * Load browser polyfill if required
   */
  prepareBrowserCapabilities(): void;
  /**
   * Enqueue in SDK preload buffer events, used from preloadBuffer component
   */
  enqueuePreloadBufferEvents(bufferedEvents: PreloadedEventCall[]): void;
  /**
   * Process the buffer preloaded events by passing their arguments to the respective facade methods
   */
  processDataInPreloadBuffer(): void;
  prepareInternalServices(): void;
  /**
   * Load configuration
   */
  loadConfig(): void;
  /**
   * Initialize the storage and event queue
   */
  init(): void;
  /**
   * Load plugins
   */
  loadPlugins(): void;
  /**
   * Trigger onLoaded callback if any is provided in config & emit initialised event
   */
  onInitialized(): void;
  /**
   * Emit ready event
   */
  onReady(): void;
  /**
   * Consume preloaded events buffer
   */
  processBufferedEvents(): void;
  /**
   * Load device mode destinations
   */
  loadDestinations(): void;
  /**
   * Invoke the ready callbacks if any exist
   */
  onDestinationsReady(): void;
  ready(callback: ApiCallback): void;
  page(payload: PageCallOptions): void;
  track(payload: TrackCallOptions): void;
  identify(payload: IdentifyCallOptions): void;
  alias(payload: AliasCallOptions): void;
  group(payload: GroupCallOptions): void;
  reset(resetAnonymousId?: boolean): void;
  getAnonymousId(options?: AnonymousIdOptions): string | undefined;
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): void;
  getUserId(): Nullable<string> | undefined;
  getUserTraits(): Nullable<ApiObject> | undefined;
  getGroupId(): Nullable<string> | undefined;
  getGroupTraits(): Nullable<ApiObject> | undefined;
  startSession(sessionId?: number): void;
  endSession(): void;
  getSessionId(): Nullable<number>;
  setAuthToken(token: string): void;
}
export { Analytics };
