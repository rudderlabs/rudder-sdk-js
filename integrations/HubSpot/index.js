import { HubSpotNode } from "./node";
import { HubSpot } from "./browser";

export let hubSpot = process.browser ? { HubSpot } : { HubSpotNode };
