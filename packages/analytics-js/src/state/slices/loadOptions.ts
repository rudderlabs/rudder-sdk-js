import { Signal, signal } from '@preact/signals-core';
import * as R from 'ramda';
import {
  DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL,
  DEFAULT_SESSION_TIMEOUT,
} from '@rudderstack/analytics-js/constants/timeouts';
import { DEFAULT_BEACON_QUEUE_MAX_SIZE } from '@rudderstack/analytics-js/constants/sizes';
import { LogLevel } from '@rudderstack/analytics-js/state/slices/lifecycle';
import { CookieConsentOptions } from '@rudderstack/analytics-js/state/slices/consents';
import { CookieSameSite } from '@rudderstack/analytics-js/services/StorageManager/types';
import { ResidencyServerRegion } from '@rudderstack/analytics-js/components/configManager/types';

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

export type SessionOpts = {
  autoTrack?: boolean; // Defaults to true
  timeout?: number; // Defaults to 30 mins
};

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
  onLoaded?: (analytics: any) => void;
  uaChTrackLevel?: UaChTrackLevel;
  residencyServer?: ResidencyServerRegion;
  getSourceConfig?: () => string | ApiObject | Promise<ApiObject> | Promise<string>;
  sendAdblockPage?: boolean;
  sendAdblockPageOptions?: ApiOptions;
  // clientSuppliedCallbacks?: { string: () => void }; // deprecate in new version
};

export type LoadOptionsState = Signal<LoadOptions>;

const defaultLoadOptions: LoadOptions = {
  logLevel: 'ERROR',
  configUrl: 'https://api.rudderlabs.com',
  loadIntegration: true,
  sessions: {
    autoTrack: true,
    timeout: DEFAULT_SESSION_TIMEOUT,
  },
  destSDKBaseURL: 'https://cdn.rudderlabs.com/v1.1/js-integrations',
  beaconQueueOptions: {
    maxItems: DEFAULT_BEACON_QUEUE_MAX_SIZE,
    flushQueueInterval: DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL,
  },
  sameSiteCookie: 'Lax',
  polyfillIfRequired: true,
};

const loadOptionsState: LoadOptionsState = signal(R.clone(defaultLoadOptions));

export { loadOptionsState };
