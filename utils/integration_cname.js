import { CNameMapping as AdobeAnalytics } from '../integrations/AdobeAnalytics/constants';
import { CNameMapping as Amplitude } from '../integrations/Amplitude/constants';
import { CNameMapping as Appcues } from '../integrations/Appcues/constants';
import { CNameMapping as BingAds } from '../integrations/BingAds/constants';
import { CNameMapping as Braze } from '../integrations/Braze/constants';
import { CNameMapping as Bugsnag } from '../integrations/Bugsnag/constants';
import { CNameMapping as Chartbeat } from '../integrations/Chartbeat/constants';
import { CNameMapping as Clevertap } from '../integrations/Clevertap/constants';
import { CNameMapping as Comscore } from '../integrations/Comscore/constants';
import { CNameMapping as Criteo } from '../integrations/Criteo/constants';
import { CNameMapping as CustomerIO } from '../integrations/CustomerIO/constants';
import { CNameMapping as Drip } from '../integrations/Drip/constants';
import { CNameMapping as FacebookPixel } from '../integrations/FacebookPixel/constants';
import { CNameMapping as Fullstory } from '../integrations/Fullstory/constants';
import { CNameMapping as GA } from '../integrations/GA/constants';
import { CNameMapping as GA4 } from '../integrations/GA4/constants';
import { CNameMapping as GoogleAds } from '../integrations/GoogleAds/constants';
import { CNameMapping as GoogleOptimize } from '../integrations/GoogleOptimize/constants';
import { CNameMapping as GoogleTagManager } from '../integrations/GoogleTagManager/constants';
import { CNameMapping as Heap } from '../integrations/Heap/constants';
import { CNameMapping as Hotjar } from '../integrations/Hotjar/constants';
import { CNameMapping as HubSpot } from '../integrations/HubSpot/constants';
import { CNameMapping as INTERCOM } from '../integrations/INTERCOM/constants';
import { CNameMapping as Keen } from '../integrations/Keen/constants';
import { CNameMapping as Kissmetrics } from '../integrations/Kissmetrics/constants';
import { CNameMapping as Klaviyo } from '../integrations/Klaviyo/constants';
import { CNameMapping as LaunchDarkly } from '../integrations/LaunchDarkly/constants';
import { CNameMapping as LinkedInInsightTag } from '../integrations/LinkedInInsightTag/constants';
import { CNameMapping as Lotame } from '../integrations/Lotame/constants';
import { CNameMapping as Lytics } from '../integrations/Lytics/constants';
import { CNameMapping as Mixpanel } from '../integrations/Mixpanel/constants';
import { CNameMapping as MoEngage } from '../integrations/MoEngage/constants';
import { CNameMapping as Optimizely } from '../integrations/Optimizely/constants';
import { CNameMapping as Pendo } from '../integrations/Pendo/constants';
import { CNameMapping as PinterestTag } from '../integrations/PinterestTag/constants';
import { CNameMapping as PostAffiliatePro } from '../integrations/PostAffiliatePro/constants';
import { CNameMapping as Posthog } from '../integrations/Posthog/constants';
import { CNameMapping as ProfitWell } from '../integrations/ProfitWell/constants';
import { CNameMapping as Qualtrics } from '../integrations/Qualtrics/constants';
import { CNameMapping as QuantumMetric } from '../integrations/QuantumMetric/constants';
import { CNameMapping as RedditPixel } from '../integrations/RedditPixel/constants';
import { CNameMapping as Sentry } from '../integrations/Sentry/constants';
import { CNameMapping as SnapPixel } from '../integrations/SnapPixel/constants';
import { CNameMapping as TVSquared } from '../integrations/TVSquared/constants';
import { CNameMapping as VWO } from '../integrations/VWO/constants';
import { CNameMapping as GA360 } from '../integrations/GA360/constants';
import { CNameMapping as Adroll } from '../integrations/Adroll/constants';
import { CNameMapping as DCMFloodlight } from '../integrations/DCMFloodlight/constants';
import { CNameMapping as Matomo } from '../integrations/Matomo/constants';
import { CNameMapping as Vero } from '../integrations/Vero/constants';
import { CNameMapping as Mouseflow } from '../integrations/Mouseflow/constants';
import { CNameMapping as Rockerbox } from '../integrations/Rockerbox/constants';

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
  ...Chartbeat,
  ...Clevertap,
  ...Comscore,
  ...Criteo,
  ...CustomerIO,
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
  ...Mixpanel,
  ...MoEngage,
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
};

export { commonNames };
