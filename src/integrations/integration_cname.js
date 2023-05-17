import { CNameMapping as AdobeAnalytics } from "./AdobeAnalytics/constants";
import { CNameMapping as Amplitude } from "./Amplitude/constants";
import { CNameMapping as Appcues } from "./Appcues/constants";
import { CNameMapping as BingAds } from "./BingAds/constants";
import { CNameMapping as Braze } from "./Braze/constants";
import { CNameMapping as Bugsnag } from "./Bugsnag/constants";
import { CNameMapping as Chartbeat } from "./Chartbeat/constants";
import { CNameMapping as Clevertap } from "./Clevertap/constants";
import { CNameMapping as Comscore } from "./Comscore/constants";
import { CNameMapping as Criteo } from "./Criteo/constants";
import { CNameMapping as CustomerIO } from "./CustomerIO/constants";
import { CNameMapping as Drip } from "./Drip/constants";
import { CNameMapping as FacebookPixel } from "./FacebookPixel/constants";
import { CNameMapping as Fullstory } from "./Fullstory/constants";
import { CNameMapping as GA } from "./GA/constants";
import { CNameMapping as GA4 } from "./GA4/constants";
import { CNameMapping as GoogleAds } from "./GoogleAds/constants";
import { CNameMapping as GoogleOptimize } from "./GoogleOptimize/constants";
import { CNameMapping as GoogleTagManager } from "./GoogleTagManager/constants";
import { CNameMapping as Heap } from "./Heap/constants";
import { CNameMapping as Hotjar } from "./Hotjar/constants";
import { CNameMapping as HubSpot } from "./HubSpot/constants";
import { CNameMapping as INTERCOM } from "./INTERCOM/constants";
import { CNameMapping as Keen } from "./Keen/constants";
import { CNameMapping as Kissmetrics } from "./Kissmetrics/constants";
import { CNameMapping as Klaviyo } from "./Klaviyo/constants";
import { CNameMapping as LaunchDarkly } from "./LaunchDarkly/constants";
import { CNameMapping as LinkedInInsightTag } from "./LinkedInInsightTag/constants";
import { CNameMapping as Lotame } from "./Lotame/constants";
import { CNameMapping as Lytics } from "./Lytics/constants";
import { CNameMapping as Mixpanel } from "./Mixpanel/constants";
import { CNameMapping as MoEngage } from "./MoEngage/constants";
import { CNameMapping as Optimizely } from "./Optimizely/constants";
import { CNameMapping as Pendo } from "./Pendo/constants";
import { CNameMapping as PinterestTag } from "./PinterestTag/constants";
import { CNameMapping as PostAffiliatePro } from "./PostAffiliatePro/constants";
import { CNameMapping as Posthog } from "./Posthog/constants";
import { CNameMapping as ProfitWell } from "./ProfitWell/constants";
import { CNameMapping as Qualtrics } from "./Qualtrics/constants";
import { CNameMapping as QuantumMetric } from "./QuantumMetric/constants";
import { CNameMapping as RedditPixel } from "./RedditPixel/constants";
import { CNameMapping as Sentry } from "./Sentry/constants";
import { CNameMapping as SnapPixel } from "./SnapPixel/constants";
import { CNameMapping as TVSquared } from "./TVSquared/constants";
import { CNameMapping as VWO } from "./VWO/constants";
import { CNameMapping as GA360 } from "./GA360/constants";
import { CNameMapping as DCMFloodlight } from "./DCMFloodlight/constants";
import { CNameMapping as Adroll } from "./Adroll/constants";
import { CNameMapping as Vero } from "./Vero/constants";
import { CNameMapping as Matomo } from "./Matomo/constants";
import { CNameMapping as Rockerbox } from "./Rockerbox/constants";
import { CNameMapping as Mouseflow } from "./Mouseflow/constants";
import { CNameMapping as ConvertFlow } from "./ConvertFlow/constants";
import { CNameMapping as SnapEngage } from "./SnapEngage/constants";
import { CNameMapping as LiveChat } from "./LiveChat/constants";
import { CNameMapping as Shynet } from "./Shynet/constants";
import { CNameMapping as Woopra } from "./Woopra/constants";
import { CNameMapping as RollBar } from "./RollBar/constants";
import { CNameMapping as QuoraPixel } from "./QuoraPixel/constants";
import { CNameMapping as Iterable } from "./Iterable/constants";
import { CNameMapping as Engage } from "./Engage/constants";
import { CNameMapping as June } from "./June/constants";
import { CNameMapping as Refiner } from "./Refiner/constants";
import { CNameMapping as YandexMetrica } from "./YandexMetrica/constants";
import { CNameMapping as Podsights } from "./Podsights/constants";
import { CNameMapping as Qualaroo } from "./Qualaroo/constants";
import { CNameMapping as Satismeter } from "./Satismeter/constants";
import { CNameMapping as MicrosoftClarity } from "./MicrosoftClarity/constants";
import { CNameMapping as Axeptio } from "./Axeptio/constants";
import { CNameMapping as Sendinblue } from "./Sendinblue/constants";
import { CNameMapping as Olark } from "./Olark/constants";
import { CNameMapping as Lemnisk } from "./Lemnisk/constants";
import { CNameMapping as TiktokAds } from "./TiktokAds/constants";

// for sdk side native integration identification
// add a mapping from common names to index.js exported key names as identified by Rudder
const commonNames = {
  All: "All",
  ...AdobeAnalytics,
  ...Adroll,
  ...Amplitude,
  ...Appcues,
  ...BingAds,
  ...Braze,
  ...Bugsnag,
  ...Chartbeat,
  ...Clevertap,
  ...Comscore,
  ...ConvertFlow,
  ...Criteo,
  ...CustomerIO,
  ...DCMFloodlight,
  ...Drip,
  ...FacebookPixel,
  ...Fullstory,
  ...GA,
  ...GA4,
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
  ...Matomo,
  ...Mixpanel,
  ...MoEngage,
  ...Mouseflow,
  ...Optimizely,
  ...Pendo,
  ...PinterestTag,
  ...Podsights,
  ...PostAffiliatePro,
  ...Posthog,
  ...ProfitWell,
  ...Qualtrics,
  ...QuantumMetric,
  ...RedditPixel,
  ...Rockerbox,
  ...Sentry,
  ...SnapEngage,
  ...SnapPixel,
  ...TVSquared,
  ...Vero,
  ...VWO,
  ...LiveChat,
  ...Shynet,
  ...Woopra,
  ...RollBar,
  ...QuoraPixel,
  ...Iterable,
  ...Engage,
  ...June,
  ...Refiner,
  ...YandexMetrica,
  ...Qualaroo,
  ...Satismeter,
  ...MicrosoftClarity,
  ...Axeptio,
  ...Sendinblue,
  ...Olark,
  ...Lemnisk,
  ...TiktokAds
};

export { commonNames };
