import { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import { ICapabilitiesManager } from '@rudderstack/analytics-js/components/capabilitiesManager/types';
import { IEventManager } from '@rudderstack/analytics-js/components/eventManager/types';
import { Store } from '@rudderstack/analytics-js/services/StoreManager';
import { IUserSessionManager } from '@rudderstack/analytics-js/components/userSessionManager/types';
import { IConfigManager } from '@rudderstack/analytics-js/components/configManager/types';
import { BufferQueue } from '@rudderstack/analytics-js/components/core/BufferQueue';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';
import { LifecycleStatus } from '@rudderstack/analytics-js-common/types/ApplicationLifecycle';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import {
  AnonymousIdOptions,
  LoadOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ApiCallback } from '@rudderstack/analytics-js-common/types/EventApi';
import { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import {
  AliasCallOptions,
  GroupCallOptions,
  IdentifyCallOptions,
  PageCallOptions,
  TrackCallOptions,
} from '@rudderstack/analytics-js-common/utilities/eventMethodOverloads';

export interface IAnalytics {
  preloadBuffer: BufferQueue<PreloadedEventCall>;
  initialized: boolean;
  status?: LifecycleStatus;
  httpClient: IHttpClient;
  logger: ILogger;
  errorHandler: IErrorHandler;
  externalSrcLoader: IExternalSrcLoader;
  capabilitiesManager: ICapabilitiesManager;
  storeManager?: IStoreManager;
  configManager?: IConfigManager;
  eventManager?: IEventManager;
  userSessionManager?: IUserSessionManager;
  pluginsManager?: IPluginsManager;
  clientDataStore?: Store;

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
   * Enqueue in buffer the events that were triggered pre SDK initialization
   */
  enqueuePreloadBufferEvents(bufferedEvents: PreloadedEventCall[]): void;

  /**
   * Start the process of consuming the buffered events that were triggered pre SDK initialization
   */
  processDataInPreloadBuffer(): void;

  /**
   * Assign instances for the internal services
   */
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
   * Trigger onLoaded callback if any is provided in config
   */
  onInitialized(): void;

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

  /**
   * To register a callback for SDK ready state
   */
  ready(callback: ApiCallback): void;

  /**
   * To record a page view event
   */
  page(pageOptions: PageCallOptions): void;

  /**
   * To record a user track event
   */
  track(trackCallOptions: TrackCallOptions): void;

  /**
   * To record a user identification event
   */
  identify(identifyCallOptions: IdentifyCallOptions): void;

  /**
   * To record a user alias event
   */
  alias(aliasCallOptions: AliasCallOptions): void;

  /**
   * To record a user group event
   */
  group(groupCallOptions: GroupCallOptions): void;

  /**
   * To get anonymousId set in the SDK
   */
  getAnonymousId(options?: AnonymousIdOptions): string | undefined;

  /**
   * To set anonymousId
   */
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): void;

  /**
   * Clear user information, optionally anonymousId as well
   */
  reset(resetAnonymousId?: boolean): void;

  /**
   * To get userId set in the SDK
   */
  getUserId(): Nullable<string> | undefined;

  /**
   * To get user traits set in the SDK
   */
  getUserTraits(): Nullable<ApiObject> | undefined;

  /**
   * To get groupId set in the SDK
   */
  getGroupId(): Nullable<string> | undefined;

  /**
   * To get group traits set in the SDK
   */
  getGroupTraits(): Nullable<ApiObject> | undefined;

  /**
   * To manually start user session in the SDK
   */
  startSession(sessionId?: number): void;

  /**
   * To manually end user session in the SDK
   */
  endSession(): void;

  /**
   * To fetch the current sessionId
   */
  getSessionId(): Nullable<number>;
}
