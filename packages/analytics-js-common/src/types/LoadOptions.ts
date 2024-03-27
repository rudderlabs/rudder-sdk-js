import type { LogLevel } from './Logger';
import type { ResidencyServerRegion } from './DataResidency';
import type { Nullable } from './Nullable';
import type { PluginName } from './PluginsManager';
import type { IntegrationOpts } from './Integration';
import type { ApiOptions } from './EventApi';
import type { ConsentManagementOptions } from './Consent';
import type { ApiObject } from './ApiObject';
import type { StorageOpts, CookieSameSite } from './Storage';

export type UaChTrackLevel = 'none' | 'default' | 'full';

/**
 * Represents the options parameter for anonymousId
 */
export type AnonymousIdOptions = {
  autoCapture?: {
    enabled?: boolean;
    source?: string;
  };
};

export type SessionOpts = {
  autoTrack?: boolean; // Defaults to true
  timeout?: number; // Defaults to 30 minutes
};

export type EventMapping = {
  from: string;
  to: string;
};

export type Conversion = {
  conversionLabel: string;
  name: string;
};

export type EventFilteringOption = 'disable' | 'whitelistedEvents' | 'blacklistedEvents';

/**
 * Represents the beacon queue options parameter in loadOptions type
 */
export type BeaconQueueOpts = {
  // Maximum number of events in storage
  maxItems?: number;
  // Time in milliseconds to flush the queue automatically
  flushQueueInterval?: number;
};

export type EventsTransportMode = 'xhr' | 'beacon';

export type BatchOpts = {
  // Whether to enable batching
  enabled: boolean;
  // Maximum number of events in a batch
  maxItems?: number;
  // Maximum size of a batch request in bytes
  maxSize?: number;
  // Time in milliseconds to flush the queue automatically
  flushInterval?: number;
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
  // Jitter to be applied to the delay
  backoffJitter?: number;
  // Maximum number of attempts
  maxAttempts?: number;
  // Maximum number of events/events batch in storage
  maxItems?: number;
  // Options for batched requests
  batch?: BatchOpts;
  // The scale factor applied to the default timer values
  timerScaleFactor?: number;
};

/**
 * Represents the destinations queue options parameter in loadOptions type
 */
export type DestinationsQueueOpts = {
  maxItems?: number;
};

export type OnLoadedCallback = (analytics: any) => void;

export type DeliveryType = 'immediate' | 'buffer';

export type StorageStrategy = 'none' | 'session' | 'anonymousId';

export type PreConsentStorageOptions = {
  strategy: StorageStrategy;
};

export type PreConsentEventsOptions = {
  delivery: DeliveryType;
};

export type PreConsentOptions = {
  enabled: boolean;
  storage?: PreConsentStorageOptions;
  events?: PreConsentEventsOptions;
};

/**
 * Represents the options parameter in the load API
 */
export type LoadOptions = {
  logLevel?: LogLevel; // defaults to ERROR
  integrations?: IntegrationOpts; // defaults to { All : true }
  configUrl?: string; // defaults to https://api.rudderstack.com
  queueOptions?: QueueOpts;
  loadIntegration?: boolean; // defaults to true.
  sessions?: SessionOpts;
  secureCookie?: boolean; // defaults to false.
  destSDKBaseURL?: string; // defaults to https://cdn.rudderlabs.com/latest/v3/modern/js-integrations
  pluginsSDKBaseURL?: string; // defaults to https://cdn.rudderlabs.com/latest/v3/modern/plugins
  useBeacon?: boolean; // defaults to false.
  beaconQueueOptions?: BeaconQueueOpts;
  destinationsQueueOptions?: DestinationsQueueOpts;
  anonymousIdOptions?: AnonymousIdOptions;
  setCookieDomain?: string; // defaults to current domain.
  sameSiteCookie?: CookieSameSite; // defaults to Lax.
  lockIntegrationsVersion?: boolean; // defaults to false.
  polyfillIfRequired?: boolean; // defaults to true. Controls whether the SDK should polyfill unsupported browser API's if they are detected as missing
  onLoaded?: OnLoadedCallback;
  uaChTrackLevel?: UaChTrackLevel;
  residencyServer?: ResidencyServerRegion;
  // TODO: define type for sourceConfig once the trimmed response is implemented
  getSourceConfig?: () => string | ApiObject | Promise<ApiObject> | Promise<string>;
  sendAdblockPage?: boolean;
  sendAdblockPageOptions?: ApiOptions;
  plugins?: Nullable<PluginName[]>;
  polyfillURL?: string;
  useGlobalIntegrationsConfigInEvents?: boolean;
  bufferDataPlaneEventsUntilReady?: boolean;
  dataPlaneEventsBufferTimeout?: number;
  storage?: StorageOpts;
  preConsent?: PreConsentOptions;
  // transport mechanism to be used for sending batched requests
  transportMode?: EventsTransportMode; // Unused for now. This will deprecate the useBeacon and beaconQueueOptions
  consentManagement?: ConsentManagementOptions;
  sameDomainCookiesOnly?: boolean;
  externalAnonymousIdCookieName?: string;
  useServerSideCookies?: boolean;
  cookieServerUrl?: string;
};

export type ConsentOptions = {
  storage?: StorageOpts;
  consentManagement?: ConsentManagementOptions;
  integrations?: IntegrationOpts;
  discardPreConsentEvents?: boolean;
  sendPageEvent?: boolean;
  trackConsent?: boolean;
};
