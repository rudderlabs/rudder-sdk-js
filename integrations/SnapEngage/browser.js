/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import each from "@ndhoule/each";
import get from "get-value";
import logger from "../../utils/logUtil";

// import { NAME } from "./constants";
import { integrationContext } from "./util";
import { getHashFromArray } from "../utils/commonUtils";
// import { LOAD_ORIGIN } from "../ScriptLoader";

class SnapEngage {
  constructor(config) {
    this.widgetId = config.widgetId;
    this.recordLiveChatEvents = config.recordLiveChatEvents;
    this.eventsToStandard = config.eventsToStandard;
    this.updateEventNames = config.updateEventNames;
  }

  loadScript() {
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
    return !!window.SnapEngage;
  }

  isReady() {
    logger.debug("===In isReady SnapEngage===");

    // Dasboard Other Settings
    if (this.recordLiveChatEvents) {
      const standardEventsMap = getHashFromArray(this.eventsToStandard);
      if (
        Object.keys(standardEventsMap).length === 0 &&
        standardEventsMap.constructor === Object
      ) {
        this.recordingLiveChatEvents();
      } else {
        this.recordingLiveChatEventsWithMapping(
          this.updateEventNames,
          standardEventsMap
        );
      }
    }
    return !!window.SnapEngage;
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

    if (name) {
      window.SnapEngage.setUserName(name);
    }
  }

  recordingLiveChatEvents() {
    window.SnapEngage.setCallback("StartChat", function () {
      window.rudderanalytics.track(
        "Live Chat Conversation Started",
        {},
        { context: { integration: integrationContext } }
      );
    });

    window.SnapEngage.setCallback("ChatMessageReceived", function (agent) {
      window.rudderanalytics.track(
        "Live Chat Message Received",
        { agentUsername: agent },
        { context: { integration: integrationContext } }
      );
    });

    window.SnapEngage.setCallback("ChatMessageSent", function () {
      window.rudderanalytics.track(
        "Live Chat Message Sent",
        {},
        { context: { integration: integrationContext } }
      );
    });

    window.SnapEngage.setCallback("Close", function () {
      window.rudderanalytics.track(
        "Live Chat Conversation Ended",
        {},
        { context: { integration: integrationContext } }
      );
    });

    window.SnapEngage.setCallback("InlineButtonClicked", function () {
      window.rudderanalytics.track(
        "Inline Button Clicked",
        {},
        { context: { integration: integrationContext } }
      );
    });
  }

  recordingLiveChatEventsWithMapping(updateEventNames, standardEventsMap) {
    each((val, key) => {
      window.SnapEngage.setCallback("StartChat", function () {
        let eventName = "Live Chat Conversation Started";
        if (updateEventNames && val === "startChat") {
          eventName = key;
        }
        window.rudderanalytics.track(
          `${eventName}`,
          {},
          { context: { integration: integrationContext } }
        );
      });

      window.SnapEngage.setCallback("ChatMessageReceived", function (agent) {
        let eventName = "Live Chat Message Received";
        if (updateEventNames && val === "chatMessageReceived") {
          eventName = key;
        }
        window.rudderanalytics.track(
          `${eventName}`,
          { agentUsername: agent },
          { context: { integration: integrationContext } }
        );
      });

      window.SnapEngage.setCallback("ChatMessageSent", function () {
        let eventName = "Live Chat Message Sent";
        if (updateEventNames && val === "chatMessageSent") {
          eventName = key;
        }
        window.rudderanalytics.track(
          `${eventName}`,
          {},
          { context: { integration: integrationContext } }
        );
      });

      window.SnapEngage.setCallback("Close", function () {
        let eventName = "Live Chat Conversation Ended";
        if (updateEventNames && val === "close") {
          eventName = key;
        }
        window.rudderanalytics.track(
          `${eventName}`,
          {},
          { context: { integration: integrationContext } }
        );
      });

      window.SnapEngage.setCallback("InlineButtonClicked", function () {
        let eventName = "Inline Button Clicked";
        if (updateEventNames && val === "inlineButtonClicked") {
          eventName = key;
        }
        window.rudderanalytics.track(
          `${eventName}`,
          {},
          { context: { integration: integrationContext } }
        );
      });
    }, standardEventsMap);
  }
}

export default SnapEngage;
