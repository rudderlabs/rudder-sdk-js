import type { Nullable } from './Nullable';
import type { ApiCallback, ApiOptions, ResetOptions } from './EventApi';
import type { AnonymousIdOptions, LoadOptions } from './LoadOptions';
import type { ApiObject } from './ApiObject';
import type { ILogger, LogLevel, RSALogger } from './Logger';
import type { IdentifyTraits } from './traits';
import type { ConsentOptions } from './Consent';
import type { IntegrationOpts } from './Integration';
import type { RSAEvent } from './Event';
import type { BaseDestinationConfig } from './Destination';

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
  (to: string, from?: string, options?: Nullable<ApiOptions>, callback?: ApiCallback): void;
  (to: string, from?: string, callback?: ApiCallback): void;
  (to: string, options?: Nullable<ApiOptions>, callback?: ApiCallback): void;
  (to: string, callback?: ApiCallback): void;
};

export type AnalyticsResetMethod = {
  (options?: ResetOptions): void;
  (resetAnonymousId?: boolean): void;
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
  getAnalyticsInstance(writeKey?: string): T | undefined;

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
   * Clear user session information
   *
   * @param options options for reset
   */
  reset: AnalyticsResetMethod;

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
  getSessionId(): Nullable<number> | undefined;

  /**
   * To provide consent
   * @param options Consent API options
   */
  consent(options?: ConsentOptions): void;

  /**
   * To add a custom integration for a custom destination
   * @param destinationId The ID of the custom destination from the RudderStack dashboard
   * @param integration The custom integration object
   */
  addCustomIntegration(destinationId: string, integration: RSACustomIntegration): void;
}

export type RSAnalytics = Pick<
  IRudderAnalytics,
  | 'track'
  | 'page'
  | 'identify'
  | 'group'
  | 'alias'
  | 'getAnonymousId'
  | 'getUserId'
  | 'getUserTraits'
  | 'getGroupId'
  | 'getGroupTraits'
  | 'getSessionId'
>;

/**
 * Type for the custom destination configuration object
 * For now, it is the same as the base destination config
 * but in the future, it can be extended to include more properties
 */
export type CustomDestinationConfig = BaseDestinationConfig & {};

/**
 * Type for the custom integration to be used in addCustomIntegration API
 * Defines the contract that all custom integrations must implement
 */
export type RSACustomIntegration = {
  /**
   * Initialize the integration
   * @param destinationConfig - The custom destination configuration object
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @optional
   */
  init?: (
    destinationConfig: CustomDestinationConfig,
    analytics: RSAnalytics,
    logger: RSALogger,
  ) => void;

  /**
   * Check if the integration is ready to process events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @returns boolean indicating whether the integration is ready
   * @required
   */
  isReady: (analytics: RSAnalytics, logger: RSALogger) => boolean;

  /**
   * Process track events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The track event payload to process
   * @optional
   */
  track?: (analytics: RSAnalytics, logger: RSALogger, event: RSAEvent) => void;

  /**
   * Process page events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The page event payload to process
   * @optional
   */
  page?: (analytics: RSAnalytics, logger: RSALogger, event: RSAEvent) => void;

  /**
   * Process identify events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The identify event payload to process
   * @optional
   */
  identify?: (analytics: RSAnalytics, logger: RSALogger, event: RSAEvent) => void;

  /**
   * Process group events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The group event payload to process
   * @optional
   */
  group?: (analytics: RSAnalytics, logger: RSALogger, event: RSAEvent) => void;

  /**
   * Process alias events
   * @param analytics - The RudderStack analytics instance
   * @param logger - The logger instance for this integration
   * @param event - The alias event payload to process
   * @optional
   */
  alias?: (analytics: RSAnalytics, logger: RSALogger, event: RSAEvent) => void;
};

export type IntegrationRSAnalytics = RSAnalytics & {
  loadIntegration: boolean;
  logLevel: LogLevel;
  loadOnlyIntegrations: IntegrationOpts;
};
