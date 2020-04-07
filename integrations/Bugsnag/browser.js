import logger from "../../utils/logUtil";
import { ScriptLoader } from "../ScriptLoader";
import {
  MAX_WAIT_FOR_INTEGRATION_LOAD,
  INTEGRATION_LOAD_CHECK_INTERVAL
} from "../../utils/constants";

class Bugsnag {
    constructor(config) {
      this.apiKey = config.apiKey;
      this.name = "BUGSNAG";
      logger.debug("Config ", config);
    }



init() {
    logger.debug("===in init Bugsnag===");
    console.log("===in init Bugsnag===");
    // let src = "//d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js";
    // let js = document.createElement("script");
    // js.src = src;
    // js.type = "text/javascript";
    // js.id="bugsnag";
    // var inlineScript = document.createTextNode("window.bugsnagClient = bugsnag('"+this.apiKey+"')");
    // js.appendChild(inlineScript);
    // let e = document.getElementsByTagName("script")[0];
    // logger.debug("==script==", e);
    // console.log("==script==", js)
    // e.parentNode.insertBefore(js, e);
    // console.log("==script 2==", e)
    ScriptLoader("bugsnag","//d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js")
    window.Bugsnag = [];
        window.Bugsnag.apiKey = this.apiKey;
        window.Bugsnag.ssl = this.ssl;
        window.Bugsnag.releaseStage = this.releaseStage;
       // window.bugsnagClient = window.Bugsnag;
   
      }

isLoaded() {
    logger.debug("in bugsnag isLoaded");
    console.log(window.Bugsnag);
    return !!window.Bugsnag;

      }

isReady() {
    logger.debug("in bugsnag isReady");
    console.log(window.Bugsnag);
    return !!window.Bugsnag;

}

identify(rudderElement) {
 
    let traits = rudderElement.message.context.traits;
    let traitsFinal = {
        id: rudderElement.message.userId,
        name: traits.name,
        email: traits.email

    }
    console.log(traitsFinal);
    window.Bugsnag.user = traitsFinal;
    
 


}



}
export { Bugsnag };
