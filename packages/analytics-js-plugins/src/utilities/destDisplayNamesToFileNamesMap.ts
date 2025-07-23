// map of the destination display names to the destination directory names

// Import display names and directory names from analytics-js-integrations
import {
  DISPLAY_NAME as HubSpotDisplayName,
  DIR_NAME as HubSpotDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/HubSpot/constants';
import {
  DISPLAY_NAME as GADisplayName,
  DIR_NAME as GADirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/GA/constants';
import {
  DISPLAY_NAME as HotjarDisplayName,
  DIR_NAME as HotjarDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Hotjar/constants';
import {
  DISPLAY_NAME as GoogleAdsDisplayName,
  DIR_NAME as GoogleAdsDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/GoogleAds/constants';
import {
  DISPLAY_NAME as VWODisplayName,
  DIR_NAME as VWODirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/VWO/constants';
import {
  DISPLAY_NAME as GoogleTagManagerDisplayName,
  DIR_NAME as GoogleTagManagerDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/GoogleTagManager/constants';
import {
  DISPLAY_NAME as BrazeDisplayName,
  DIR_NAME as BrazeDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Braze/constants';
import {
  DISPLAY_NAME as IntercomDisplayName,
  DIR_NAME as IntercomDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/INTERCOM/constants';
import {
  DISPLAY_NAME as KeenDisplayName,
  DIR_NAME as KeenDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Keen/constants';
import {
  DISPLAY_NAME as KissmetricsDisplayName,
  DIR_NAME as KissmetricsDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Kissmetrics/constants';
import {
  DISPLAY_NAME as CustomerIODisplayName,
  DIR_NAME as CustomerIODirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/CustomerIO/constants';
import {
  DISPLAY_NAME as ChartbeatDisplayName,
  DIR_NAME as ChartbeatDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Chartbeat/constants';
import {
  DISPLAY_NAME as FacebookPixelDisplayName,
  DIR_NAME as FacebookPixelDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/FacebookPixel/constants';
import {
  DISPLAY_NAME as LotameDisplayName,
  DIR_NAME as LotameDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Lotame/constants';
import {
  DISPLAY_NAME as OptimizelyDisplayName,
  DIR_NAME as OptimizelyDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Optimizely/constants';
import {
  DISPLAY_NAME as BugsnagDisplayName,
  DIR_NAME as BugsnagDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Bugsnag/constants';
import {
  DISPLAY_NAME as FullstoryDisplayName,
  DIR_NAME as FullstoryDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Fullstory/constants';
import {
  DISPLAY_NAME as TVSquaredDisplayName,
  DIR_NAME as TVSquaredDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/TVSquared/constants';
import {
  DISPLAY_NAME as GA4DisplayName,
  DIR_NAME as GA4DirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/GA4/constants';
import {
  DISPLAY_NAME as GA4_V2DisplayName,
  DIR_NAME as GA4_V2DirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/GA4_V2/constants';
import {
  DISPLAY_NAME as MoEngageDisplayName,
  DIR_NAME as MoEngageDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/MoEngage/constants';
import {
  DISPLAY_NAME as AmplitudeDisplayName,
  DIR_NAME as AmplitudeDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Amplitude/constants';
import {
  DISPLAY_NAME as PendoDisplayName,
  DIR_NAME as PendoDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Pendo/constants';
import {
  DISPLAY_NAME as LyticsDisplayName,
  DIR_NAME as LyticsDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Lytics/constants';
import {
  DISPLAY_NAME as AppcuesDisplayName,
  DIR_NAME as AppcuesDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Appcues/constants';
import {
  DISPLAY_NAME as PostHogDisplayName,
  DIR_NAME as PostHogDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Posthog/constants';
import {
  DISPLAY_NAME as KlaviyoDisplayName,
  DIR_NAME as KlaviyoDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Klaviyo/constants';
import {
  DISPLAY_NAME as CleverTapDisplayName,
  DIR_NAME as CleverTapDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Clevertap/constants';
import {
  DISPLAY_NAME as BingAdsDisplayName,
  DIR_NAME as BingAdsDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/BingAds/constants';
import {
  DISPLAY_NAME as PinterestTagDisplayName,
  DIR_NAME as PinterestTagDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/PinterestTag/constants';
import {
  DISPLAY_NAME as AdobeAnalyticsDisplayName,
  DIR_NAME as AdobeAnalyticsDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/AdobeAnalytics/constants';
import {
  DISPLAY_NAME as LinkedInInsightTagDisplayName,
  DIR_NAME as LinkedInInsightTagDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/LinkedInInsightTag/constants';
import {
  DISPLAY_NAME as RedditPixelDisplayName,
  DIR_NAME as RedditPixelDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/RedditPixel/constants';
import {
  DISPLAY_NAME as DripDisplayName,
  DIR_NAME as DripDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Drip/constants';
import {
  DISPLAY_NAME as HeapDisplayName,
  DIR_NAME as HeapDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Heap/constants';
import {
  DISPLAY_NAME as CriteoDisplayName,
  DIR_NAME as CriteoDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Criteo/constants';
import {
  DISPLAY_NAME as MixpanelDisplayName,
  DIR_NAME as MixpanelDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Mixpanel/constants';
import {
  DISPLAY_NAME as QualtricsDisplayName,
  DIR_NAME as QualtricsDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Qualtrics/constants';
import {
  DISPLAY_NAME as ProfitWellDisplayName,
  DIR_NAME as ProfitWellDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/ProfitWell/constants';
import {
  DISPLAY_NAME as SentryDisplayName,
  DIR_NAME as SentryDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Sentry/constants';
import {
  DISPLAY_NAME as QuantumMetricDisplayName,
  DIR_NAME as QuantumMetricDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/QuantumMetric/constants';
import {
  DISPLAY_NAME as SnapPixelDisplayName,
  DIR_NAME as SnapPixelDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/SnapPixel/constants';
import {
  DISPLAY_NAME as PostAffiliateProDisplayName,
  DIR_NAME as PostAffiliateProDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/PostAffiliatePro/constants';
import {
  DISPLAY_NAME as GoogleOptimizeDisplayName,
  DIR_NAME as GoogleOptimizeDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/GoogleOptimize/constants';
import {
  DISPLAY_NAME as LaunchDarklyDisplayName,
  DIR_NAME as LaunchDarklyDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/LaunchDarkly/constants';
import {
  DISPLAY_NAME as GA360DisplayName,
  DIR_NAME as GA360DirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/GA360/constants';
import {
  DISPLAY_NAME as AdrollDisplayName,
  DIR_NAME as AdrollDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Adroll/constants';
import {
  DISPLAY_NAME as DCMFloodlightDisplayName,
  DIR_NAME as DCMFloodlightDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/DCMFloodlight/constants';
import {
  DISPLAY_NAME as MatomoDisplayName,
  DIR_NAME as MatomoDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Matomo/constants';
import {
  DISPLAY_NAME as VeroDisplayName,
  DIR_NAME as VeroDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Vero/constants';
import {
  DISPLAY_NAME as MouseflowDisplayName,
  DIR_NAME as MouseflowDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Mouseflow/constants';
import {
  DISPLAY_NAME as RockerboxDisplayName,
  DIR_NAME as RockerboxDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Rockerbox/constants';
import {
  DISPLAY_NAME as ConvertFlowDisplayName,
  DIR_NAME as ConvertFlowDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/ConvertFlow/constants';
import {
  DISPLAY_NAME as SnapEngageDisplayName,
  DIR_NAME as SnapEngageDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/SnapEngage/constants';
import {
  DISPLAY_NAME as LiveChatDisplayName,
  DIR_NAME as LiveChatDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/LiveChat/constants';
import {
  DISPLAY_NAME as ShynetDisplayName,
  DIR_NAME as ShynetDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Shynet/constants';
import {
  DISPLAY_NAME as WoopraDisplayName,
  DIR_NAME as WoopraDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Woopra/constants';
import {
  DISPLAY_NAME as RollBarDisplayName,
  DIR_NAME as RollBarDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/RollBar/constants';
import {
  DISPLAY_NAME as QuoraPixelDisplayName,
  DIR_NAME as QuoraPixelDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/QuoraPixel/constants';
import {
  DISPLAY_NAME as JuneDisplayName,
  DIR_NAME as JuneDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/June/constants';
import {
  DISPLAY_NAME as EngageDisplayName,
  DIR_NAME as EngageDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Engage/constants';
import {
  DISPLAY_NAME as IterableDisplayName,
  DIR_NAME as IterableDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Iterable/constants';
import {
  DISPLAY_NAME as YandexMetricaDisplayName,
  DIR_NAME as YandexMetricaDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/YandexMetrica/constants';
import {
  DISPLAY_NAME as RefinerDisplayName,
  DIR_NAME as RefinerDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Refiner/constants';
import {
  DISPLAY_NAME as QualarooDisplayName,
  DIR_NAME as QualarooDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Qualaroo/constants';
import {
  DISPLAY_NAME as PodsightsDisplayName,
  DIR_NAME as PodsightsDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Podsights/constants';
import {
  DISPLAY_NAME as AxeptioDisplayName,
  DIR_NAME as AxeptioDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Axeptio/constants';
import {
  DISPLAY_NAME as SatismeterDisplayName,
  DIR_NAME as SatismeterDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Satismeter/constants';
import {
  DISPLAY_NAME as MicrosoftClarityDisplayName,
  DIR_NAME as MicrosoftClarityDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/MicrosoftClarity/constants';
import {
  DISPLAY_NAME as SendinblueDisplayName,
  DIR_NAME as SendinblueDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Sendinblue/constants';
import {
  DISPLAY_NAME as OlarkDisplayName,
  DIR_NAME as OlarkDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Olark/constants';
import {
  DISPLAY_NAME as LemniskDisplayName,
  DIR_NAME as LemniskDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Lemnisk/constants';
import {
  DISPLAY_NAME as TiktokAdsDisplayName,
  DIR_NAME as TiktokAdsDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/TiktokAds/constants';
import {
  DISPLAY_NAME as ActiveCampaignDisplayName,
  DIR_NAME as ActiveCampaignDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/ActiveCampaign/constants';
import {
  DISPLAY_NAME as SprigDisplayName,
  DIR_NAME as SprigDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Sprig/constants';
import {
  DISPLAY_NAME as SpotifyPixelDisplayName,
  DIR_NAME as SpotifyPixelDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/SpotifyPixel/constants';
import {
  DISPLAY_NAME as CommandBarDisplayName,
  DIR_NAME as CommandBarDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/CommandBar/constants';
import {
  DISPLAY_NAME as NinetailedDisplayName,
  DIR_NAME as NinetailedDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Ninetailed/constants';
import {
  DISPLAY_NAME as Gainsight_PXDisplayName,
  DIR_NAME as Gainsight_PXDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Gainsight_PX/constants';
import {
  DISPLAY_NAME as XPixelDisplayName,
  DIR_NAME as XPixelDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/XPixel/constants';
import {
  DISPLAY_NAME as UserpilotDisplayName,
  DIR_NAME as UserpilotDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Userpilot/constants';
import {
  DISPLAY_NAME as ComscoreDisplayName,
  DIR_NAME as ComscoreDirectoryName,
} from '@rudderstack/analytics-js-integrations/integrations/Comscore/constants';

// The destination directory name is used as the destination SDK file name in CDN
const destDisplayNamesToFileNamesMap: Record<string, string> = {
  [HubSpotDisplayName]: HubSpotDirectoryName,
  [GADisplayName]: GADirectoryName,
  [HotjarDisplayName]: HotjarDirectoryName,
  [GoogleAdsDisplayName]: GoogleAdsDirectoryName,
  [VWODisplayName]: VWODirectoryName,
  [GoogleTagManagerDisplayName]: GoogleTagManagerDirectoryName,
  [BrazeDisplayName]: BrazeDirectoryName,
  [IntercomDisplayName]: IntercomDirectoryName,
  [KeenDisplayName]: KeenDirectoryName,
  [KissmetricsDisplayName]: KissmetricsDirectoryName,
  [CustomerIODisplayName]: CustomerIODirectoryName,
  [ChartbeatDisplayName]: ChartbeatDirectoryName,
  [FacebookPixelDisplayName]: FacebookPixelDirectoryName,
  [LotameDisplayName]: LotameDirectoryName,
  [OptimizelyDisplayName]: OptimizelyDirectoryName,
  [BugsnagDisplayName]: BugsnagDirectoryName,
  [FullstoryDisplayName]: FullstoryDirectoryName,
  [TVSquaredDisplayName]: TVSquaredDirectoryName,
  [GA4DisplayName]: GA4DirectoryName,
  [GA4_V2DisplayName]: GA4_V2DirectoryName,
  [MoEngageDisplayName]: MoEngageDirectoryName,
  [AmplitudeDisplayName]: AmplitudeDirectoryName,
  [PendoDisplayName]: PendoDirectoryName,
  [LyticsDisplayName]: LyticsDirectoryName,
  [AppcuesDisplayName]: AppcuesDirectoryName,
  [PostHogDisplayName]: PostHogDirectoryName,
  [KlaviyoDisplayName]: KlaviyoDirectoryName,
  [CleverTapDisplayName]: CleverTapDirectoryName,
  [BingAdsDisplayName]: BingAdsDirectoryName,
  [PinterestTagDisplayName]: PinterestTagDirectoryName,
  [AdobeAnalyticsDisplayName]: AdobeAnalyticsDirectoryName,
  [LinkedInInsightTagDisplayName]: LinkedInInsightTagDirectoryName,
  [RedditPixelDisplayName]: RedditPixelDirectoryName,
  [DripDisplayName]: DripDirectoryName,
  [HeapDisplayName]: HeapDirectoryName,
  [CriteoDisplayName]: CriteoDirectoryName,
  [MixpanelDisplayName]: MixpanelDirectoryName,
  [QualtricsDisplayName]: QualtricsDirectoryName,
  [ProfitWellDisplayName]: ProfitWellDirectoryName,
  [SentryDisplayName]: SentryDirectoryName,
  [QuantumMetricDisplayName]: QuantumMetricDirectoryName,
  [SnapPixelDisplayName]: SnapPixelDirectoryName,
  [PostAffiliateProDisplayName]: PostAffiliateProDirectoryName,
  [GoogleOptimizeDisplayName]: GoogleOptimizeDirectoryName,
  [LaunchDarklyDisplayName]: LaunchDarklyDirectoryName,
  [GA360DisplayName]: GA360DirectoryName,
  [AdrollDisplayName]: AdrollDirectoryName,
  [DCMFloodlightDisplayName]: DCMFloodlightDirectoryName,
  [MatomoDisplayName]: MatomoDirectoryName,
  [VeroDisplayName]: VeroDirectoryName,
  [MouseflowDisplayName]: MouseflowDirectoryName,
  [RockerboxDisplayName]: RockerboxDirectoryName,
  [ConvertFlowDisplayName]: ConvertFlowDirectoryName,
  [SnapEngageDisplayName]: SnapEngageDirectoryName,
  [LiveChatDisplayName]: LiveChatDirectoryName,
  [ShynetDisplayName]: ShynetDirectoryName,
  [WoopraDisplayName]: WoopraDirectoryName,
  [RollBarDisplayName]: RollBarDirectoryName,
  [QuoraPixelDisplayName]: QuoraPixelDirectoryName,
  [JuneDisplayName]: JuneDirectoryName,
  [EngageDisplayName]: EngageDirectoryName,
  [IterableDisplayName]: IterableDirectoryName,
  [YandexMetricaDisplayName]: YandexMetricaDirectoryName,
  [RefinerDisplayName]: RefinerDirectoryName,
  [QualarooDisplayName]: QualarooDirectoryName,
  [PodsightsDisplayName]: PodsightsDirectoryName,
  [AxeptioDisplayName]: AxeptioDirectoryName,
  [SatismeterDisplayName]: SatismeterDirectoryName,
  [MicrosoftClarityDisplayName]: MicrosoftClarityDirectoryName,
  [SendinblueDisplayName]: SendinblueDirectoryName,
  [OlarkDisplayName]: OlarkDirectoryName,
  [LemniskDisplayName]: LemniskDirectoryName,
  [TiktokAdsDisplayName]: TiktokAdsDirectoryName,
  [ActiveCampaignDisplayName]: ActiveCampaignDirectoryName,
  [SprigDisplayName]: SprigDirectoryName,
  [SpotifyPixelDisplayName]: SpotifyPixelDirectoryName,
  [CommandBarDisplayName]: CommandBarDirectoryName,
  [NinetailedDisplayName]: NinetailedDirectoryName,
  [Gainsight_PXDisplayName]: Gainsight_PXDirectoryName,
  [XPixelDisplayName]: XPixelDirectoryName,
  [UserpilotDisplayName]: UserpilotDirectoryName,
  [ComscoreDisplayName]: ComscoreDirectoryName
};

export { destDisplayNamesToFileNamesMap };
