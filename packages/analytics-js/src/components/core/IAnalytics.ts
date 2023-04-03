import {
  AnonymousIdOptions,
  ApiCallback,
  ApiObject,
  LifecycleStatus,
  LoadOptions,
  SessionInfo,
} from '@rudderstack/analytics-js/state/types';
import { IHttpClient } from '@rudderstack/analytics-js/services/HttpClient/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { IExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader/types';
import { IStoreManager } from '@rudderstack/analytics-js/services/StoreManager/types';
import { IPluginsManager } from '@rudderstack/analytics-js/components/pluginsManager/types';
import { ConfigManager } from '@rudderstack/analytics-js/components/configManager';
import { ICapabilitiesManager } from '@rudderstack/analytics-js/components/capabilitiesManager/types';
import { IEventManager } from '@rudderstack/analytics-js/components/eventManager/types';
import { Store } from '@rudderstack/analytics-js/services/StoreManager';
import { IUserSessionManager } from '@rudderstack/analytics-js/components/userSessionManager/types';
import { Nullable } from '@rudderstack/analytics-js/types';
import {
  AliasCallOptions,
  GroupCallOptions,
  IdentifyCallOptions,
  PageCallOptions,
  TrackCallOptions,
} from './eventMethodOverloads';

// TODO: for all methods expose the overloads in globalObject but use only one object argument to pass values to instance
export interface IAnalytics {
  initialized: boolean;
  status: LifecycleStatus;
  httpClient: IHttpClient;
  logger: ILogger;
  errorHandler: IErrorHandler;
  pluginsManager: IPluginsManager;
  externalSrcLoader: IExternalSrcLoader;
  storageManager: IStoreManager;
  configManager: ConfigManager;
  capabilitiesManager: ICapabilitiesManager;
  eventManager: IEventManager;
  clientDataStore?: Store;
  userSessionManager: IUserSessionManager;

  /**
   * Call control pane to get client configs
   */
  load(writeKey: string, dataPlaneUrl: string, loadOptions?: Partial<LoadOptions>): void;

  /**
   * Orchestrate the lifecycle of the application phases/status
   */
  startLifecycle(): void;

  loadPolyfill(): void;

  init(): void;

  loadConfig(): void;

  loadPlugins(): void;

  onLoaded(): void;

  loadIntegrations(): void;

  onReady(): void;

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
  getAnonymousId(options?: AnonymousIdOptions): string;

  /**
   * To set anonymousId
   * @param anonymousId
   * @param rudderAmpLinkerParam AMP Linker ID string
   */
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): string;

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
  getSessionId(): number | null;

  /**
   * To fetch the current sessionInfo
   */
  getSessionInfo(): SessionInfo | null;
}
