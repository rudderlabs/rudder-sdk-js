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

// for sdk side native integration identification
// add a mapping from common names to index.js exported key names as identified by Rudder
const commonNames = {
  All: "All",
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
  "Visual Website Optimizer": "VWO",
  VWO: "VWO",
  OPTIMIZELY: "OPTIMIZELY",
  Optimizely: "OPTIMIZELY",
  TVSQUARED: "TVSQUARED",
  TVSquared: "TVSQUARED",
  MoEngage: "MOENGAGE",
  MOENGAGE: "MOENGAGE",
  Pendo: "PENDO",
  PENDO: "PENDO",
  POSTHOG: "POSTHOG",
  PostHog: "POSTHOG",
  Posthog: "POSTHOG",
  PinterestTag: "PINTEREST_TAG",
  Pinterest_Tag: "PINTEREST_TAG",
  PINTERESTTAG: "PINTEREST_TAG",
  PINTEREST_TAG: "PINTEREST_TAG",
  pinterest: "PINTEREST_TAG",
  PinterestAds: "PINTEREST_TAG",
  Pinterest_Ads: "PINTEREST_TAG",
  Pinterest: "PINTEREST_TAG",
  Reddit_Pixel: "REDDIT_PIXEL",
  REDDIT_PIXEL: "REDDIT_PIXEL",
  RedditPixel: "REDDIT_PIXEL",
  REDDITPIXEL: "REDDIT_PIXEL",
  redditpixel: "REDDIT_PIXEL",
  "Reddit Pixel": "REDDIT_PIXEL",
  "REDDIT PIXEL": "REDDIT_PIXEL",
  "reddit pixel": "REDDIT_PIXEL",
  MIXPANEL: "MP",
  Mixpanel: "MP",
  MP: "MP",
  Qualtrics: "QUALTRICS",
  qualtrics: "QUALTRICS",
  QUALTRICS: "QUALTRICS",
  Snap_Pixel: "SNAP_PIXEL",
  SnapPixel: "SNAP_PIXEL",
  SNAPPIXEL: "SNAP_PIXEL",
  snappixel: "SNAP_PIXEL",
  SNAP_PIXEL: "SNAP_PIXEL",
  "Snap Pixel": "SNAP_PIXEL",
  "SNAP PIXEL": "SNAP_PIXEL",
  "snap pixel": "SNAP_PIXEL",
  PROFITWELL: "PROFITWELL",
  ProfitWell: "PROFITWELL",
  profitwell: "PROFITWELL",
  SENTRY: "SENTRY",
  sentry: "SENTRY",
  Sentry: "SENTRY",
  "Quantum Metric": "QUANTUMMETRIC",
  QuantumMetric: "QUANTUMMETRIC",
  quantumMetric: "QUANTUMMETRIC",
  quantummetric: "QUANTUMMETRIC",
  Quantum_Metric: "QUANTUMMETRIC",
  QUANTUMMETRIC: "QUANTUMMETRIC",
  PostAffiliatePro: "POST_AFFILIATE_PRO",
  Post_affiliate_pro: "POST_AFFILIATE_PRO",
  "Post Affiliate Pro": "POST_AFFILIATE_PRO",
  postaffiliatepro: "POST_AFFILIATE_PRO",
  POSTAFFILIATEPRO: "POST_AFFILIATE_PRO",
  POST_AFFILIATE_PRO: "POST_AFFILIATE_PRO",
};

export { commonNames };
