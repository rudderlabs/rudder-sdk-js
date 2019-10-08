import * as HubSpot from "./HubSpot";
import * as GA from "./GA";

let integrations = { HS: HubSpot.default, GA: GA.default };

export { integrations };
