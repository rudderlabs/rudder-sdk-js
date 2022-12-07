import { HubSpotNode } from "./node";
import { HubSpot } from "./browser";

export default process.browser ? HubSpot : HubSpotNode;
