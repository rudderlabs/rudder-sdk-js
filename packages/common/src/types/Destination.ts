import {
  Conversion,
  EventFilteringOption,
  EventMapping,
} from '@rudderstack/common/types/LoadOptions';
import { OneTrustCookieCategory } from '@rudderstack/common/types/Consent';

export enum DestinationConnectionMode {
  Hybrid = 'hybrid',
  Cloud = 'cloud',
  Device = 'device',
}

export type DestinationEvent = {
  eventName: string;
};

export type DeviceModeDestination = {
  name: string; // this is same as the definition name
  destinationId: string;
  enableTransformationForDeviceMode: boolean;
  propagateEventsUntransformedOnError: boolean;
  analytics: any;
  [index: string]: any;
  isLoaded: () => boolean;
  isReady?: () => boolean;
};

export type DestinationConfig = {
  blacklistedEvents: DestinationEvent[];
  whitelistedEvents: DestinationEvent[];
  oneTrustCookieCategories: OneTrustCookieCategory[];
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
  enableTransformationForDeviceMode: boolean;
  propagateEventsUntransformedOnError: boolean;
  config: DestinationConfig;
  instance?: DeviceModeDestination;
};
