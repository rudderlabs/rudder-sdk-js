/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import { NAME } from "./constants";

class LinkedInInsightTag {
  constructor(config, analytics, areTransformationsConnected, destinationId) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.partnerId = config.partnerId;
    this.areTransformationsConnected = areTransformationsConnected;
    this.destinationId = destinationId;
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
}
export default LinkedInInsightTag;
