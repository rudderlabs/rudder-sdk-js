import { Nullable } from './Nullable';
import { ApiCallback, ApiOptions } from './EventApi';
import { AnonymousIdOptions, LoadOptions } from './LoadOptions';
import { ApiObject } from './ApiObject';
import { ILogger } from './Logger';

export type AnalyticsIdentifyMethod = {
  (
    userId?: string,
    traits?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (userId: string, traits: Nullable<ApiObject>, callback: ApiCallback): void;
  (userId: string, callback: ApiCallback): void;
  (traits: Nullable<ApiObject>, options: Nullable<ApiOptions>, callback?: ApiCallback): void;
  (traits: Nullable<ApiObject>, callback?: ApiCallback): void;
};

export type AnalyticsPageMethod = {
  (
    category?: string,
    name?: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (category: string, name: string, properties: Nullable<ApiObject>, callback: ApiCallback): void;
  (
    name: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (category: string, name: string, callback: ApiCallback): void;
  (name: string, properties: Nullable<ApiObject>, callback: ApiCallback): void;
  (name: string, callback: ApiCallback): void;
  (properties: Nullable<ApiObject>, options: Nullable<ApiOptions>, callback?: ApiCallback): void;
  (properties: Nullable<ApiObject>, callback?: ApiCallback): void;
};

export type AnalyticsTrackMethod = {
  (
    event: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (event: string, properties: Nullable<ApiObject>, callback: ApiCallback): void;
  (event: string, callback: ApiCallback): void;
};

export type AnalyticsGroupMethod = {
  (
    groupId: string | number,
    traits?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (groupId: string | number, traits: Nullable<ApiObject>, callback: ApiCallback): void;
  (groupId: string | number, callback: ApiCallback): void;
  (traits: Nullable<ApiObject>, options: Nullable<ApiOptions>, callback?: ApiCallback): void;
  (traits: Nullable<ApiObject>, callback?: ApiCallback): void;
};

export type AnalyticsAliasMethod = {
  (
    to: Nullable<string>,
    from?: string,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (to: Nullable<string>, from: string, callback: ApiCallback): void;
  (to: Nullable<string>, options: Nullable<ApiOptions>, callback?: ApiCallback): void;
  (to: Nullable<string>, callback: ApiCallback): void;
  (to: ApiCallback): void;
  (): void;
};

export interface IRudderAnalytics<T = any> {
  analyticsInstances: Record<string, T>;
  defaultAnalyticsKey: string;
  logger: ILogger;

  /**
   * Set the writeKey of the analytics instance that should be default
   */
  setDefaultInstanceKey(writeKey: string, autoSet: boolean): void;

  /**
   * Get the instance of Analytics that is set as default
   */
  getAnalyticsInstance(writeKey?: string): T;

  /**
   * Trigger load event in buffer queue if exists
   */
  triggerBufferedLoadEvent(): void;

  /**
   * Call control pane to get client configs
   */
  load(writeKey: string, dataPlaneUrl: string, loadOptions?: Partial<LoadOptions>): void;

  /**
   * To register a callback for SDK ready state
   */
  ready(callback: ApiCallback): void;

  /**
   * To record a page view event
   */
  page: AnalyticsPageMethod;

  /**
   * To record a user track event
   */
  track: AnalyticsTrackMethod;

  /**
   * To record a user identification event
   */
  identify: AnalyticsIdentifyMethod;

  /**
   * To record a user alias event
   */
  alias: AnalyticsAliasMethod;

  /**
   * To record a user group event
   */
  group: AnalyticsGroupMethod;

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
  getAnonymousId(options?: AnonymousIdOptions): string | undefined;

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
}
