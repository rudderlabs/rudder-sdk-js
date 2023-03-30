import { HttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { Logger } from '@rudderstack/analytics-js/services/Logger';
import { ErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { ExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader';
import { Store, StoreManager } from '@rudderstack/analytics-js/services/StorageManager';
import { LifecycleStatus } from '@rudderstack/analytics-js/state/slices/lifecycle';
import {
  AnonymousIdOptions,
  ApiObject,
  ApiOptions,
  LoadOptions,
} from '@rudderstack/analytics-js/state/slices/loadOptions';
import { SessionInfo } from '@rudderstack/analytics-js/state/slices/session';
import { ApiCallback } from '@rudderstack/analytics-js/state/slices/eventBuffer';

// TODO: for all methods expose the overloads in globalObject but use only one object argument to pass values to instance
export interface IAnalytics {
  status: LifecycleStatus;
  httpClient: HttpClient;
  logger: Logger;
  errorHandler: ErrorHandler;
  pluginsManager: PluginsManager;
  externalSrcLoader: ExternalSrcLoader;
  storageManager: StoreManager;
  clientDataStore?: Store;

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
