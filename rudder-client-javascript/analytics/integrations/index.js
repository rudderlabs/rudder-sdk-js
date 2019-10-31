import * as HubSpot from "./HubSpot";
import * as GA from "./GA";
import * as Hotjar from "./Hotjar";

let integrations = { HS: HubSpot.default, GA: GA.default, HOTJAR: Hotjar.default };

export { integrations };
