import {
  AnonymousIdOptions,
  ApiCallback,
  ApiObject,
  ApiOptions,
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
import { ICapabilitiesManager } from '@rudderstack/analytics-js/components/capabilitiesManager/types';
import { IEventManager } from '@rudderstack/analytics-js/components/eventManager/types';
import { Store } from '@rudderstack/analytics-js/services/StoreManager';
import { IUserSessionManager } from '@rudderstack/analytics-js/components/userSessionManager/types';
import { IConfigManager } from '@rudderstack/analytics-js/components/configManager/types';

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
  configManager: IConfigManager;
  capabilitiesManager: ICapabilitiesManager;
  eventManager: IEventManager;
  clientDataStore?: Store;
  userSessionManager: IUserSessionManager;

  /**
   * Call control pane to get client configs
   */
  load: (writeKey: string, dataPlaneUrl: string, loadOptions: Partial<LoadOptions>) => void;

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
   * @param rudderAmpLinkerParm AMP Linker ID string
   */
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParm?: string): string;

  /**
   * Clear user information
   * @param flag If true, clears anonymousId as well
   */
  reset(flag?: boolean): void;

  /**
   * To get userId set in the SDK
   */
  getUserId(): string | undefined;

  /**
   * To get user traits set in the SDK
   */
  getUserTraits(): ApiObject | undefined;

  /**
   * To get groupId set in the SDK
   */
  getGroupId(): string | undefined;

  /**
   * To get group traits set in the SDK
   */
  getGroupTraits(): ApiObject | undefined;

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

export type PageCallOptions = {
  category?: string;
  name?: string;
  properties?: ApiObject;
  options?: ApiOptions;
  callback?: ApiCallback;
};

export type TrackCallOptions = {
  name: string;
  properties?: ApiObject;
  options?: ApiOptions;
  callback?: ApiCallback;
};

export type IdentifyCallOptions = {
  userId?: string;
  traits?: ApiObject;
  options?: ApiOptions;
  callback?: ApiCallback;
};

export type AliasCallOptions = {
  to: string;
  from?: string;
  options?: ApiOptions;
  callback?: ApiCallback;
};

export type GroupCallOptions = {
  groupId: string;
  traits?: ApiObject;
  options?: ApiOptions;
  callback?: ApiCallback;
};
