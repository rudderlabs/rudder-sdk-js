import { IRudderAnalytics } from '@rudderstack/analytics-js-common/types/IRudderAnalytics';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import {
  AnonymousIdOptions,
  LoadOptions,
} from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ApiCallback, ApiOptions } from '@rudderstack/analytics-js-common/types/EventApi';
import { ApiObject } from '@rudderstack/analytics-js-common/types/ApiObject';
import { IdentifyTraits } from '@rudderstack/analytics-js-common/types/traits';
import { IAnalytics } from '../components/core/IAnalytics';
declare class RudderAnalytics implements IRudderAnalytics<IAnalytics> {
  static globalSingleton: Nullable<RudderAnalytics>;
  analyticsInstances: Record<string, IAnalytics>;
  defaultAnalyticsKey: string;
  logger: import('../services/Logger/Logger').Logger;
  constructor();
  /**
   * Set instance to use if no specific writeKey is provided in methods
   * automatically for the first created instance
   * TODO: to support multiple analytics instances in the near future
   */
  setDefaultInstanceKey(writeKey: string): void;
  /**
   * Retrieve an existing analytics instance
   */
  getAnalyticsInstance(writeKey?: string): IAnalytics;
  /**
   * Create new analytics instance and trigger application lifecycle start
   */
  load(writeKey: string, dataPlaneUrl: string, loadOptions?: Partial<LoadOptions>): void;
  /**
   * Get preloaded events in buffer queue if exists
   */
  getPreloadBuffer(): void;
  /**
   * Trigger load event in buffer queue if exists
   */
  triggerBufferedLoadEvent(): void;
  /**
   * Get ready callback arguments and forward to ready call
   */
  ready(callback: ApiCallback): void;
  /**
   * Process page arguments and forward to page call
   */
  page(
    category?: string | Nullable<ApiObject> | ApiCallback,
    name?: string | Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
    properties?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ): void;
  /**
   * Process track arguments and forward to page call
   */
  track(
    event: string,
    properties?: Nullable<ApiObject> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ): void;
  /**
   * Process identify arguments and forward to page call
   */
  identify(
    userId?: string | number | Nullable<IdentifyTraits>,
    traits?: Nullable<IdentifyTraits> | Nullable<ApiOptions> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ): void;
  /**
   * Process alias arguments and forward to page call
   */
  alias(
    to?: Nullable<string> | ApiCallback,
    from?: string | Nullable<ApiOptions> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ): void;
  /**
   * Process group arguments and forward to page call
   */
  group(
    groupId: string | number | Nullable<ApiObject> | ApiCallback,
    traits?: Nullable<ApiOptions> | Nullable<ApiObject> | ApiCallback,
    options?: Nullable<ApiOptions> | ApiCallback,
    callback?: ApiCallback,
  ): void;
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
export { RudderAnalytics };
