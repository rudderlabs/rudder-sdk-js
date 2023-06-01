/* eslint-disable import/no-extraneous-dependencies */
import { DISPLAY_NAME_TO_DIR_NAME_MAP as AdobeAnalytics } from 'rudder-sdk-js/integrations/AdobeAnalytics/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Amplitude } from 'rudder-sdk-js/integrations/Amplitude/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Appcues } from 'rudder-sdk-js/integrations/Appcues/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as BingAds } from 'rudder-sdk-js/integrations/BingAds/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Braze } from 'rudder-sdk-js/integrations/Braze/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Bugsnag } from 'rudder-sdk-js/integrations/Bugsnag/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Chartbeat } from 'rudder-sdk-js/integrations/Chartbeat/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as CleverTap } from 'rudder-sdk-js/integrations/Clevertap/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Comscore } from 'rudder-sdk-js/integrations/Comscore/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Criteo } from 'rudder-sdk-js/integrations/Criteo/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as CustomerIO } from 'rudder-sdk-js/integrations/CustomerIO/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Drip } from 'rudder-sdk-js/integrations/Drip/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as FacebookPixel } from 'rudder-sdk-js/integrations/FacebookPixel/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Fullstory } from 'rudder-sdk-js/integrations/Fullstory/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GA } from 'rudder-sdk-js/integrations/GA/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GA4 } from 'rudder-sdk-js/integrations/GA4/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GoogleAds } from 'rudder-sdk-js/integrations/GoogleAds/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GoogleOptimize } from 'rudder-sdk-js/integrations/GoogleOptimize/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GoogleTagManager } from 'rudder-sdk-js/integrations/GoogleTagManager/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Heap } from 'rudder-sdk-js/integrations/Heap/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Hotjar } from 'rudder-sdk-js/integrations/Hotjar/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as HubSpot } from 'rudder-sdk-js/integrations/HubSpot/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Intercom } from 'rudder-sdk-js/integrations/INTERCOM/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Keen } from 'rudder-sdk-js/integrations/Keen/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Kissmetrics } from 'rudder-sdk-js/integrations/Kissmetrics/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Klaviyo } from 'rudder-sdk-js/integrations/Klaviyo/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as LaunchDarkly } from 'rudder-sdk-js/integrations/LaunchDarkly/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as LinkedInInsightTag } from 'rudder-sdk-js/integrations/LinkedInInsightTag/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Lotame } from 'rudder-sdk-js/integrations/Lotame/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Lytics } from 'rudder-sdk-js/integrations/Lytics/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Mixpanel } from 'rudder-sdk-js/integrations/Mixpanel/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as MoEngage } from 'rudder-sdk-js/integrations/MoEngage/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Optimizely } from 'rudder-sdk-js/integrations/Optimizely/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Pendo } from 'rudder-sdk-js/integrations/Pendo/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as PinterestTag } from 'rudder-sdk-js/integrations/PinterestTag/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as PostAffiliatePro } from 'rudder-sdk-js/integrations/PostAffiliatePro/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as PostHog } from 'rudder-sdk-js/integrations/Posthog/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as ProfitWell } from 'rudder-sdk-js/integrations/ProfitWell/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Qualtrics } from 'rudder-sdk-js/integrations/Qualtrics/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as QuantumMetric } from 'rudder-sdk-js/integrations/QuantumMetric/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as RedditPixel } from 'rudder-sdk-js/integrations/RedditPixel/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Sentry } from 'rudder-sdk-js/integrations/Sentry/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as SnapPixel } from 'rudder-sdk-js/integrations/SnapPixel/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as TVSquared } from 'rudder-sdk-js/integrations/TVSquared/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as VWO } from 'rudder-sdk-js/integrations/VWO/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as GA360 } from 'rudder-sdk-js/integrations/GA360/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Adroll } from 'rudder-sdk-js/integrations/Adroll/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as DCMFloodlight } from 'rudder-sdk-js/integrations/DCMFloodlight/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Matomo } from 'rudder-sdk-js/integrations/Matomo/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Vero } from 'rudder-sdk-js/integrations/Vero/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Mouseflow } from 'rudder-sdk-js/integrations/Mouseflow/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Rockerbox } from 'rudder-sdk-js/integrations/Rockerbox/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as ConvertFlow } from 'rudder-sdk-js/integrations/ConvertFlow/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as SnapEngage } from 'rudder-sdk-js/integrations/SnapEngage/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as LiveChat } from 'rudder-sdk-js/integrations/LiveChat/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Shynet } from 'rudder-sdk-js/integrations/Shynet/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Woopra } from 'rudder-sdk-js/integrations/Woopra/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as RollBar } from 'rudder-sdk-js/integrations/RollBar/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as QuoraPixel } from 'rudder-sdk-js/integrations/QuoraPixel/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as June } from 'rudder-sdk-js/integrations/June/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Engage } from 'rudder-sdk-js/integrations/Engage/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Iterable } from 'rudder-sdk-js/integrations/Iterable/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as YandexMetrica } from 'rudder-sdk-js/integrations/YandexMetrica/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Refiner } from 'rudder-sdk-js/integrations/Refiner/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Qualaroo } from 'rudder-sdk-js/integrations/Qualaroo/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Podsights } from 'rudder-sdk-js/integrations/Podsights/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Axeptio } from 'rudder-sdk-js/integrations/Axeptio/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Satismeter } from 'rudder-sdk-js/integrations/Satismeter/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as MicrosoftClarity } from 'rudder-sdk-js/integrations/MicrosoftClarity/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Sendinblue } from 'rudder-sdk-js/integrations/Sendinblue/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Olark } from 'rudder-sdk-js/integrations/Olark/constants';
import { DISPLAY_NAME_TO_DIR_NAME_MAP as Lemnisk } from 'rudder-sdk-js/integrations/Lemnisk/constants';

// map of the destination display names to the destination directory names
// The destination directory name is used as the destination SDK file name in CDN
const destDispNamesToFileNamesMap: Record<string, string> = {
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

export { destDispNamesToFileNamesMap };
