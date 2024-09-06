import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import type {
  AnonymousIdOptions,
  ConsentOptions,
  LoadOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import type { ApiCallback } from '@rudderstack/analytics-js-common/types/EventApi';
import type { IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import type { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import type {
  AliasCallOptions,
  GroupCallOptions,
  IdentifyCallOptions,
  PageCallOptions,
  TrackCallOptions,
} from '@rudderstack/analytics-js-common/utilities/eventMethodOverloads';
import type { BufferQueue } from '@rudderstack/analytics-js-common/services/BufferQueue/BufferQueue';
import type { Store } from '../../services/StoreManager';
import type { IUserSessionManager } from '../userSessionManager/types';
import type { IConfigManager } from '../configManager/types';
import type { IEventManager } from '../eventManager/types';
import type { ICapabilitiesManager } from '../capabilitiesManager/types';
import type { PreloadedEventCall } from '../preloadBuffer/types';

export interface IAnalytics {
  private_preloadBuffer: BufferQueue<PreloadedEventCall>;
  private_initialized: boolean;
  private_httpClient: IHttpClient;
  private_logger: ILogger;
  private_errorHandler: IErrorHandler;
  private_externalSrcLoader: IExternalSrcLoader;
  private_capabilitiesManager: ICapabilitiesManager;
  private_storeManager?: IStoreManager;
  private_configManager?: IConfigManager;
  private_eventManager?: IEventManager;
  private_userSessionManager?: IUserSessionManager;
  private_pluginsManager?: IPluginsManager;

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
  private_startLifecycle(): void;

  /**
   * Load browser polyfill if required
   */
  private_onMounted(): void;

  /**
   * Prepare internal services and load configuration
   */
  private_onBrowserCapabilitiesReady(): void;

  /**
   * Enqueue in buffer the events that were triggered pre SDK initialization
   */
  enqueuePreloadBufferEvents(bufferedEvents: PreloadedEventCall[]): void;

  /**
   * Start the process of consuming the buffered events that were triggered pre SDK initialization
   */
  private_processDataInPreloadBuffer(): void;

  /**
   * Assign instances for the internal services
   */
  private_prepareInternalServices(): void;

  /**
   * Load configuration
   */
  private_loadConfig(): void;

  /**
   * Initialize the storage and event queue
   */
  private_onPluginsReady(): void;

  /**
   * Load plugins
   */
  private_onConfigured(): void;

  /**
   * Trigger onLoaded callback if any is provided in config & emit initialised event
   */
  private_onInitialized(): void;

  /**
   * Emit ready event
   */
  private_onReady(): void;

  /**
   * Consume preloaded events buffer
   */
  private_processBufferedEvents(): void;

  /**
   * Load device mode destinations
   */
  private_loadDestinations(): void;

  /**
   * Invoke the ready callbacks if any exist
   */
  private_onDestinationsReady(): void;

  /**
   * To register a callback for SDK ready state
   */
  ready(callback: ApiCallback, isBufferedInvocation?: boolean): void;

  /**
   * To record a page view event
   */
  page(pageOptions: PageCallOptions, isBufferedInvocation?: boolean): void;

  /**
   * To record a user track event
   */
  track(trackCallOptions: TrackCallOptions, isBufferedInvocation?: boolean): void;

  /**
   * To record a user identification event
   */
  identify(identifyCallOptions: IdentifyCallOptions, isBufferedInvocation?: boolean): void;

  /**
   * To record a user alias event
   */
  alias(aliasCallOptions: AliasCallOptions, isBufferedInvocation?: boolean): void;

  /**
   * To record a user group event
   */
  group(groupCallOptions: GroupCallOptions, isBufferedInvocation?: boolean): void;

  /**
   * To get anonymousId set in the SDK
   */
  getAnonymousId(options?: AnonymousIdOptions): string | undefined;

  /**
   * To set anonymousId
   */
  setAnonymousId(
    anonymousId?: string,
    rudderAmpLinkerParam?: string,
    isBufferedInvocation?: boolean,
  ): void;

  /**
   * Clear user information, optionally anonymousId as well
   */
  reset(resetAnonymousId?: boolean, isBufferedInvocation?: boolean): void;

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
  startSession(sessionId?: number, isBufferedInvocation?: boolean): void;

  /**
   * To manually end user session in the SDK
   */
  endSession(isBufferedInvocation?: boolean): void;

  /**
   * To fetch the current sessionId
   */
  getSessionId(): Nullable<number>;

  /**
   * To record consent
   * @param options Consent API options
   */
  consent(options?: ConsentOptions, isBufferedInvocation?: boolean): void;

  /**
   * To set auth token
   */
  setAuthToken(token: string): void;
}
