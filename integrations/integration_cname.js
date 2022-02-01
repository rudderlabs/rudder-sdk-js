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
  "Google Ads": "GOOGLEADS",
  GoogleAds: "GOOGLEADS",
  GOOGLEADS: "GOOGLEADS",
  "Google Tag Manager": "GTM",
  GTM: "GTM",
  Hotjar: "HOTJAR",
  hotjar: "HOTJAR",
  HOTJAR: "HOTJAR",
  Hubspot: "HS",
  HUBSPOT: "HS",
  HS: "HS",
  Intercom: "INTERCOM",
  INTERCOM: "INTERCOM",
  Keen: "KEEN",
  "Keen.io": "KEEN",
  KEEN: "KEEN",
  Kissmetrics: "KISSMETRICS",
  KISSMETRICS: "KISSMETRICS",
  Lotame: "LOTAME",
  LOTAME: "LOTAME",
  "Visual Website Optimizer": "VWO",
  VWO: "VWO",
  OPTIMIZELY: "OPTIMIZELY",
  Optimizely: "OPTIMIZELY",
  TVSQUARED: "TVSQUARED",
  TVSquared: "TVSQUARED",
  "Google Analytics 4": "GA4",
  GoogleAnalytics4: "GA4",
  GA4: "GA4",
  MoEngage: "MOENGAGE",
  MOENGAGE: "MOENGAGE",
  AM: "AM",
  AMPLITUDE: "AM",
  Amplitude: "AM",
  Pendo: "PENDO",
  PENDO: "PENDO",
  Lytics: "LYTICS",
  LYTICS: "LYTICS",
  Appcues: "APPCUES",
  APPCUES: "APPCUES",
  POSTHOG: "POSTHOG",
  PostHog: "POSTHOG",
  Posthog: "POSTHOG",
  KLAVIYO: "KLAVIYO",
  Klaviyo: "KLAVIYO",
  PinterestTag: "PINTEREST_TAG",
  Pinterest_Tag: "PINTEREST_TAG",
  PINTERESTTAG: "PINTEREST_TAG",
  PINTEREST_TAG: "PINTEREST_TAG",
  pinterest: "PINTEREST_TAG",
  PinterestAds: "PINTEREST_TAG",
  Pinterest_Ads: "PINTEREST_TAG",
  Pinterest: "PINTEREST_TAG",
  "LinkedIn Insight Tag": "LINKEDIN_INSIGHT_TAG",
  LINKEDIN_INSIGHT_TAG: "LINKEDIN_INSIGHT_TAG",
  Linkedin_insight_tag: "LINKEDIN_INSIGHT_TAG",
  LinkedinInsighttag: "LINKEDIN_INSIGHT_TAG",
  LinkedinInsightTag: "LINKEDIN_INSIGHT_TAG",
  LinkedInInsightTag: "LINKEDIN_INSIGHT_TAG",
  Linkedininsighttag: "LINKEDIN_INSIGHT_TAG",
  LINKEDININSIGHTTAG: "LINKEDIN_INSIGHT_TAG",
  Reddit_Pixel: "REDDIT_PIXEL",
  REDDIT_PIXEL: "REDDIT_PIXEL",
  RedditPixel: "REDDIT_PIXEL",
  REDDITPIXEL: "REDDIT_PIXEL",
  redditpixel: "REDDIT_PIXEL",
  "Reddit Pixel": "REDDIT_PIXEL",
  "REDDIT PIXEL": "REDDIT_PIXEL",
  "reddit pixel": "REDDIT_PIXEL",
  Heap: "HEAP",
  heap: "HEAP",
  "Heap.io": "HEAP",
  HEAP: "HEAP",
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
  "Google Optimize": "GOOGLE_OPTIMIZE",
  GOOGLE_OPTIMIZE: "GOOGLE_OPTIMIZE",
  GoogleOptimize: "GOOGLE_OPTIMIZE",
  Googleoptimize: "GOOGLE_OPTIMIZE",
  GOOGLEOPTIMIZE: "GOOGLE_OPTIMIZE",
  PostAffiliatePro: "POST_AFFILIATE_PRO",
  Post_affiliate_pro: "POST_AFFILIATE_PRO",
  "Post Affiliate Pro": "POST_AFFILIATE_PRO",
  postaffiliatepro: "POST_AFFILIATE_PRO",
  POSTAFFILIATEPRO: "POST_AFFILIATE_PRO",
  POST_AFFILIATE_PRO: "POST_AFFILIATE_PRO",
  LaunchDarkly: "LAUNCHDARKLY",
  Launch_Darkly: "LAUNCHDARKLY",
  LAUNCHDARKLY: "LAUNCHDARKLY",
  "Launch Darkly": "LAUNCHDARKLY",
  launchDarkly: "LAUNCHDARKLY",
};

export { commonNames };
