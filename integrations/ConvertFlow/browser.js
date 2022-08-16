/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { NAME } from "./constants";
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import { getHashFromArray } from "../utils/commonUtils";
import makeACall from "./utils";

class ConvertFlow {
  constructor(config) {
    this.websiteId = config.websiteId;
    this.toggleToSendData = config.toggleToSendData;
    this.eventsList = config.eventsList;
    this.eventsMappping = config.eventsMappping;
    this.blacklistedEvents = config.blacklistedEvents;
    this.whitelistedEvents = config.whitelistedEvents;
    this.oneTrustCookieCategories = config.oneTrustCookieCategories;
    this.eventFilteringOption = config.eventFilteringOption;
    this.name = NAME;
  }

  init() {
    logger.debug("===In init convertflow===");
    ScriptLoader(
      "convertflow-integration",
      `https://js.convertflow.co/production/websites/${this.websiteId}.js`
    );
    if (this.toggleToSendData) {
      this.trigger();
    }
  }

  isLoaded() {
    logger.debug("===In isLoaded convertflow===");
    return !!window.convertflow && typeof window.convertflow === "object";
  }

  isReady() {
    logger.debug("===In isReady convertflow===");
    return !!window.convertflow;
  }

  // identify call to Convertflow
  identify(rudderElement) {
    logger.debug("===In convertflow Identify===");
    const { message } = rudderElement;
    const email = message.context.traits?.email || message.traits?.email;
    if (email) {
      const payload = { email, override: true };
      window.convertflow.identify(payload);
    }
  }

  trigger() {
    const standardEventsMap = getHashFromArray(this.eventsMappping);
    const standardEventsList = [
      "cfReady",
      "cfView",
      "cfConversion",
      "cfCompletion",
      "cfSubmit",
      "cfAddToCart",
      "cfClosed",
    ];
    standardEventsList.forEach((events) => {
      window.addEventListener(events, function (event, data) {
        if (this.eventsList.includes(events)) {
          makeACall(standardEventsMap, events, data);
        }
      });
    });
  }
}

export default ConvertFlow;
