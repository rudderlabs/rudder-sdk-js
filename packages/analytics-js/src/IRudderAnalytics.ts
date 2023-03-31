import { HttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { Logger } from '@rudderstack/analytics-js/services/Logger';
import { ErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { PluginsManager } from '@rudderstack/analytics-js/components/pluginsManager';
import { ExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader';
import { Store, StoreManager } from '@rudderstack/analytics-js/services/StoreManager';
import {
  CookieConsentOptions,
  CookieSameSite,
  LifecycleStatus,
  LogLevel,
  ResidencyServerRegion,
} from '@rudderstack/analytics-js/state/types';

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
  load: (writeKey: string, dataPlaneUrl: string, loadOptions?: LoadOptions) => void;

  /**
   * Orchestrate the lifecycle of the application phases/status
   */
  startLifecycle(): void;

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
}

/**
 * Represents the options parameter in the load API
 */
export type LoadOptions = {
  logLevel?: LogLevel; // defaults to ERROR
  integrations?: IntegrationOpts; // defaults to { All : true }
  configUrl: string; // defaults to https://api.rudderlabs.com
  queueOptions?: QueueOpts;
  loadIntegration?: boolean; // defaults to true.
  sessions: SessionOpts;
  secureCookie?: boolean; // defaults to false.
  destSDKBaseURL: string; // defaults to https://cdn.rudderlabs.com/v1.1/js-integrations
  useBeacon?: boolean; // defaults to false.
  beaconQueueOptions?: BeaconQueueOpts;
  cookieConsentManager?: CookieConsentOptions;
  anonymousIdOptions?: AnonymousIdOptions;
  setCookieDomain?: string; // defaults to current domain.
  sameSiteCookie: CookieSameSite; // defaults to Lax.
  lockIntegrationsVersion?: boolean; // defaults to false.
  polyfillIfRequired: boolean; // defaults to true. Controls whether the SDK should polyfill unsupported browser API's if they are detected as missing
  onLoaded?: (analytics: IAnalytics) => void;
  uaChTrackLevel?: UaChTrackLevel;
  residencyServer?: ResidencyServerRegion;
  getSourceConfig?: () => string | ApiObject | Promise<ApiObject> | Promise<string>;
  sendAdblockPage?: boolean;
  sendAdblockPageOptions?: ApiOptions;
  // clientSuppliedCallbacks?: { string: () => void }; // deprecate in new version
};

export type SessionOpts = {
  autoTrack?: boolean; // Defaults to true
  timeout?: number; // Defaults to 30 mins
};

export type UaChTrackLevel = 'none' | 'default' | 'full';

/**
 * Represents the integration options object
 * Example usages:
 * integrationOptions { All: false, "Google Analytics": true, "Braze": true}
 * integrationOptions { All: true, "Chartbeat": false, "Customer.io": false}
 */
export type IntegrationOpts = {
  // Defaults to true
  // If set to false, specific integration should be set to true to send the event
  All?: boolean;
  // Destination name: true/false/integration specific information
  [index: string]: boolean | undefined | ApiObject;
};

/**
 * Represents the queue options parameter in loadOptions type
 */
export type QueueOpts = {
  // Upper cap on maximum delay for an event
  maxRetryDelay?: number;
  // Minimum delay before sending an event
  minRetryDelay?: number;
  // Exponential base
  backoffFactor?: number;
  // Maximum number of attempts
  maxAttempts?: number;
  // Maximum number of events in storage
  maxItems?: number;
};

/**
 * Represents the beacon queue options parameter in loadOptions type
 */
export type BeaconQueueOpts = {
  // Maximum number of events in storage
  maxItems?: number;
  // Time in milliseconds to flush the queue automatically
  flushQueueInterval?: number;
};

/**
 * Represents the options parameter for anonymousId
 */
export type AnonymousIdOptions = {
  autoCapture?: {
    enabled?: boolean;
    source?: string;
  };
};

/**
 * Represents the options parameter in the APIs
 */
export type ApiOptions = {
  integrations?: IntegrationOpts;
  anonymousId?: string;
  // ISO 8601 date string
  originalTimestamp?: string;
  // Merged with event's contextual information
  [index: string]:
    | string
    | number
    | boolean
    | ApiObject
    | (string | number | boolean | ApiObject)[]
    | IntegrationOpts
    | undefined;
};

/**
 * Represents a generic object in the APIs
 * Use for parameters like properties, traits etc.
 */
export type ApiObject = {
  [index: string]:
    | string
    | number
    | boolean
    | ApiObject
    | (string | number | boolean | ApiObject)[]
    | undefined;
};

export type ApiCallback = () => void;
