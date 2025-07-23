/* eslint-disable unicorn/filename-case */
// Import CNameMapping from analytics-js-integrations since all integration constants were moved there
import { CNameMapping as AdobeAnalytics } from '@rudderstack/analytics-js-integrations/integrations/AdobeAnalytics/constants';
import { CNameMapping as Amplitude } from '@rudderstack/analytics-js-integrations/integrations/Amplitude/constants';
import { CNameMapping as Appcues } from '@rudderstack/analytics-js-integrations/integrations/Appcues/constants';
import { CNameMapping as BingAds } from '@rudderstack/analytics-js-integrations/integrations/BingAds/constants';
import { CNameMapping as Braze } from '@rudderstack/analytics-js-integrations/integrations/Braze/constants';
import { CNameMapping as Bugsnag } from '@rudderstack/analytics-js-integrations/integrations/Bugsnag/constants';
import { CNameMapping as Chartbeat } from '@rudderstack/analytics-js-integrations/integrations/Chartbeat/constants';
import { CNameMapping as Clevertap } from '@rudderstack/analytics-js-integrations/integrations/Clevertap/constants';
import { CNameMapping as Criteo } from '@rudderstack/analytics-js-integrations/integrations/Criteo/constants';
import { CNameMapping as CustomerIO } from '@rudderstack/analytics-js-integrations/integrations/CustomerIO/constants';
import { CNameMapping as Drip } from '@rudderstack/analytics-js-integrations/integrations/Drip/constants';
import { CNameMapping as FacebookPixel } from '@rudderstack/analytics-js-integrations/integrations/FacebookPixel/constants';
import { CNameMapping as Fullstory } from '@rudderstack/analytics-js-integrations/integrations/Fullstory/constants';
import { CNameMapping as GA } from '@rudderstack/analytics-js-integrations/integrations/GA/constants';
import { CNameMapping as GA4 } from '@rudderstack/analytics-js-integrations/integrations/GA4/constants';
import { CNameMapping as GA4_V2 } from '@rudderstack/analytics-js-integrations/integrations/GA4_V2/constants';
import { CNameMapping as GoogleAds } from '@rudderstack/analytics-js-integrations/integrations/GoogleAds/constants';
import { CNameMapping as GoogleOptimize } from '@rudderstack/analytics-js-integrations/integrations/GoogleOptimize/constants';
import { CNameMapping as GoogleTagManager } from '@rudderstack/analytics-js-integrations/integrations/GoogleTagManager/constants';
import { CNameMapping as Heap } from '@rudderstack/analytics-js-integrations/integrations/Heap/constants';
import { CNameMapping as Hotjar } from '@rudderstack/analytics-js-integrations/integrations/Hotjar/constants';
import { CNameMapping as HubSpot } from '@rudderstack/analytics-js-integrations/integrations/HubSpot/constants';
import { CNameMapping as INTERCOM } from '@rudderstack/analytics-js-integrations/integrations/INTERCOM/constants';
import { CNameMapping as Keen } from '@rudderstack/analytics-js-integrations/integrations/Keen/constants';
import { CNameMapping as Kissmetrics } from '@rudderstack/analytics-js-integrations/integrations/Kissmetrics/constants';
import { CNameMapping as Klaviyo } from '@rudderstack/analytics-js-integrations/integrations/Klaviyo/constants';
import { CNameMapping as LaunchDarkly } from '@rudderstack/analytics-js-integrations/integrations/LaunchDarkly/constants';
import { CNameMapping as LinkedInInsightTag } from '@rudderstack/analytics-js-integrations/integrations/LinkedInInsightTag/constants';
import { CNameMapping as Lotame } from '@rudderstack/analytics-js-integrations/integrations/Lotame/constants';
import { CNameMapping as Lytics } from '@rudderstack/analytics-js-integrations/integrations/Lytics/constants';
import { CNameMapping as Mixpanel } from '@rudderstack/analytics-js-integrations/integrations/Mixpanel/constants';
import { CNameMapping as MoEngage } from '@rudderstack/analytics-js-integrations/integrations/MoEngage/constants';
import { CNameMapping as Optimizely } from '@rudderstack/analytics-js-integrations/integrations/Optimizely/constants';
import { CNameMapping as Pendo } from '@rudderstack/analytics-js-integrations/integrations/Pendo/constants';
import { CNameMapping as PinterestTag } from '@rudderstack/analytics-js-integrations/integrations/PinterestTag/constants';
import { CNameMapping as PostAffiliatePro } from '@rudderstack/analytics-js-integrations/integrations/PostAffiliatePro/constants';
import { CNameMapping as Posthog } from '@rudderstack/analytics-js-integrations/integrations/Posthog/constants';
import { CNameMapping as ProfitWell } from '@rudderstack/analytics-js-integrations/integrations/ProfitWell/constants';
import { CNameMapping as Qualtrics } from '@rudderstack/analytics-js-integrations/integrations/Qualtrics/constants';
import { CNameMapping as QuantumMetric } from '@rudderstack/analytics-js-integrations/integrations/QuantumMetric/constants';
import { CNameMapping as RedditPixel } from '@rudderstack/analytics-js-integrations/integrations/RedditPixel/constants';
import { CNameMapping as Sentry } from '@rudderstack/analytics-js-integrations/integrations/Sentry/constants';
import { CNameMapping as SnapPixel } from '@rudderstack/analytics-js-integrations/integrations/SnapPixel/constants';
import { CNameMapping as TVSquared } from '@rudderstack/analytics-js-integrations/integrations/TVSquared/constants';
import { CNameMapping as VWO } from '@rudderstack/analytics-js-integrations/integrations/VWO/constants';
import { CNameMapping as GA360 } from '@rudderstack/analytics-js-integrations/integrations/GA360/constants';
import { CNameMapping as Adroll } from '@rudderstack/analytics-js-integrations/integrations/Adroll/constants';
import { CNameMapping as DCMFloodlight } from '@rudderstack/analytics-js-integrations/integrations/DCMFloodlight/constants';
import { CNameMapping as Matomo } from '@rudderstack/analytics-js-integrations/integrations/Matomo/constants';
import { CNameMapping as Vero } from '@rudderstack/analytics-js-integrations/integrations/Vero/constants';
import { CNameMapping as Mouseflow } from '@rudderstack/analytics-js-integrations/integrations/Mouseflow/constants';
import { CNameMapping as Rockerbox } from '@rudderstack/analytics-js-integrations/integrations/Rockerbox/constants';
import { CNameMapping as ConvertFlow } from '@rudderstack/analytics-js-integrations/integrations/ConvertFlow/constants';
import { CNameMapping as SnapEngage } from '@rudderstack/analytics-js-integrations/integrations/SnapEngage/constants';
import { CNameMapping as LiveChat } from '@rudderstack/analytics-js-integrations/integrations/LiveChat/constants';
import { CNameMapping as Shynet } from '@rudderstack/analytics-js-integrations/integrations/Shynet/constants';
import { CNameMapping as Woopra } from '@rudderstack/analytics-js-integrations/integrations/Woopra/constants';
import { CNameMapping as RollBar } from '@rudderstack/analytics-js-integrations/integrations/RollBar/constants';
import { CNameMapping as QuoraPixel } from '@rudderstack/analytics-js-integrations/integrations/QuoraPixel/constants';
import { CNameMapping as June } from '@rudderstack/analytics-js-integrations/integrations/June/constants';
import { CNameMapping as Engage } from '@rudderstack/analytics-js-integrations/integrations/Engage/constants';
import { CNameMapping as Iterable } from '@rudderstack/analytics-js-integrations/integrations/Iterable/constants';
import { CNameMapping as YandexMetrica } from '@rudderstack/analytics-js-integrations/integrations/YandexMetrica/constants';
import { CNameMapping as Refiner } from '@rudderstack/analytics-js-integrations/integrations/Refiner/constants';
import { CNameMapping as Qualaroo } from '@rudderstack/analytics-js-integrations/integrations/Qualaroo/constants';
import { CNameMapping as Podsights } from '@rudderstack/analytics-js-integrations/integrations/Podsights/constants';
import { CNameMapping as Axeptio } from '@rudderstack/analytics-js-integrations/integrations/Axeptio/constants';
import { CNameMapping as SatisMeter } from '@rudderstack/analytics-js-integrations/integrations/Satismeter/constants';
import { CNameMapping as MicrosoftClarity } from '@rudderstack/analytics-js-integrations/integrations/MicrosoftClarity/constants';
import { CNameMapping as Sendinblue } from '@rudderstack/analytics-js-integrations/integrations/Sendinblue/constants';
import { CNameMapping as Olark } from '@rudderstack/analytics-js-integrations/integrations/Olark/constants';
import { CNameMapping as Lemnisk } from '@rudderstack/analytics-js-integrations/integrations/Lemnisk/constants';
import { CNameMapping as TiktokAds } from '@rudderstack/analytics-js-integrations/integrations/TiktokAds/constants';
import { CNameMapping as ActiveCampaign } from '@rudderstack/analytics-js-integrations/integrations/ActiveCampaign/constants';
import { CNameMapping as Sprig } from '@rudderstack/analytics-js-integrations/integrations/Sprig/constants';
import { CNameMapping as SpotifyPixel } from '@rudderstack/analytics-js-integrations/integrations/SpotifyPixel/constants';
import { CNameMapping as CommandBar } from '@rudderstack/analytics-js-integrations/integrations/CommandBar/constants';
import { CNameMapping as Ninetailed } from '@rudderstack/analytics-js-integrations/integrations/Ninetailed/constants';
import { CNameMapping as XPixel } from '@rudderstack/analytics-js-integrations/integrations/XPixel/constants';
import { CNameMapping as Gainsight_PX } from '@rudderstack/analytics-js-integrations/integrations/Gainsight_PX/constants';
import { CNameMapping as Userpilot } from '@rudderstack/analytics-js-integrations/integrations/Userpilot/constants';
import { CNameMapping as Comscore } from '@rudderstack/analytics-js-integrations/integrations/Comscore/constants';
// for sdk side native integration identification
// add a mapping from common names to index.js exported key names as identified by Rudder
const commonNames = {
  All: 'All',
  ...AdobeAnalytics,
  ...Amplitude,
  ...Appcues,
  ...BingAds,
  ...Braze,
  ...Bugsnag,
  ...CommandBar,
  ...Chartbeat,
  ...Clevertap,
  ...Criteo,
  ...CustomerIO,
  ...Drip,
  ...FacebookPixel,
  ...Fullstory,
  ...GA,
  ...GA4,
  ...GA4_V2,
  ...GA360,
  ...GoogleAds,
  ...GoogleOptimize,
  ...GoogleTagManager,
  ...Heap,
  ...Hotjar,
  ...HubSpot,
  ...INTERCOM,
  ...Keen,
  ...Kissmetrics,
  ...Klaviyo,
  ...LaunchDarkly,
  ...LinkedInInsightTag,
  ...Lotame,
  ...Lytics,
  ...Mixpanel,
  ...MoEngage,
  ...Ninetailed,
  ...Optimizely,
  ...Pendo,
  ...PinterestTag,
  ...PostAffiliatePro,
  ...Posthog,
  ...ProfitWell,
  ...Qualtrics,
  ...QuantumMetric,
  ...RedditPixel,
  ...Sentry,
  ...SnapPixel,
  ...TVSquared,
  ...VWO,
  ...Adroll,
  ...DCMFloodlight,
  ...Matomo,
  ...Vero,
  ...Mouseflow,
  ...ConvertFlow,
  ...SnapEngage,
  ...LiveChat,
  ...Shynet,
  ...Woopra,
  ...RollBar,
  ...QuoraPixel,
  ...June,
  ...Engage,
  ...Iterable,
  ...Rockerbox,
  ...YandexMetrica,
  ...Refiner,
  ...Qualaroo,
  ...Podsights,
  ...Axeptio,
  ...SatisMeter,
  ...MicrosoftClarity,
  ...Sendinblue,
  ...Olark,
  ...Lemnisk,
  ...TiktokAds,
  ...ActiveCampaign,
  ...Sprig,
  ...SpotifyPixel,
  ...XPixel,
  ...Gainsight_PX,
  ...Userpilot,
  ...Comscore,
};

export { commonNames };
