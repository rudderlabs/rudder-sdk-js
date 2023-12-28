import AdobeAnalytics from '../../src/integrations/AdobeAnalytics/browser';
import Amplitude from '../../src/integrations/Amplitude/browser';
import Appcues from '../../src/integrations/Appcues/browser';
import { BingAds } from '../../src/integrations/BingAds/browser';
import { Braze } from '../../src/integrations/Braze/browser';
import { Bugsnag } from '../../src/integrations/Bugsnag/browser';
import Clevertap from '../../src/integrations/Clevertap/browser';
import { Comscore } from '../../src/integrations/Comscore/browser';
import Criteo from '../../src/integrations/Criteo/browser';
import { CustomerIO } from '../../src/integrations/CustomerIO/browser';
import Drip from '../../src/integrations/Drip/browser';
import FacebookPixel from '../../src/integrations/FacebookPixel/browser';
import Fullstory from '../../src/integrations/Fullstory/browser';
import GA from '../../src/integrations/GA/browser';
import GA4 from '../../src/integrations/GA4/browser';
import GoogleAds from '../../src/integrations/GoogleAds/browser';
import { GoogleTagManager } from '../../src/integrations/GoogleTagManager/browser';
import Heap from '../../src/integrations/Heap/browser';
import { Hotjar } from '../../src/integrations/Hotjar/browser';
import { HubSpot } from '../../src/integrations/HubSpot/browser';
import { INTERCOM } from '../../src/integrations/INTERCOM/browser';
import { Keen } from '../../src/integrations/Keen/browser';
import { Kissmetrics } from '../../src/integrations/Kissmetrics/browser';
import Klaviyo from '../../src/integrations/Klaviyo/browser';
import LinkedInInsightTag from '../../src/integrations/LinkedInInsightTag/browser';
import { Lotame } from '../../src/integrations/Lotame/browser';
import Lytics from '../../src/integrations/Lytics/browser';
import Mixpanel from '../../src/integrations/Mixpanel/browser';
import MoEngage from '../../src/integrations/MoEngage/browser';
import Optimizely from '../../src/integrations/Optimizely/browser';
import { Pendo } from '../../src/integrations/Pendo/browser';
import PinterestTag from '../../src/integrations/PinterestTag/browser';
import QuantumMetric from '../../src/integrations/QuantumMetric/browser';
import Posthog from '../../src/integrations/Posthog/browser';
import ProfitWell from '../../src/integrations/ProfitWell/browser';
import Qualtrics from '../../src/integrations/Qualtrics/browser';
import RedditPixel from '../../src/integrations/RedditPixel/browser';
import Sentry from '../../src/integrations/Sentry/browser';
import SnapPixel from '../../src/integrations/SnapPixel/browser';
import TVSquared from '../../src/integrations/TVSquared/browser';
import { VWO } from '../../src/integrations/VWO/browser';
import GoogleOptimize from '../../src/integrations/GoogleOptimize/browser';
import PostAffiliatePro from '../../src/integrations/PostAffiliatePro/browser';
import LaunchDarkly from '../../src/integrations/LaunchDarkly/browser';
import { GA360 } from '../../src/integrations/GA360/browser';
import DCMFloodlight from '../../src/integrations/DCMFloodlight/browser';
import Adroll from '../../src/integrations/Adroll/browser';
import Vero from '../../src/integrations/Vero/browser';
import Matomo from '../../src/integrations/Matomo/browser';
import Rockerbox from '../../src/integrations/Rockerbox/browser';
import Mouseflow from '../../src/integrations/Mouseflow/browser';
import ConvertFlow from '../../src/integrations/ConvertFlow/browser';
import SnapEngage from '../../src/integrations/SnapEngage/browser';
import LiveChat from '../../src/integrations/LiveChat/browser';
import Shynet from '../../src/integrations/Shynet/browser';
import Woopra from '../../src/integrations/Woopra/browser';
import RollBar from '../../src/integrations/RollBar/browser';
import QuoraPixel from '../../src/integrations/QuoraPixel/browser';
import Iterable from '../../src/integrations/Iterable/browser';
import Engage from '../../src/integrations/Engage/browser';
import June from '../../src/integrations/June/browser';
import Refiner from '../../src/integrations/Refiner/browser';
import YandexMetrica from '../../src/integrations/YandexMetrica/browser';
import Podsights from '../../src/integrations/Podsights/browser';
import Qualaroo from '../../src/integrations/Qualaroo/browser';
import Axeptio from '../../src/integrations/Axeptio/browser';
import Satismeter from '../../src/integrations/Satismeter/browser';
import MicrosoftClarity from '../../src/integrations/MicrosoftClarity/browser';
import Sendinblue from '../../src/integrations/Sendinblue/browser';
import Olark from '../../src/integrations/Olark/browser';
import Lemnisk from '../../src/integrations/Lemnisk/browser';
import TiktokAds from '../../src/integrations/TiktokAds/browser';
import ActiveCampaign from '../../src/integrations/ActiveCampaign/browser';
import Sprig from '../../src/integrations/Sprig/browser';

const integrations = [
  { classname: AdobeAnalytics, name: 'ADOBE_ANALYTICS' },
  { classname: Amplitude, name: 'AM' },
  { classname: Appcues, name: 'APPCUES' },
  { classname: BingAds, name: 'BINGADS' },
  { classname: Braze, name: 'BRAZE' },
  { classname: Bugsnag, name: 'BUGSNAG' },
  { classname: Clevertap, name: 'CLEVERTAP' },
  { classname: Comscore, name: 'COMSCORE' },
  { classname: Criteo, name: 'CRITEO' },
  { classname: CustomerIO, name: 'CUSTOMERIO' },
  { classname: DCMFloodlight, name: 'DCM_FLOODLIGHT' },
  { classname: Drip, name: 'DRIP' },
  { classname: FacebookPixel, name: 'FACEBOOK_PIXEL' },
  {
    classname: Fullstory,
    name: 'FULLSTORY',
  },
  { classname: GA4, name: 'GA4' },
  { classname: GA, name: 'GA' },
  { classname: GoogleAds, name: 'GOOGLEADS' },
  { classname: GoogleTagManager, name: 'GTM' },
  { classname: Heap, name: 'HEAP' },
  { classname: Hotjar, name: 'HOTJAR' },
  { classname: HubSpot, name: 'HS' },
  { classname: INTERCOM, name: 'INTERCOM' },
  { classname: Keen, name: 'KEEN' },
  { classname: Kissmetrics, name: 'KISSMETRICS' },
  { classname: Klaviyo, name: 'KLAVIYO' },
  {
    classname: LinkedInInsightTag,
    name: 'LINKEDIN_INSIGHT_TAG',
  },
  { classname: Lotame, name: 'LOTAME' },
  { classname: Lytics, name: 'LYTICS' },
  { classname: MoEngage, name: 'MOENGAGE' },
  { classname: Mixpanel, name: 'MP' },
  { classname: Optimizely, name: 'OPTIMIZELY' },
  { classname: Pendo, name: 'PENDO' },
  { classname: PinterestTag, name: 'PINTEREST_TAG' },
  { classname: QuantumMetric, name: 'QUANTUMMETRIC' },
  { classname: Posthog, name: 'POSTHOG' },
  { classname: ProfitWell, name: 'PROFITWELL' },
  { classname: Qualtrics, name: 'QUALTRICS' },
  { classname: RedditPixel, name: 'REDDIT_PIXEL' },
  { classname: Sentry, name: 'SENTRY' },
  { classname: SnapPixel, name: 'SNAP_PIXEL' },
  { classname: TVSquared, name: 'TVSQUARED' },
  { classname: VWO, name: 'VWO' },
  { classname: GoogleOptimize, name: 'GOOGLE_OPTIMIZE' },
  { classname: PostAffiliatePro, name: 'POST_AFFILIATE_PRO' },
  { classname: LaunchDarkly, name: 'LAUNCHDARKLY' },
  { classname: GA360, name: 'GA360' },
  { classname: Adroll, name: 'ADROLL' },
  { classname: Vero, name: 'VERO' },
  { classname: Matomo, name: 'MATOMO' },
  { classname: Rockerbox, name: 'ROCKERBOX' },
  { classname: Mouseflow, name: 'MOUSEFLOW' },
  { classname: ConvertFlow, name: 'CONVERTFLOW' },
  { classname: SnapEngage, name: 'SNAPENGAGE' },
  { classname: LiveChat, name: 'LIVECHAT' },
  { classname: Shynet, name: 'SHYNET' },
  { classname: Woopra, name: 'WOOPRA' },
  { classname: RollBar, name: 'ROLLBAR' },
  { classname: QuoraPixel, name: 'QUORA_PIXEL' },
  { classname: Iterable, name: 'ITERABLE' },
  { classname: Engage, name: 'ENGAGE' },
  { classname: June, name: 'JUNE' },
  { classname: Refiner, name: 'REFINER' },
  { classname: YandexMetrica, name: 'YANDEX_METRICA' },
  { classname: Podsights, name: 'PODSIGHTS' },
  { classname: Qualaroo, name: 'QUALAROO' },
  { classname: Axeptio, name: 'AXEPTIO' },
  { classname: Satismeter, name: 'SATISMETER' },
  {
    classname: MicrosoftClarity,
    name: 'MICROSOFT_CLARITY',
  },
  { classname: Sendinblue, name: 'SENDINBLUE' },
  { classname: Olark, name: 'OLARK' },
  { classname: Lemnisk, name: 'LEMNISK' },
  { classname: TiktokAds, name: 'TIKTOK_ADS' },
  { classname: ActiveCampaign, name: 'ACTIVE_CAMPAIGN' },
  { classname: Sprig, name: 'SPRIG' },
];

const destinationInfo = {
  areTransformationsConnected: false,
  destinationId: 'sample-destination-id',
};
describe('Destination generic tests', () => {
  it('Verify all destination names', () => {
      integrations.forEach(integration => {
          const { classname: Class, name } = integration;
          const destinationClass = new Class(
        {},
        { loglevel: 'debug', loadIntegration: true },
        destinationInfo,
      );
      expect(destinationClass.name).toBe(name);
    });
  });
});
