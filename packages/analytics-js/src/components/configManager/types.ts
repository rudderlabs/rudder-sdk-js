import { Nullable } from '@rudderstack/analytics-js/types';

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

export type DestinationEvent = {
  eventName: string;
};

export type Conversion = {
  conversionLabel: string;
  name: string;
};

export type OneTrustCookieCategory = {
  oneTrustCookieCategory: string;
};

export type EventMapping = {
  from: string;
  to: string;
};

export type DestinationDefinition = {
  name: string;
  displayName: string;
  updatedAt: string;
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

export type ConfigResponseDestinationItem = {
  areTransformationsConnected: boolean;
  config: DestinationConfig;
  updatedAt: string;
  deleted: boolean;
  destinationDefinition: DestinationDefinition;
  enabled: boolean;
  id: string;
  name: string;
  workspaceId: string;
  destinationDefinitionId: string;
};

export type Connection = {
  createdAt: string;
  deleted: boolean;
  destinationId: string;
  enabled: boolean;
  id: string;
  sourceId: string;
  updatedAt: string;
};

export type StatsCollection = {
  errorReports: {
    enabled: boolean;
  };
  metrics: {
    enabled: boolean;
  };
};

export type SourceDefinition = {
  category: Nullable<any>;
  config: Nullable<any>;
  configSchema: Nullable<any>;
  createdAt: string;
  displayName: string;
  id: string;
  name: string;
  options: Nullable<any>;
  uiConfig: Nullable<any>;
  updatedAt: string;
};

export type SourceConfigResponse = {
  isHosted: boolean;
  source: {
    destinations: ConfigResponseDestinationItem[];
    sourceDefinitionId: string;
    transient: boolean;
    updatedAt: string;
    workspaceId: string;
    writeKey: string;
    enabled: boolean;
    id: string;
    liveEventsConfig: {
      eventUpload: boolean;
      eventUploadTS: number;
    };
    name: string;
    secretVersion: Nullable<string>;
    sourceDefinition: SourceDefinition;
    config: {
      statsCollection: StatsCollection;
    };
    connections: Connection[];
    createdAt: string;
    createdBy: string;
    deleted: boolean;
    dataplanes?: Record<ResidencyServerRegion, RegionDetails>;
  };
};
