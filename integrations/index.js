import * as HubSpot from "./HubSpot";
import * as GA from "./GA";
import * as Hotjar from "./Hotjar";
import * as GoogleAds from "./GoogleAds";
import * as VWO from "./VWO";
import * as GoogleTagManager from "./GoogleTagManager";
import * as Braze from "./Braze";
import * as INTERCOM from "./INTERCOM";
import * as Keen from "./Keen";
import * as Kissmetrics from "./Kissmetrics";
import * as CustomerIO from "./CustomerIO";
import * as Chartbeat from "./Chartbeat";
import * as Comscore from "./Comscore";
import * as FBPixel from "./FacebookPixel";
import * as Lotame from "./Lotame";
import * as Optimizely from "./Optimizely";
import * as Bugsnag from "./Bugsnag";
import * as Fullstory from "./Fullstory";
import * as TVSquared from "./TVSquared";
import * as GA4 from "./GA4";
import * as MoEngage from "./MoEngage";
import * as Amplitude from "./Amplitude";
import * as Pendo from "./Pendo";
import * as Lytics from "./Lytics";
import * as Appcues from "./Appcues";
import * as Posthog from "./Posthog";

// the key names should match the destination.name value to keep partity everywhere
// (config-plan name, native destination.name , exported integration name(this one below))

const integrations = {
  HS: HubSpot.default,
  GA: GA.default,
  HOTJAR: Hotjar.default,
  GOOGLEADS: GoogleAds.default,
  VWO: VWO.default,
  GTM: GoogleTagManager.default,
  BRAZE: Braze.default,
  INTERCOM: INTERCOM.default,
  KEEN: Keen.default,
  KISSMETRICS: Kissmetrics.default,
  CUSTOMERIO: CustomerIO.default,
  CHARTBEAT: Chartbeat.default,
  COMSCORE: Comscore.default,
  FACEBOOK_PIXEL: FBPixel.default,
  LOTAME: Lotame.default,
  OPTIMIZELY: Optimizely.default,
  BUGSNAG: Bugsnag.default,
  FULLSTORY: Fullstory.default,
  TVSQUARED: TVSquared.default,
  GA4: GA4.default,
  MOENGAGE: MoEngage.default,
  AM: Amplitude.default,
  PENDO: Pendo.default,
  LYTICS: Lytics.default,
  APPCUES: Appcues.default,
  POSTHOG: Posthog.default
};

export { integrations };
