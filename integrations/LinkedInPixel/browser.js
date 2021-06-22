import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
class LinkedInPixel{
    constructor(config){
        this.name="LINKEDINPIXEL";
        this.partnerId=config.partnerId;
    }
    init() {
        logger.debug("===in init LinkedIn Pixel===");
        ScriptLoader(
            "LinkedIn Pixel",
            'https://snap.licdn.com/li.lms-analytics/insight.min.js'
        );
        if (!this.partnerId) return;
        window._linkedin_data_partner_id = this.partnerId;
    }
    isLoaded() {
        logger.debug("=== in isLoaded LinkedIn Pixel===");
        return  !!window._linkedin_data_partner_id;
    }
    isReady() {
        logger.debug("=== in isReady LinkedIn Pixel===")
        return !!window._linkedin_data_partner_id;
    }
}
export default LinkedInPixel;