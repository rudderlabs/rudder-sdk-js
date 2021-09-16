/* eslint-disable no-unused-expressions */

import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";


class Sentry {
  constructor(config) {
    this.name = "Sentry";
    this.dsn = config.dsn;
    this.debugMode = config.debugMode;
    this.environment = config.environment;
    this.ignoreErrors = config.ignoreErrors;
    this.includePaths = config.includePaths;
    this.logger = config.Logger;
    this.allowUrls = config.allowUrls;
    this.denyUrls = config.denyUrls;
    this.release = config.release;
    this.serverName = config.serverName;
  }

  init() {
    logger.debug("===in init Sentry===");
    if (!this.dsn) {
      logger.debug("DSN is a mandatory field");
      return;
    }
    ScriptLoader(
        "Sentry",
        `https://browser.sentry-cdn.com/6.12.0/bundle.min.js`
      );
    integrity="sha384-S3qfdh3AsT1UN84WIYNuOX9vVOoFg3nB17Jp5/pTFGDBGBt+dtz7MGAV845efkZr"
    crossorigin="anonymous"

    window.Sentry = {
        dsn: this.dsn,
        debug: this.debugMode,
        environment: this.environment,
        release: this.release,
        serverName: this.serverName,
        allowUrls:this.allowUrls,
        denyUrls: this.denyUrls,
        ignoreErrors: this.ignoreErrors,
        includePaths: this.includePaths,
    }
    
  }

  // eslint-disable-next-line class-methods-use-this
  isLoaded() {
    logger.debug("===in Sentry isLoaded===");
    return !!(window.Sentry && window.Sentry.push !== Array.prototype.push);
  }

  // eslint-disable-next-line class-methods-use-this
  isReady() {
    logger.debug("===in Sentry isReady===");
    return !!(window.criteo_q && window.Sentry.push !== Array.prototype.push);
  }

  Identify(rudderElement) {
    const { traits } = rudderElement.message;
    const { userId, email, name } = getDefinedTraits(message); // userId sent as id and username sent as name
    const ip_address = get (message,"traits.ip_address") || get (message,"context.traits.ip_address");
    const userIdentificationProperty = ["userId", "email" , "name", "ip_address"]

    if( ! userId && ! email && ! name && ! ip_address ) { // if no user identification property is present the event will be dropped
        return;
    }
    const userIdentifierPayload = {};
    if (userId) {
        userIdentifierPayload.id = userId;
    }
    if(email) {
        userIdentifierPayload.email = email;
    }
    if(name) {
        userIdentifierPayload.username = name;
    }
    if(ip_address) {
        userIdentifierPayload.ip_address = ip_address;
    }

    const finalPayload = {
        ... userIdentifierPayload,
        ...traits
    }
    window.Sentry.setUser(finalPayload);


  }
}
export default Sentry;
