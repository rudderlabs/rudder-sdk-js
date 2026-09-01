import type { Conversion, EventFilteringOption, EventMapping } from './LoadOptions';
import type {
  OneTrustCookieCategory,
  KetchConsentPurpose,
  IubendaConsentPurpose,
  ConsentManagementProvider,
} from './Consent';
import type { RSAEvent } from './Event';
import type { IntegrationRSAnalytics } from './IRudderAnalytics';
import type { IntegrationOpts } from './Integration';

export type DestinationConnectionMode = 'hybrid' | 'cloud' | 'device';

export type DestinationEvent = {
  eventName: string;
};

export type DeviceModeIntegration = {
  name?: string;
  destinationId?: string;
  analytics?: IntegrationRSAnalytics;
  config?: DestinationConfig;

  /**
   * Get the data for the integrations object to be included in the events
   * Some integrations contribute data to the integrations object after they are loaded.
   * An example of this is the GA4 integration.
   * @returns IntegrationOpts
   * @optional
   */
  getDataForIntegrationsObject?: () => IntegrationOpts;

  /**
   * Initialize the integration
   * @optional
   */
  init?: () => void;

  /**
   * Check if the integration is ready to process events
   * @returns boolean indicating whether the integration is ready
   * @required
   */
  isReady: () => boolean;

  /**
   * Process track events
   * @param event - The track event payload to process
   * @optional
   */
  track?: (event: RSAEvent) => void;

  /**
   * Process page events
   * @param event - The page event payload to process
   * @optional
   */
  page?: (event: RSAEvent) => void;

  /**
   * Process identify events
   * @param event - The identify event payload to process
   * @optional
   */
  identify?: (event: RSAEvent) => void;

  /**
   * Process group events
   * @param event - The group event payload to process
   * @optional
   */
  group?: (event: RSAEvent) => void;

  /**
   * Process alias events
   * @param event - The alias event payload to process
   * @optional
   */
  alias?: (event: RSAEvent) => void;
};

export type DeviceModeIntegrationEventAPIs = Pick<
  DeviceModeIntegration,
  'track' | 'identify' | 'page' | 'alias' | 'group'
>;

export type ConsentsConfig = {
  consent: string;
};

export type ConsentManagementProviderConfig = {
  provider: ConsentManagementProvider;
  consents: ConsentsConfig[];
  resolutionStrategy: string | undefined;
};

/**
 * The common configuration properties for all device
 * and hybrid mode supported destinations.
 */
export type BaseDestinationConfig = {
  blacklistedEvents: DestinationEvent[];
  whitelistedEvents: DestinationEvent[];
  eventFilteringOption: EventFilteringOption;
  consentManagement: ConsentManagementProviderConfig[];
  connectionMode: DestinationConnectionMode;
};

export type DestinationConfig = BaseDestinationConfig & {
  iubendaConsentPurposes?: IubendaConsentPurpose[];
  oneTrustCookieCategories?: OneTrustCookieCategory[];
  ketchConsentPurposes?: KetchConsentPurpose[];
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

export type Destination = {
  id: string;
  originalId?: string;
  displayName: string;
  userFriendlyId: string;
  shouldApplyDeviceModeTransformation: boolean;
  propagateEventsUntransformedOnError: boolean;
  config: DestinationConfig;
  integration?: DeviceModeIntegration;
  overridden?: boolean;
  enabled: boolean;
  cloned?: boolean;
  isCustomIntegration?: boolean;
};
