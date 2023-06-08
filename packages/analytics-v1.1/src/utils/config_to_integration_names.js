import { DISPLAY_NAME_TO_DIR_NAME_MAP as AdobeAnalytics } from '../integrations/AdobeAnalytics/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Amplitude } from '../integrations/Amplitude/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Appcues } from '../integrations/Appcues/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as BingAds } from '../integrations/BingAds/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Braze } from '../integrations/Braze/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Bugsnag } from '../integrations/Bugsnag/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Chartbeat } from '../integrations/Chartbeat/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as CleverTap } from '../integrations/Clevertap/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Comscore } from '../integrations/Comscore/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Criteo } from '../integrations/Criteo/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as CustomerIO } from '../integrations/CustomerIO/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Drip } from '../integrations/Drip/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as FacebookPixel } from '../integrations/FacebookPixel/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Fullstory } from '../integrations/Fullstory/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GA } from '../integrations/GA/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GA4 } from '../integrations/GA4/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GoogleAds } from '../integrations/GoogleAds/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GoogleOptimize } from '../integrations/GoogleOptimize/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GoogleTagManager } from '../integrations/GoogleTagManager/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Heap } from '../integrations/Heap/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Hotjar } from '../integrations/Hotjar/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as HubSpot } from '../integrations/HubSpot/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Intercom } from '../integrations/INTERCOM/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Keen } from '../integrations/Keen/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Kissmetrics } from '../integrations/Kissmetrics/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Klaviyo } from '../integrations/Klaviyo/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as LaunchDarkly } from '../integrations/LaunchDarkly/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as LinkedInInsightTag } from '../integrations/LinkedInInsightTag/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Lotame } from '../integrations/Lotame/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Lytics } from '../integrations/Lytics/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Mixpanel } from '../integrations/Mixpanel/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as MoEngage } from '../integrations/MoEngage/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Optimizely } from '../integrations/Optimizely/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Pendo } from '../integrations/Pendo/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as PinterestTag } from '../integrations/PinterestTag/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as PostAffiliatePro } from '../integrations/PostAffiliatePro/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as PostHog } from '../integrations/Posthog/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as ProfitWell } from '../integrations/ProfitWell/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Qualtrics } from '../integrations/Qualtrics/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as QuantumMetric } from '../integrations/QuantumMetric/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as RedditPixel } from '../integrations/RedditPixel/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Sentry } from '../integrations/Sentry/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as SnapPixel } from '../integrations/SnapPixel/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as TVSquared } from '../integrations/TVSquared/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as VWO } from '../integrations/VWO/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GA360 } from '../integrations/GA360/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Adroll } from '../integrations/Adroll/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as DCMFloodlight } from '../integrations/DCMFloodlight/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Matomo } from '../integrations/Matomo/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Vero } from '../integrations/Vero/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Mouseflow } from '../integrations/Mouseflow/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Rockerbox } from '../integrations/Rockerbox/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as ConvertFlow } from '../integrations/ConvertFlow/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as SnapEngage } from '../integrations/SnapEngage/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as LiveChat } from '../integrations/LiveChat/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Shynet } from '../integrations/Shynet/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Woopra } from '../integrations/Woopra/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as RollBar } from '../integrations/RollBar/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as QuoraPixel } from '../integrations/QuoraPixel/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as June } from '../integrations/June/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Engage } from '../integrations/Engage/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Iterable } from '../integrations/Iterable/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as YandexMetrica } from '../integrations/YandexMetrica/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Refiner } from '../integrations/Refiner/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Qualaroo } from '../integrations/Qualaroo/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Podsights } from '../integrations/Podsights/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Axeptio } from '../integrations/Axeptio/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Satismeter } from '../integrations/Satismeter/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as MicrosoftClarity } from '../integrations/MicrosoftClarity/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Sendinblue } from '../integrations/Sendinblue/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Olark } from '../integrations/Olark/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Lemnisk } from '../integrations/Lemnisk/constants';

// map b/w the names of integrations coming from config plane to
// integration module names
const configToIntNames = {
  ...HubSpot,
  ...GA,
  ...Hotjar,
  ...GoogleAds,
  ...VWO,
  ...GoogleTagManager,
  ...Braze,
  ...Intercom,
  ...Keen,
  ...Kissmetrics,
  ...CustomerIO,
  ...Chartbeat,
  ...Comscore,
  ...FacebookPixel,
  ...Lotame,
  ...Optimizely,
  ...Bugsnag,
  ...Fullstory,
  ...TVSquared,
  ...GA4,
  ...MoEngage,
  ...Amplitude,
  ...Pendo,
  ...Lytics,
  ...Appcues,
  ...PostHog,
  ...Klaviyo,
  ...CleverTap,
  ...BingAds,
  ...PinterestTag,
  ...AdobeAnalytics,
  ...LinkedInInsightTag,
  ...RedditPixel,
  ...Drip,
  ...Heap,
  ...Criteo,
  ...Mixpanel,
  ...Qualtrics,
  ...ProfitWell,
  ...Sentry,
  ...QuantumMetric,
  ...SnapPixel,
  ...PostAffiliatePro,
  ...GoogleOptimize,
  ...LaunchDarkly,
  ...GA360,
  ...Adroll,
  ...DCMFloodlight,
  ...Matomo,
  ...Vero,
  ...Mouseflow,
  ...Rockerbox,
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
  ...YandexMetrica,
  ...Refiner,
  ...Qualaroo,
  ...Podsights,
  ...Axeptio,
  ...Satismeter,
  ...MicrosoftClarity,
  ...Sendinblue,
  ...Olark,
  ...Lemnisk,
};

export { configToIntNames };
