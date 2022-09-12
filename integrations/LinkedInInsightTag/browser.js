/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import { getHashFromArray } from "../utils/commonUtils";
import { NAME } from "./constants";

class LinkedInInsightTag {
  constructor(config) {
    this.name = NAME;
    this.partnerId = config.partnerId;
    this.eventConversionId = config.eventConversionId;
  }

  init() {
    logger.debug("===in init LinkedIn Insight Tag===");
    ScriptLoader(
      "LinkedIn Insight Tag",
      "https://snap.licdn.com/li.lms-analytics/insight.min.js"
    );
    if (!this.partnerId) {
      return;
    }
    if (this.eventConversionId === undefined) {
      this.eventConversionId = [];
    }
    window._linkedin_data_partner_id = this.partnerId;
  }

  isLoaded() {
    logger.debug("=== in isLoaded LinkedIn Insight Tag===");
    return !!window._linkedin_data_partner_id;
  }

  isReady() {
    logger.debug("=== in isReady LinkedIn Insight Tag===");
    return !!window._linkedin_data_partner_id;
  }

  track(rudderElement) {
    logger.debug("===In LinkedIn Insight Tag Track===");
    const { message } = rudderElement;
    const { event } = message;
    if (!event) {
      logger.error(
        "[LinkedIn Insight Tag]: Event name is missing for track call!!==="
      );
      return;
    }
    const trimmedEvent = event.trim();
    const eventMapping = getHashFromArray(
      this.eventConversionId,
      "from",
      "to",
      false
    );
    if (!eventMapping[trimmedEvent]) {
      logger.error(
        `Event ${trimmedEvent} doesn't matches with LinkedIn Insight Tag!!===`
      );
      return;
    }
    window.lintrk("track", { conversion_id: eventMapping[trimmedEvent] });
  }
}

export default LinkedInInsightTag;
