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

let integrations = {
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
  COMSCORE: Comscore.default
};

export { integrations };
