import { LogLevel } from '@rudderstack/common/types/Logger';
import { ResidencyServerRegion } from '@rudderstack/common/types/DataResidency';
import { Nullable } from '@rudderstack/common/types/Nullable';
import { PluginName } from '@rudderstack/common/types/PluginsManager';
import { IntegrationOpts } from '@rudderstack/common/types/Integration';
import { ApiOptions } from '@rudderstack/common/types/EventApi';
import { CookieConsentOptions } from '@rudderstack/common/types/Consent';
import { ApiObject } from '@rudderstack/common/types/ApiObject';

export enum UaChTrackLevel {
  None = 'none',
  Default = 'default',
  Full = 'full',
}

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
  timeout?: number; // Defaults to 30 mins
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

export enum CookieSameSite {
  Strict = 'Strict',
  Lax = 'Lax',
  None = 'None',
}

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
 * Represents the destinations queue options parameter in loadOptions type
 */
export type DestinationsQueueOpts = {
  maxItems?: number;
};

/**
 * Represents the options parameter in the load API
 */
export type LoadOptions = {
  logLevel?: LogLevel; // defaults to ERROR
  integrations?: IntegrationOpts; // defaults to { All : true }
  configUrl: string; // defaults to https://api.rudderstack.com
  queueOptions?: QueueOpts;
  loadIntegration?: boolean; // defaults to true.
  sessions: SessionOpts;
  secureCookie?: boolean; // defaults to false.
  destSDKBaseURL?: string; // defaults to https://cdn.rudderlabs.com/v3/latest/modern/js-integrations
  pluginsSDKBaseURL?: string; // defaults to https://cdn.rudderlabs.com/v3/latest/modern/plugins
  useBeacon?: boolean; // defaults to false.
  beaconQueueOptions?: BeaconQueueOpts;
  destinationsQueueOptions?: DestinationsQueueOpts;
  cookieConsentManager?: CookieConsentOptions;
  anonymousIdOptions?: AnonymousIdOptions;
  setCookieDomain?: string; // defaults to current domain.
  sameSiteCookie: CookieSameSite; // defaults to Lax.
  lockIntegrationsVersion?: boolean; // defaults to false.
  polyfillIfRequired: boolean; // defaults to true. Controls whether the SDK should polyfill unsupported browser API's if they are detected as missing
  onLoaded?: (analytics: any) => void;
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
};
