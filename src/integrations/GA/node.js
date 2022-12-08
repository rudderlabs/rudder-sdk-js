import logger from "../../utils/logUtil";

let ua;
if (!process.browser) {
  ua = require("universal-analytics");
}

class GANode {
  constructor(trackingID) {
    this.trackingID = trackingID;
    this.client = "";
  }

  init() {
    logger.debug("===in GA Node init===");

    // this.client = ua(this.trackingID, "6a14abda-6b12-4578-bf66-43c754eaeda9");
  }

  identify(rudderElement) {
    logger.debug("=== in GA Node identify===");
    this.client = ua(this.trackingID, rudderElement.message.userId);
  }

  track(rudderElement) {
    logger.debug("=== in GA Node track===");
    this.client.event(
      rudderElement.message.type,
      rudderElement.message.event,
      function (err) {
        // Handle the error if necessary.
        // In case no error is provided you can be sure
        // the request was successfully sent off to Google.
        logger.debug(`error sending to GA${err}`);
      }
    );
  }

  page(rudderElement) {
    logger.debug("=== in GA Node page===");
    if (
      rudderElement.message.properties &&
      rudderElement.message.properties.path
    ) {
      this.client.pageview(rudderElement.message.properties.path, function (
        err
      ) {
        // Handle the error if necessary.
        // In case no error is provided you can be sure
        // the request was successfully sent off to Google.
        logger.debug(`error sending to GA${err}`);
      });
      // this.client.pageview(rudderElement.message.properties.path).send();
    }
  }

  loaded() {
    logger.debug("in GA isLoaded");
    logger.debug("node not supported");
  }
}

export { GANode };
