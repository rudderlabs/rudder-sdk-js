/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import logger from "../../utils/logUtil";

// import { NAME } from "./constants";
import { recordingLiveChatEvents } from "./util";
import { getHashFromArrayWithDuplicate } from "../utils/commonUtils";
// import { LOAD_ORIGIN } from "../ScriptLoader";

class SnapEngage {
  constructor(config) {
    this.widgetId = config.widgetId;
    this.recordLiveChatEvents = config.recordLiveChatEvents;
    this.eventsToStandard = config.eventsToStandard;
    this.updateEventNames = config.updateEventNames;
  }

  loadScript() {
    window._paq = window._paq || [];
    (function (widgetId) {
      const se = document.createElement("script");
      se.type = "text/javascript";
      se.async = true;
      se.src = `https://storage.googleapis.com/code.snapengage.com/js/${widgetId}.js`;
      let done = false;
      se.onload = se.onreadystatechange = function () {
        if (
          !done &&
          (!this.readyState ||
            this.readyState === "loaded" ||
            this.readyState === "complete")
        ) {
          done = true;
          /* Place your SnapEngage JS API code below */
          /* SnapEngage.allowChatSound(true); Example JS API: Enable sounds for Visitors. */
        }
      };
      const s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(se, s);
    })(this.widgetId);
  }

  init() {
    logger.debug("===In init SnapEngage===");
    this.loadScript();
  }

  isLoaded() {
    logger.debug("===In isLoaded SnapEngage===");
    return !!(window._paq && window._paq.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug("===In isReady SnapEngage===");

    // Dasboard Other Settings
    if (this.recordLiveChatEvents) {
      const standardEventsMap = getHashFromArrayWithDuplicate(
        this.eventsToStandard
      );
      recordingLiveChatEvents(this.updateEventNames, standardEventsMap);
    }

    return false;
  }

  identify(rudderElement) {
    logger.debug("===In SnapEngage Identify===");
    const { message } = rudderElement;
    const email =
      get(message, "context.traits.email") || get(message, "traits.email");

    if (!email) {
      logger.error("User parameter (email) is required for identify call");
      return;
    }
    window.SnapEngage.setUserEmail(email);

    const name =
      get(message, "context.traits.name") || get(message, "traits.name");

    window.SnapEngage.setUserName(name);
  }
}

export default SnapEngage;
