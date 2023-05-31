import { Nullable } from '@rudderstack/analytics-js/types';
import { PluginName } from '@rudderstack/analytics-js/components/pluginsManager/types';

export type CookieConsentOptions = {
  // OneTrust
  [key: string]: {
    enabled: boolean;
  };
};

export type AppInfo = {
  readonly name: string;
  readonly version: string;
  readonly namespace: string;
};

export type LibraryInfo = {
  readonly name: string;
  readonly version: string;
};

export type OSInfo = {
  readonly name: string;
  readonly version: string;
};

// TODO: should we take the types from IdentifyTrait instead of any string key?
//  https://www.rudderstack.com/docs/event-spec/standard-events/identify/#identify-traits
export type Traits = Record<string, any>;

export type Destination = {
  id: string;
  definitionName: string;
  areTransformationsConnected: boolean;
  config: DestinationConfig;
};

export type OneTrustCookieCategory = {
  oneTrustCookieCategory: string;
};

export type EventMapping = {
  from: string;
  to: string;
};

export type DestinationEvent = {
  eventName: string;
};

export type Conversion = {
  conversionLabel: string;
  name: string;
};

export type DestinationConfig = {
  blacklistedEvents: DestinationEvent[];
  whitelistedEvents: DestinationEvent[];
  oneTrustCookieCategories: OneTrustCookieCategory[];
  eventFilteringOption: 'disable' | 'whitelistedEvents' | 'blacklistedEvents';
  clickEventConversions?: Conversion[];
  pageLoadConversions?: Conversion[];
  conversionID?: string;
  conversionLinker?: boolean;
  disableAdPersonalization?: boolean;
  dynamicRemarketing?: boolean;
  sendPageView?: boolean;
  defaultPageConversion?: string;
  enableConversionEventsFiltering?: boolean;
  trackConversions?: boolean;
  trackDynamicRemarketing?: boolean;
  tagID?: string;
  advertiserId?: string;
  partnerId?: string;
  measurementId?: string;
  capturePageView?: string;
  useNativeSDKToSend?: boolean;
  connectionMode?: DestinationConnectionMode;
  extendPageViewParams?: boolean;
  eventMappingFromConfig?: EventMapping[];
  appKey?: string;
  dataCenter?: string;
  enableBrazeLogging?: boolean;
  enableNestedArrayOperations?: boolean;
  enableSubscriptionGroupInGroupCall?: boolean;
  supportDedup?: boolean;
  trackAnonymousUser?: boolean;
  serverUrl?: string;
  containerID?: string;
  fs_debug_mode?: boolean;
  fs_org?: boolean;
  siteID?: string;
  [key: string]: any;
};

export type ClientIntegration = {
  name: string;
  config: DestinationConfig;
  destinationInfo: {
    areTransformationsConnected: boolean;
    destinationId: string;
  };
};

export type IntegrationInstance = {
  isLoaded: () => boolean;
  isReady?: () => boolean;
};

// TODO: is this still used? const intMod = window[pluginName];
export type InitialisedIntegration = Record<string, any>;

export enum CookieSameSite {
  Strict = 'Strict',
  Lax = 'Lax',
  None = 'None',
}

export enum UaChTrackLevel {
  None = 'none',
  Default = 'default',
  Full = 'full',
}

/**
 * Represents the integration options object
 * Example usages:
 * integrationOptions { All: false, "Google Analytics": true, "Braze": true}
 * integrationOptions { All: true, "Chartbeat": false, "Customer.io": false}
 * integrationOptions { All: true, "GA4": { "clientId": "1234" }, "Google Analytics": false }
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
 * Represents the destinations queue options parameter in loadOptions type
 */
export type DestinationsQueueOpts = {
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
    | null
    | (string | number | boolean | ApiObject)[]
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
    | null
    | (string | number | boolean | null | ApiObject)[]
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
  configUrl: string; // defaults to https://api.rudderstack.com
  queueOptions?: QueueOpts;
  loadIntegration?: boolean; // defaults to true.
  sessions: SessionOpts;
  secureCookie?: boolean; // defaults to false.
  destSDKBaseURL: string; // defaults to https://cdn.rudderlabs.com/v3/latest/modern/js-integrations
  pluginsSDKBaseURL: string; // defaults to https://cdn.rudderlabs.com/v3/latest/modern/plugins
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
  getSourceConfig?: () => string | ApiObject | Promise<ApiObject> | Promise<string>;
  sendAdblockPage?: boolean;
  sendAdblockPageOptions?: ApiOptions;
  plugins?: Nullable<PluginName[]>;
  polyfillURL?: string;
  useGlobalIntegrationsConfigInEvents?: boolean;
};

export type ApiCallback = (data?: any) => void;
export type BufferedEvent = any[];

export enum LogLevel {
  Log = 'LOG',
  Info = 'INFO',
  Debug = 'DEBUG',
  Warn = 'WARN',
  Error = 'ERROR',
  None = 'NONE',
}

export enum LifecycleStatus {
  Mounted = 'mounted',
  BrowserCapabilitiesReady = 'browserCapabilitiesReady',
  Configured = 'configured',
  PluginsLoading = 'pluginsLoading',
  PluginsReady = 'pluginsReady',
  Initialized = 'initialized',
  Loaded = 'loaded',
  IntegrationsLoading = 'integrationsLoading',
  IntegrationsReady = 'integrationsReady',
  Ready = 'ready',
}

export enum DestinationConnectionMode {
  Hybrid = 'hybrid',
  Cloud = 'cloud',
  Device = 'device',
}

export type ReadyCallback = () => void;

export type ConsentManagement = {
  deniedConsentIds: string[];
};

export type SessionInfo = {
  autoTrack?: boolean;
  manualTrack?: boolean;
  timeout?: number;
  expiresAt?: number;
  id?: number;
  sessionStart?: boolean;
};

/**
 * Represents residency server input the options
 */
export enum ResidencyServerRegion {
  US = 'US',
  EU = 'EU',
}

export type RegionDetails = {
  url: string;
  default: boolean;
};

export type Source = {
  id: string;
  config?: SourceConfig;
  dataplanes?: Record<ResidencyServerRegion, RegionDetails[]>;
};

export type SourceConfig = {
  statsCollection?: StatsCollection;
};

export type StatsCollection = {
  errors: {
    enabled: boolean;
  };
  metrics: {
    enabled: boolean;
  };
};

export type UTMParameters = Record<string, string>;
