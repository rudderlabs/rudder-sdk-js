import type { Conversion, EventFilteringOption, EventMapping } from './LoadOptions';
import type {
  OneTrustCookieCategory,
  KetchConsentPurpose,
  IubendaConsentPurpose,
  ConsentManagementProvider,
} from './Consent';
import type { IntegrationOpts } from './Integration';

export type DestinationConnectionMode = 'hybrid' | 'cloud' | 'device';

export type DestinationEvent = {
  eventName: string;
};

export type DeviceModeDestination = {
  name: string; // this is same as the definition name
  destinationId: string;
  shouldApplyDeviceModeTransformation: boolean;
  propagateEventsUntransformedOnError: boolean;
  analytics: any;
  [index: string]: any;
  isLoaded: () => boolean;
  isReady?: () => boolean;
  getDataForIntegrationsObject?: () => IntegrationOpts;
};

export type ConsentsConfig = {
  consent: string;
};

export type ConsentManagementProviderConfig = {
  provider: ConsentManagementProvider;
  consents: ConsentsConfig[];
  resolutionStrategy: string | undefined;
};

export type DestinationConfig = {
  blacklistedEvents: DestinationEvent[];
  whitelistedEvents: DestinationEvent[];
  iubendaConsentPurposes?: IubendaConsentPurpose[];
  oneTrustCookieCategories?: OneTrustCookieCategory[];
  ketchConsentPurposes?: KetchConsentPurpose[];
  consentManagement?: ConsentManagementProviderConfig[];
  eventFilteringOption: EventFilteringOption;
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

export type Destination = {
  id: string;
  displayName: string;
  userFriendlyId: string;
  shouldApplyDeviceModeTransformation: boolean;
  propagateEventsUntransformedOnError: boolean;
  config: DestinationConfig;
  instance?: DeviceModeDestination;
};
