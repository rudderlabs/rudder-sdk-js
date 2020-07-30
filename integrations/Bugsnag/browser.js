import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";

class Bugsnag {
  constructor(config) {
    this.releaseStage = config.releaseStage;
    this.apiKey = config.apiKey;
    this.name = "BUGSNAG";
    this.setIntervalHandler = undefined;
  }

  init() {
    logger.debug("===in init Bugsnag===");
    ScriptLoader(
      "bugsnag-id",
      "https://d2wy8f7a9ursnm.cloudfront.net/v6/bugsnag.min.js"
    );

    this.setIntervalHandler = setInterval(
      this.initBugsnagClient.bind(this),
      1000
    );
  }

  initBugsnagClient() {
    if (window.bugsnag !== undefined) {
      window.bugsnagClient = window.bugsnag(this.apiKey);
      window.bugsnagClient.releaseStage = this.releaseStage;
      clearInterval(this.setIntervalHandler);
    }
  }

  isLoaded() {
    logger.debug("in bugsnag isLoaded");
    return !!window.bugsnagClient;
  }

  isReady() {
    logger.debug("in bugsnag isReady");
    return !!window.bugsnagClient;
  }

  identify(rudderElement) {
    const { traits } = rudderElement.message.context;
    const traitsFinal = {
      id: rudderElement.message.userId || rudderElement.message.anonymousId,
      name: traits.name,
      email: traits.email,
    };

    window.bugsnagClient.user = traitsFinal;
    window.bugsnagClient.notify(new Error("error in identify"));
  }
}
export { Bugsnag };
