import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
class LinkedInInsightTag{
    constructor(config){
        this.name="LINKEDIN_INSIGHT_TAG";
        this.partnerId=config.partnerId;
    }
    init() {
        logger.debug("===in init LinkedIn Insight Tag===");
        ScriptLoader(
            "LinkedIn Insight Tag",
            'https://snap.licdn.com/li.lms-analytics/insight.min.js'
        );
        if (!this.partnerId) return;
        window._linkedin_data_partner_id = this.partnerId;
    }
    isLoaded() {
        logger.debug("=== in isLoaded LinkedIn Insight Tag===");
        return  !!window._linkedin_data_partner_id;
    }
    isReady() {
        logger.debug("=== in isReady LinkedIn Insight Tag===")
        return !!window._linkedin_data_partner_id;
    }
}
export default LinkedInInsightTag;