import * as HubSpot from "./HubSpot";
import * as GA from "./GA";
import * as Hotjar from "./Hotjar";
import * as GoogleAds from "./GoogleAds";
import * as VWO from "./VWO";
import * as GoogleTagManager from "./GoogleTagManager";
import * as INTERCOM from "./INTERCOM";

let integrations = {
  HS: HubSpot.default,
  GA: GA.default,
  HOTJAR: Hotjar.default,
  GOOGLEADS: GoogleAds.default,
  VWO: VWO.default,
  GTM: GoogleTagManager.default,
  INTERCOM: INTERCOM.default
};

export { integrations };
