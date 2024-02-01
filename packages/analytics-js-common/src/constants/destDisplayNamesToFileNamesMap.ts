// map of the destination display names to the destination directory names
import {
  HubSpotDisplayName,
  HubSpotDirectoryName,
  GADisplayName,
  GADirectoryName,
  HotjarDisplayName,
  HotjarDirectoryName,
  GoogleAdsDisplayName,
  GoogleAdsDirectoryName,
  VWODisplayName,
  VWODirectoryName,
  GoogleTagManagerDisplayName,
  GoogleTagManagerDirectoryName,
  BrazeDisplayName,
  BrazeDirectoryName,
  IntercomDisplayName,
  IntercomDirectoryName,
  KeenDisplayName,
  KeenDirectoryName,
  KissmetricsDisplayName,
  KissmetricsDirectoryName,
  CustomerIODisplayName,
  CustomerIODirectoryName,
  ChartbeatDisplayName,
  ChartbeatDirectoryName,
  ComscoreDisplayName,
  ComscoreDirectoryName,
  FacebookPixelDisplayName,
  FacebookPixelDirectoryName,
  LotameDisplayName,
  LotameDirectoryName,
  OptimizelyDisplayName,
  OptimizelyDirectoryName,
  BugsnagDisplayName,
  BugsnagDirectoryName,
  FullstoryDisplayName,
  FullstoryDirectoryName,
  TVSquaredDisplayName,
  TVSquaredDirectoryName,
  GA4DisplayName,
  GA4DirectoryName,
  MoEngageDisplayName,
  MoEngageDirectoryName,
  AmplitudeDisplayName,
  AmplitudeDirectoryName,
  PendoDisplayName,
  PendoDirectoryName,
  LyticsDisplayName,
  LyticsDirectoryName,
  AppcuesDisplayName,
  AppcuesDirectoryName,
  PostHogDisplayName,
  PostHogDirectoryName,
  KlaviyoDisplayName,
  KlaviyoDirectoryName,
  CleverTapDisplayName,
  CleverTapDirectoryName,
  BingAdsDisplayName,
  BingAdsDirectoryName,
  PinterestTagDisplayName,
  PinterestTagDirectoryName,
  AdobeAnalyticsDisplayName,
  AdobeAnalyticsDirectoryName,
  LinkedInInsightTagDisplayName,
  LinkedInInsightTagDirectoryName,
  RedditPixelDisplayName,
  RedditPixelDirectoryName,
  DripDisplayName,
  DripDirectoryName,
  HeapDisplayName,
  HeapDirectoryName,
  CriteoDisplayName,
  CriteoDirectoryName,
  MixpanelDisplayName,
  MixpanelDirectoryName,
  QualtricsDisplayName,
  QualtricsDirectoryName,
  ProfitWellDisplayName,
  ProfitWellDirectoryName,
  SentryDisplayName,
  SentryDirectoryName,
  QuantumMetricDisplayName,
  QuantumMetricDirectoryName,
  SnapPixelDisplayName,
  SnapPixelDirectoryName,
  PostAffiliateProDisplayName,
  PostAffiliateProDirectoryName,
  GoogleOptimizeDisplayName,
  GoogleOptimizeDirectoryName,
  LaunchDarklyDisplayName,
  LaunchDarklyDirectoryName,
  GA360DisplayName,
  GA360DirectoryName,
  AdrollDisplayName,
  AdrollDirectoryName,
  DCMFloodlightDisplayName,
  DCMFloodlightDirectoryName,
  MatomoDisplayName,
  MatomoDirectoryName,
  VeroDisplayName,
  VeroDirectoryName,
  MouseflowDisplayName,
  MouseflowDirectoryName,
  RockerboxDisplayName,
  RockerboxDirectoryName,
  ConvertFlowDisplayName,
  ConvertFlowDirectoryName,
  SnapEngageDisplayName,
  SnapEngageDirectoryName,
  LiveChatDisplayName,
  LiveChatDirectoryName,
  ShynetDisplayName,
  ShynetDirectoryName,
  WoopraDisplayName,
  WoopraDirectoryName,
  RollBarDisplayName,
  RollBarDirectoryName,
  QuoraPixelDisplayName,
  QuoraPixelDirectoryName,
  JuneDisplayName,
  JuneDirectoryName,
  EngageDisplayName,
  EngageDirectoryName,
  IterableDisplayName,
  IterableDirectoryName,
  YandexMetricaDisplayName,
  YandexMetricaDirectoryName,
  RefinerDisplayName,
  RefinerDirectoryName,
  QualarooDisplayName,
  QualarooDirectoryName,
  PodsightsDisplayName,
  PodsightsDirectoryName,
  AxeptioDisplayName,
  AxeptioDirectoryName,
  SatismeterDisplayName,
  SatismeterDirectoryName,
  MicrosoftClarityDisplayName,
  MicrosoftClarityDirectoryName,
  SendinblueDisplayName,
  SendinblueDirectoryName,
  OlarkDisplayName,
  OlarkDirectoryName,
  LemniskDisplayName,
  LemniskDirectoryName,
  TiktokAdsDisplayName,
  TiktokAdsDirectoryName,
  ActiveCampaignDisplayName,
  ActiveCampaignDirectoryName,
  SprigDisplayName,
  SprigDirectoryName,
  SpotifyPixelDisplayName,
  SpotifyPixelDirectoryName,
} from './destinationNames';

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
  [ComscoreDisplayName]: ComscoreDirectoryName,
  [FacebookPixelDisplayName]: FacebookPixelDirectoryName,
  [LotameDisplayName]: LotameDirectoryName,
  [OptimizelyDisplayName]: OptimizelyDirectoryName,
  [BugsnagDisplayName]: BugsnagDirectoryName,
  [FullstoryDisplayName]: FullstoryDirectoryName,
  [TVSquaredDisplayName]: TVSquaredDirectoryName,
  [GA4DisplayName]: GA4DirectoryName,
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
  [SpotifyPixelDisplayName] : SpotifyPixelDirectoryName
};

export { destDisplayNamesToFileNamesMap };
