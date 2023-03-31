import {
  AnonymousIdOptions,
  ApiCallback,
  ApiObject,
  ApiOptions,
  LoadOptions,
} from '@rudderstack/analytics-js/state/types';
import { Nullable } from '@rudderstack/analytics-js/types';
import { IAnalytics } from '@rudderstack/analytics-js/components/core/IAnalytics';
import { BufferQueue } from '@rudderstack/analytics-js/components/preloadBuffer/BufferQueue';
import { PreloadedEventCall } from '@rudderstack/analytics-js/components/preloadBuffer/types';

export interface IRudderAnalytics {
  globalSingleton: Nullable<IRudderAnalytics>;
  analyticsInstances: Record<string, IAnalytics>;
  defaultAnalyticsKey: string;
  preloadBuffer: BufferQueue<PreloadedEventCall>;

  enqueuePreloadBufferEvents: (bufferedEvents: PreloadedEventCall[]) => void;
  processDataInPreloadBuffer: () => void;

  /**
   * Call control pane to get client configs
   */
  load: (writeKey: string, dataPlaneUrl: string, loadOptions?: LoadOptions) => void;

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
    properties?: ApiObject,
    options?: ApiOptions,
    callback?: ApiCallback,
  ): void;
  page(category: string, name: string, properties: ApiObject, callback: ApiCallback): void;
  page(name: string, properties?: ApiObject, options?: ApiOptions, callback?: ApiCallback): void;
  page(category: string, name: string, callback: ApiCallback): void;
  page(name: string, properties: ApiObject, callback: ApiCallback): void;
  page(name: string, callback: ApiCallback): void;
  page(properties: ApiObject, options: ApiOptions, callback?: ApiCallback): void;
  page(properties: ApiObject, callback?: ApiCallback): void;

  /**
   * To record a user track event
   */
  track(event: string, properties?: ApiObject, options?: ApiOptions, callback?: ApiCallback): void;
  track(event: string, properties: ApiObject, callback: ApiCallback): void;
  track(event: string, callback: ApiCallback): void;

  /**
   * To record a user identification event
   */
  identify(userId?: string, traits?: ApiObject, options?: ApiOptions, callback?: ApiCallback): void;
  identify(userId: string, traits: ApiObject, callback: ApiCallback): void;
  identify(userId: string, callback: ApiCallback): void;
  identify(traits: ApiObject, options: ApiOptions, callback?: ApiCallback): void;
  identify(traits: ApiObject, callback?: ApiCallback): void;

  /**
   * To record a user alias event
   */
  alias(to: string, from?: string, options?: ApiOptions, callback?: ApiCallback): void;
  alias(to: string, from: string, callback: ApiCallback): void;
  alias(to: string, callback: ApiCallback): void;
  alias(to: string, options: ApiOptions, callback?: ApiCallback): void;

  /**
   * To record a user group event
   */
  group(groupId: string, traits?: ApiObject, options?: ApiOptions, callback?: ApiCallback): void;
  group(groupId: string, traits: ApiObject, callback: ApiCallback): void;
  group(groupId: string, callback: ApiCallback): void;
  group(traits: ApiObject, options: ApiOptions, callback?: ApiCallback): void;
  group(traits: ApiObject, callback?: ApiCallback): void;

  /**
   * To get anonymousId set in the SDK
   */
  getAnonymousId(options?: AnonymousIdOptions): string;

  /**
   * To set anonymousId
   * @param anonymousId
   * @param rudderAmpLinkerParm AMP Linker ID string
   */
  setAnonymousId(anonymousId?: string, rudderAmpLinkerParm?: string): void;

  /**
   * Clear user information
   * @param flag If true, clears anonymousId as well
   */
  reset(flag?: boolean): void;

  /**
   * To get userId set in the SDK
   */
  getUserId(): string;

  /**
   * To get user traits set in the SDK
   */
  getUserTraits(): ApiObject;

  /**
   * To get groupId set in the SDK
   */
  getGroupId(): string;

  /**
   * To get group traits set in the SDK
   */
  getGroupTraits(): ApiObject;

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

  getAnalyticsInstance(writeKey?: string): IAnalytics;
}
