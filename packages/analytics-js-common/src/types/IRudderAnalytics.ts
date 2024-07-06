import type { Nullable } from './Nullable';
import type { ApiCallback, ApiOptions } from './EventApi';
import type { AnonymousIdOptions, ConsentOptions, LoadOptions } from './LoadOptions';
import type { ApiObject } from './ApiObject';
import type { ILogger } from './Logger';
import type { IdentifyTraits } from './traits';

// identify(userId, traits, options, callback);
// identify(userId, traits, options);
// identify(userId, traits);

// identify(userId, traits, callback);
// identify(userId, traits);

// identify(userId, callback);
// identify(userId);

// identify(traits, options, callback);
// identify(traits, options);

// identify(traits, callback);
// identify(traits);

// --------------

// identify(userId, [traits], [options], [callback]);
// identify(userId, [traits], [callback]);
// identify(userId, [callback]);

// identify(traits, [options], [callback]);
// identify(traits, [callback]);

// ================
// page(category, name, properties, options, callback);
// page(category, name, properties, options);
// page(category, name, properties);
// page(category, name);

// page(category, name, properties, callback);
// page(category, name, properties);

// page(category, name, callback);
// page(category, name);

// page(name, properties, options, callback);
// page(name, properties, options);

// page(name, properties, callback);
// page(name, properties);

// page(name, callback);
// page(name);

// page(properties, options, callback);
// page(properties, options);

// page(properties, callback);
// page(properties);

// page(callback);
// page();

// --------------------------------
// page(category, name, [properties], [options], [callback]);
// page(category, name, [properties], [callback]);
// page(category, name, [callback]);
// page(name, [properties], [options], [callback]);
// page(name, [properties], [callback]);
// page(name, [callback]);
// page(properties, [options], [callback]);
// page(properties, [callback]);
// page([callback]);

// ================

// track(event, properties, options, callback);
// track(event, properties, options);

// track(event, properties, callback);
// track(event, properties);

// track(event, callback);
// track(event);

// ---------------
// track(event, [properties], [options], [callback]);
// track(event, [properties], [callback]);
// track(event, [callback]);

// ==================================

// group(groupId, traits, options, callback);
// group(groupId, traits, options);
// group(groupId, traits);

// group(groupId, traits, callback);
// group(groupId, traits);

// group(groupId, callback);
// group(groupId);

// group(traits, options, callback);
// group(traits, options);

// group(traits, callback);
// group(traits);

// -------------
// group(groupId, [traits], [options], [callback]);
// group(groupId, [traits], [callback]);
// group(groupId, [callback]);

// group(traits, [options], [callback]);
// group(traits, [callback]);

// =======================

// alias(to, from, options, callback);
// alias(to, from, options);
// alias(to, from);

// alias(to, from, callback);
// alias(to, from);

// alias(to, options, callback);
// alias(to, options);

// alias(to, callback);
// alias(to);
// -----------------------
// alias(to, [from], [options], [callback]);
// alias(to, [from], [callback]);
// alias(to, [options], [callback]);
// alias(to, [callback]);

export type AnalyticsIdentifyMethod = {
  (
    userId: string,
    traits?: Nullable<IdentifyTraits>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (userId: string, traits?: Nullable<IdentifyTraits>, callback?: ApiCallback): void;
  (userId: string, callback?: ApiCallback): void;
  (traits: Nullable<IdentifyTraits>, options?: Nullable<ApiOptions>, callback?: ApiCallback): void;
  (traits: Nullable<IdentifyTraits>, callback?: ApiCallback): void;
};

export type AnalyticsPageMethod = {
  (
    category: string,
    name: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (category: string, name: string, properties?: Nullable<ApiObject>, callback?: ApiCallback): void;
  (category: string, name: string, callback?: ApiCallback): void;
  (
    name: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (name: string, properties?: Nullable<ApiObject>, callback?: ApiCallback): void;
  (name: string, callback?: ApiCallback): void;
  (properties: Nullable<ApiObject>, options?: Nullable<ApiOptions>, callback?: ApiCallback): void;
  (properties: Nullable<ApiObject>, callback?: ApiCallback): void;
  (callback?: ApiCallback): void;
};

export type AnalyticsTrackMethod = {
  (
    event: string,
    properties?: Nullable<ApiObject>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (event: string, properties?: Nullable<ApiObject>, callback?: ApiCallback): void;
  (event: string, callback?: ApiCallback): void;
};

export type AnalyticsGroupMethod = {
  (
    groupId: string,
    traits?: Nullable<IdentifyTraits>,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (groupId: string, traits?: Nullable<IdentifyTraits>, callback?: ApiCallback): void;
  (groupId: string, callback?: ApiCallback): void;
  (traits: Nullable<IdentifyTraits>, options?: Nullable<ApiOptions>, callback?: ApiCallback): void;
  (traits: Nullable<IdentifyTraits>, callback?: ApiCallback): void;
};

export type AnalyticsAliasMethod = {
  (
    to: Nullable<string>,
    from?: string,
    options?: Nullable<ApiOptions>,
    callback?: ApiCallback,
  ): void;
  (to: Nullable<string>, from?: string, callback?: ApiCallback): void;
  (to: Nullable<string>, options?: Nullable<ApiOptions>, callback?: ApiCallback): void;
  (to: Nullable<string>, callback?: ApiCallback): void;
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
   * To set authorization token
   * @param token token value
   */
  setAuthToken(token: string): void;

  /**
   * To fetch the current sessionId
   */
  getSessionId(): Nullable<number>;

  /**
   * To provide consent
   * @param options Consent API options
   */
  consent(options?: ConsentOptions): void;
}
