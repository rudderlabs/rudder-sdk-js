import { HubspotAnalyticsManager } from "../integration-old/HubSpot";

class AnalyticsManager {
  initializeHubSpot(hubId, wrappers) {
    if (typeof window !== undefined) {
      /* $.ajax({
          async: false,
          url: "/integration/HubSpot.js",
          dataType: "script"
        }); */
      // var _hub = new HubspotAnalyticsManager(hubId).init();
      // var HubspotAnalyticsManager = require("./../integration/Hubspot.js");
      const _hub = new HubspotAnalyticsManager(hubId).init();
      if (_hub) {
        console.log("===_hub===", _hub);
        wrappers.push(_hub);
        console.log("Hubspot loaded!");
      }
      console.log("Script loaded in sync");
    }
  }
}
export { AnalyticsManager };
