import {
  AnonymousIdOptions,
  ApiCallback,
  ApiObject,
  ApiOptions,
  LoadOptions,
  SessionInfo,
} from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';
import { IAnalytics } from './IAnalytics';
import { BufferQueue } from './BufferQueue';

export interface IRudderAnalytics {
  analyticsInstances: Record<string, IAnalytics>;
  defaultAnalyticsKey: string;
  preloadBuffer: BufferQueue<PreloadedEventCall>;

  /**
   * Enqueue in buffer the events that were triggered pre SDK initialization
   */
  enqueuePreloadBufferEvents(bufferedEvents: PreloadedEventCall[]): void;

  /**
   * Start the process of consuming the buffered events that were triggered pre SDK initialization
   */
  processDataInPreloadBuffer(): void;

  /**
   * Set the writeKey of the analytics instance that should be default
   */
  setDefaultInstanceKey(writeKey: string, autoSet: boolean): void;

  /**
   * Get the instance of Analytics that is set as default
   */
  getAnalyticsInstance(writeKey?: string): IAnalytics;

  /**
   * Call control pane to get client configs
   */
  load(writeKey: string, dataPlaneUrl: string, loadOptions?: LoadOptions): void;

  /**
   * To register a callback for SDK ready state
   */
  ready(callback: ApiCallback): void;

  /**
   * To record a page view event
   */
  page(
    category?: string,
    name?: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  page(
    category: string,
    name: string,
    properties: Nullable<ApiObject>,
    callback: ApiCallback,
  ): void;
  page(
    name: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  page(category: string, name: string, callback: ApiCallback): void;
  page(name: string, properties: Nullable<ApiObject>, callback: ApiCallback): void;
  page(name: string, callback: ApiCallback): void;
  page(
    properties: Nullable<ApiObject>,
    options: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  page(properties: Nullable<ApiObject>, callback?: ApiCallback): void;

  /**
   * To record a user track event
   */
  track(
    event: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  track(event: string, properties: Nullable<ApiObject>, callback: ApiCallback): void;
  track(event: string, callback: ApiCallback): void;

  /**
   * To record a user identification event
   */
  identify(
    userId?: string,
    traits?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  identify(userId: string, traits: Nullable<ApiObject>, callback: ApiCallback): void;
  identify(userId: string, callback: ApiCallback): void;
  identify(
    traits: Nullable<ApiObject>,
    options: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  identify(traits: Nullable<ApiObject>, callback?: ApiCallback): void;

  /**
   * To record a user alias event
   */
  alias(to: string, from?: string, options?: Nullable<ApiOptions>, callback?: ApiCallback): void;
  alias(to: string, from: string, callback: ApiCallback): void;
  alias(to: string, options: Nullable<ApiOptions>, callback?: ApiCallback): void;
  alias(to: string, callback: ApiCallback): void;

  /**
   * To record a user group event
   */
  group(
    groupId: string | number,
    traits?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  group(groupId: string | number, traits: Nullable<ApiObject>, callback: ApiCallback): void;
  group(groupId: string | number, callback: ApiCallback): void;
  group(traits: Nullable<ApiObject>, options: Nullable<ApiOptions>, callback?: ApiCallback): void;
  group(traits: Nullable<ApiObject>, callback?: ApiCallback): void;

  /**
   * Clear user information
   *
   * @param resetAnonymousId optionally clears anonymousId as well
   */
  reset(resetAnonymousId?: boolean): void;

  /**
   * To get anonymousId set in the SDK
   *
   * @param options options for anonymousId
   */
  getAnonymousId(options?: AnonymousIdOptions): string;

  /**
   * To set anonymousId
   *
   * @param anonymousId custom anonymousId value
   * @param rudderAmpLinkerParam AMP Linker ID string
   */
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParam?: string): void;

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

  /**
   * To fetch the current sessionInfo
   */
  getSessionInfo(): Nullable<SessionInfo>;
}
