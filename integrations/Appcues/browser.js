import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class Appcues {
  constructor(config) {
    this.accountId = config.accountId;
    this.apiKey = config.apiKey;
    this.name = "APPCUES";
    console.log(this.accountId);
  }

  init() {
    logger.debug("===in init Appcues===");
    ScriptLoader(
      "appcues-id",
      `https:////fast.appcues.com/${this.accountId}.js`
    );
  }

  isLoaded() {
    logger.debug("in appcues isLoaded");
    return !!window.Appcues;
  }

  isReady() {
    logger.debug("in appcues isReady");
    return !!window.Appcues;
  }

  identify(rudderElement) {
    const { traits } = rudderElement.message.context;
    const { userId } = rudderElement.message;
    if(userId)
    {
     window.Appcues.identify(userId,traits);
    }
  }

  track(rudderElement) {
    const eventName = rudderElement.message.event;
    let { properties } = rudderElement.message;
    if(eventName)
    {
        window.Appcues.track(eventName,properties);
    }
}

  page(rudderElement) {
    const { userId } = rudderElement.message;
    const eventName = rudderElement.message.name;
    let { properties } = rudderElement.message;
}
}
export { Appcues }; 