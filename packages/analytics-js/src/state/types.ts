import { Nullable } from '@rudderstack/analytics-js/types';
import { ScreenInfo } from '../components/capabilitiesManager/detection/screen';

export type CookieConsentOptions = {
  // OneTrust
  oneTrust?: {
    enabled: boolean;
  };
};

export type AppInfo = {
  name: string;
  version: string;
  namespace: string;
};

export type LibraryInfo = {
  name: string;
  version: string;
};

export type OSInfo = {
  name: string;
  version: string;
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

export type ClientIntegrations = {
  name: string;
  config: DestinationConfig;
};

export type IntegrationInstance = {
  isLoaded: () => boolean;
  isReady?: () => boolean;
};

// TODO: is this still used? only lotame used it for 1mg
// export type ClientSuppliedCallbacks = {
//   syncPixel?: () => void;
// };
//
// // TODO: is this still used? only lotame used it for 1mg
// export type MethodToCallbackMap = {
//   syncPixel: string;
// };

// TODO: is this still used? const intMod = window[pluginName];
export type DynamicallyLoadedIntegration = Record<string, any>;

export type CookieSameSite = 'Strict' | 'Lax' | 'None';

export type UaChTrackLevel = 'none' | 'default' | 'full';

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

export type ApiCallback = () => void;
export type BufferedEvent = any[];

export type LogLevel = 'ERROR' | 'DEBUG' | 'INFO' | 'WARN';

// TODO: make enum
export type LifecycleStatus =
  | 'mounted'
  | 'polyfillLoaded'
  | 'initialized'
  | 'configured'
  | 'pluginsReady'
  | 'loaded'
  | 'integrationsReady'
  | 'ready'
  | undefined;

export type ReadyCallback = () => void;

export type ConsentManagement = {
  deniedConsentIds: string[];
};

export type SessionInfo = {
  autoTrack?: boolean;
  manualTrack?: boolean;
  timeout: number;
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

export type RudderContext = {
  [index: string]:
    | string
    | number
    | boolean
    | ApiObject
    | UADataValues
    | Nullable<string>
    | (string | number | boolean | ApiObject)[]
    | undefined;
  traits?: ApiObject;
  sessionId?: number;
  sessionStart?: boolean;
  consentManagement?: ConsentManagement;
  'ua-ch'?: UADataValues;
  app: AppInfo;
  library: LibraryInfo;
  userAgent: Nullable<string>;
  os: OSInfo;
  locale: Nullable<string>;
  screen: ScreenInfo;
  campaign?: UTMParameters;
};

export type RudderEvent = {
  type: string;
  userId?: Nullable<string>;
  anonymousId: string;
  channel: string;
  context: RudderContext;
  originalTimestamp: string;
  sentAt?: string;
  integrations: IntegrationOpts;
  messageId: string;
  properties?: ApiObject; // track & page
  event: string; // track
  name?: string; // page
  category?: string; // page
  traits?: ApiObject; // group
  groupId?: Nullable<string>; // group
  previousId: string; // alias
};

export type UTMParameters = {
  [index: string]: string;
};
