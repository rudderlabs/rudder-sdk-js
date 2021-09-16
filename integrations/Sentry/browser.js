/* eslint-disable no-unused-expressions */

import logger from "../../utils/logUtil";
import {SentryScriptLoader, identifierPayloadBuilder} from "./utils";
import {getDefinedTraits} from "../../utils/utils";


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
    SentryScriptLoader(
        "Sentry",
        `https://browser.sentry-cdn.com/6.12.0/bundle.min.js`
      );

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
    return !!(window.Sentry && window.Sentry.setUser !== Array.prototype.push);
  }

  // eslint-disable-next-line class-methods-use-this
  isReady() {
    logger.debug("===in Sentry isReady===");
    return !!(window.Sentry && window.Sentry.setUser !== Array.prototype.push);
  }

  identify(rudderElement) {
    const { traits } = rudderElement.message;
    const { userId, email, name } = getDefinedTraits(rudderElement.message); // userId sent as id and username sent as name
    const ip_address = get (message,"traits.ip_address") || get (message,"context.traits.ip_address");
    

    if( ! userId && ! email && ! name && ! ip_address ) { // if no user identification property is present the event will be dropped
        logger.debug("Any one of userId, email, name and ip_address is mandatory");
        return;
    }
    const userIdentifierPayload = identifierPayloadBuilder (userId, email, name, ip_address);
    
    const finalPayload = {
        ... userIdentifierPayload,
        ...traits
    }
    window.Sentry.setUser(finalPayload);


  }
}
export default Sentry;
