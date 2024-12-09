import * as AdobeAnalytics from './AdobeAnalytics';
import * as Amplitude from './Amplitude';
import * as Appcues from './Appcues';
import * as BingAds from './BingAds';
import * as Braze from './Braze';
import * as Bugsnag from './Bugsnag';
import * as Chartbeat from './Chartbeat';
import * as Clevertap from './Clevertap';
import * as Criteo from './Criteo';
import * as CustomerIO from './CustomerIO';
import * as Drip from './Drip';
import * as FBPixel from './FacebookPixel';
import * as Fullstory from './Fullstory';
import * as GA from './GA';
import * as GA4 from './GA4';
import * as GoogleAds from './GoogleAds';
import * as GoogleTagManager from './GoogleTagManager';
import * as Heap from './Heap';
import * as Hotjar from './Hotjar';
import * as HubSpot from './HubSpot';
import * as INTERCOM from './INTERCOM';
import * as Keen from './Keen';
import * as Kissmetrics from './Kissmetrics';
import * as Klaviyo from './Klaviyo';
import * as LinkedInInsightTag from './LinkedInInsightTag';
import * as Lotame from './Lotame';
import * as Lytics from './Lytics';
import * as Mixpanel from './Mixpanel';
import * as MoEngage from './MoEngage';
import * as Optimizely from './Optimizely';
import * as Pendo from './Pendo';
import * as PinterestTag from './PinterestTag';
import * as QuantumMetric from './QuantumMetric';
import * as Posthog from './Posthog';
import * as ProfitWell from './ProfitWell';
import * as Qualtrics from './Qualtrics';
import * as RedditPixel from './RedditPixel';
import * as Sentry from './Sentry';
import * as SnapPixel from './SnapPixel';
import * as TVSquared from './TVSquared';
import * as VWO from './VWO';
import * as GoogleOptimize from './GoogleOptimize';
import * as PostAffiliatePro from './PostAffiliatePro';
import * as LaunchDarkly from './LaunchDarkly';
import * as GA360 from './GA360';
import * as DCMFloodlight from './DCMFloodlight';
import * as Adroll from './Adroll';
import * as Vero from './Vero';
import * as Matomo from './Matomo';
import * as Rockerbox from './Rockerbox';
import * as Mouseflow from './Mouseflow';
import * as ConvertFlow from './ConvertFlow';
import * as SnapEngage from './SnapEngage';
import * as LiveChat from './LiveChat';
import * as Shynet from './Shynet';
import * as Woopra from './Woopra';
import * as RollBar from './RollBar';
import * as QuoraPixel from './QuoraPixel';
import * as Iterable from './Iterable';
import * as Engage from './Engage';
import * as June from './June';
import * as Refiner from './Refiner';
import * as YandexMetrica from './YandexMetrica';
import * as Podsights from './Podsights';
import * as Qualaroo from './Qualaroo';
import * as Axeptio from './Axeptio';
import * as Satismeter from './Satismeter';
import * as MicrosoftClarity from './MicrosoftClarity';
import * as Sendinblue from './Sendinblue';
import * as Olark from './Olark';
import * as Lemnisk from './Lemnisk';
import * as TiktokAds from './TiktokAds';
import * as ActiveCampaign from './ActiveCampaign';
import * as Sprig from './Sprig';
import * as SpotifyPixel from './SpotifyPixel';
import * as CommandBar from './CommandBar';
import * as Ninetailed from './Ninetailed';
import * as XPixel from './XPixel';
import * as Gainsight_PX from './Gainsight_PX';
// the key names should match the destination.name value to keep parity everywhere
// (config-plan name, native destination.name , exported integration name(this one below))

const integrations = {
  ADOBE_ANALYTICS: AdobeAnalytics.default,
  AM: Amplitude.default,
  APPCUES: Appcues.default,
  BINGADS: BingAds.default,
  BRAZE: Braze.default,
  BUGSNAG: Bugsnag.default,
  CHARTBEAT: Chartbeat.default,
  CLEVERTAP: Clevertap.default,
  CRITEO: Criteo.default,
  COMMANDBAR: CommandBar.default,
  CUSTOMERIO: CustomerIO.default,
  DCM_FLOODLIGHT: DCMFloodlight.default,
  DRIP: Drip.default,
  FACEBOOK_PIXEL: FBPixel.default,
  FULLSTORY: Fullstory.default,
  GA4: GA4.default,
  GA: GA.default,
  GOOGLEADS: GoogleAds.default,
  GTM: GoogleTagManager.default,
  HEAP: Heap.default,
  HOTJAR: Hotjar.default,
  HS: HubSpot.default,
  INTERCOM: INTERCOM.default,
  KEEN: Keen.default,
  KISSMETRICS: Kissmetrics.default,
  KLAVIYO: Klaviyo.default,
  LINKEDIN_INSIGHT_TAG: LinkedInInsightTag.default,
  LOTAME: Lotame.default,
  LYTICS: Lytics.default,
  MOENGAGE: MoEngage.default,
  MP: Mixpanel.default,
  OPTIMIZELY: Optimizely.default,
  PENDO: Pendo.default,
  PINTEREST_TAG: PinterestTag.default,
  QUANTUMMETRIC: QuantumMetric.default,
  POSTHOG: Posthog.default,
  PROFITWELL: ProfitWell.default,
  QUALTRICS: Qualtrics.default,
  REDDIT_PIXEL: RedditPixel.default,
  SENTRY: Sentry.default,
  SNAP_PIXEL: SnapPixel.default,
  TVSQUARED: TVSquared.default,
  VWO: VWO.default,
  GOOGLE_OPTIMIZE: GoogleOptimize.default,
  POST_AFFILIATE_PRO: PostAffiliatePro.default,
  LAUNCHDARKLY: LaunchDarkly.default,
  GA360: GA360.default,
  ADROLL: Adroll.default,
  VERO: Vero.default,
  MATOMO: Matomo.default,
  ROCKERBOX: Rockerbox.default,
  MOUSEFLOW: Mouseflow.default,
  CONVERTFLOW: ConvertFlow.default,
  SNAPENGAGE: SnapEngage.default,
  LIVECHAT: LiveChat.default,
  SHYNET: Shynet.default,
  WOOPRA: Woopra.default,
  ROLLBAR: RollBar.default,
  QUORA_PIXEL: QuoraPixel.default,
  ITERABLE: Iterable.default,
  ENGAGE: Engage.default,
  JUNE: June.default,
  REFINER: Refiner.default,
  YANDEX_METRICA: YandexMetrica.default,
  PODSIGHTS: Podsights.default,
  QUALAROO: Qualaroo.default,
  AXEPTIO: Axeptio.default,
  SATISMETER: Satismeter.default,
  MICROSOFT_CLARITY: MicrosoftClarity.default,
  SENDINBLUE: Sendinblue.default,
  OLARK: Olark.default,
  LEMNISK: Lemnisk.default,
  TIKTOK_ADS: TiktokAds.default,
  ACTIVE_CAMPAIGN: ActiveCampaign.default,
  SPRIG: Sprig.default,
  SPOTIFYPIXEL: SpotifyPixel.default,
  NINETAILED: Ninetailed.default,
  XPIXEL: XPixel.default,
  GAINSIGHT_PX: Gainsight_PX.default,
};

export { integrations };
