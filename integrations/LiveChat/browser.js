/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import logger from "../../utils/logUtil";

import { recordingLiveChatEvents } from "./util";
import { getHashFromArray } from "../utils/commonUtils";
import { isObject } from "../../utils/utils";
import ScriptLoader from "../ScriptLoader";

class LiveChat {
  constructor(config) {
    this.licenseId = config.licenseId;
    this.recordLiveChatEvents = config.recordLiveChatEvents;
    this.eventsToStandard = config.eventsToStandard;
    this.updateEventNames = config.updateEventNames;
  }

  init() {
    logger.debug("===In init LiveChat===");
    ScriptLoader(
      "livechat-integration",
      `https://cdn.livechatinc.com/tracking.js`
    );
  }

  init() {
    logger.debug("===In init LiveChat===");
    this.loadScript();
  }

  isLoaded() {
    logger.debug("===In isLoaded LiveChat===");
    return !!(window.LiveChat && isObject(window.LiveChat));
  }

  isReady() {
    logger.debug("===In isReady SnapEngage===");

    // Dasboard Other Settings
    if (this.recordLiveChatEvents) {
      const standardEventsMap = getHashFromArray(this.eventsToStandard);

      recordingLiveChatEvents(this.updateEventNames, standardEventsMap);
    }
    return !!window.LiveChat;
  }

  identify(rudderElement) {
    logger.debug("===In LiveChat Identify===");
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
}

export default LiveChat;
