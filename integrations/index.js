import * as Amplitude from "./Amplitude";
import * as Appcues from "./Appcues";
import * as Braze from "./Braze";
import * as Bugsnag from "./Bugsnag";
import * as Chartbeat from "./Chartbeat";
import * as Comscore from "./Comscore";
import * as CustomerIO from "./CustomerIO";
import * as FBPixel from "./FacebookPixel";
import * as Fullstory from "./Fullstory";
import * as GA from "./GA";
import * as GA360 from "./GA360";
import * as GA4 from "./GA4";
import * as GoogleAds from "./GoogleAds";
import * as GoogleTagManager from "./GoogleTagManager";
import * as Hotjar from "./Hotjar";
import * as HubSpot from "./HubSpot";
import * as INTERCOM from "./INTERCOM";
import * as Keen from "./Keen";
import * as Kissmetrics from "./Kissmetrics";
import * as Lotame from "./Lotame";
import * as Lytics from "./Lytics";
import * as MoEngage from "./MoEngage";
import * as Optimizely from "./Optimizely";
import * as Pendo from "./Pendo";
import * as Posthog from "./Posthog";
import * as TVSquared from "./TVSquared";
import * as VWO from "./VWO";

// the key names should match the destination.name value to keep partity everywhere
// (config-plan name, native destination.name , exported integration name(this one below))
const integrations = {
  AM: Amplitude.default,
  APPCUES: Appcues.default,
  BRAZE: Braze.default,
  BUGSNAG: Bugsnag.default,
  CHARTBEAT: Chartbeat.default,
  COMSCORE: Comscore.default,
  CUSTOMERIO: CustomerIO.default,
  FACEBOOK_PIXEL: FBPixel.default,
  FULLSTORY: Fullstory.default,
  GA360: GA360.default,
  GA4: GA4.default,
  GA: GA.default,
  GOOGLEADS: GoogleAds.default,
  GTM: GoogleTagManager.default,
  HOTJAR: Hotjar.default,
  HS: HubSpot.default,
  INTERCOM: INTERCOM.default,
  KEEN: Keen.default,
  KISSMETRICS: Kissmetrics.default,
  LOTAME: Lotame.default,
  LYTICS: Lytics.default,
  MOENGAGE: MoEngage.default,
  OPTIMIZELY: Optimizely.default,
  PENDO: Pendo.default,
  POSTHOG: Posthog.default,
  TVSQUARED: TVSquared.default,
  VWO: VWO.default
};

export { integrations };
