/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */

import get from "get-value";
import logger from "../../utils/logUtil";
import { SentryScriptLoader, convertObjectToArray } from "./utils";
import { removeUndefinedAndNullValues } from "../utils/commonUtils";
import { getDefinedTraits, isObject } from "../../utils/utils";

class Sentry {
  constructor(config) {
    this.name = "Sentry";
    this.dsn = config.dsn;
    this.debugMode = config.debugMode;
    this.environment = config.environment;
    this.ignoreErrors = config.ignoreErrors;
    this.includePathsArray = config.includePaths;
    this.logger = config.logger;
    this.allowUrls = config.allowUrls;
    this.denyUrls = config.denyUrls;
    this.release = config.release;
    this.customVersionProperty = config.customVersionProperty;
    this.serverName = config.serverName;
  }

  init() {
    logger.debug("===in init Sentry===");
    if (!this.dsn) {
      logger.debug("===[Sentry]: DSN is a mandatory field===");
      return;
    }
    SentryScriptLoader(
      "Sentry",
      `https://browser.sentry-cdn.com/6.12.0/bundle.min.js`,
      `sha384-S3qfdh3AsT1UN84WIYNuOX9vVOoFg3nB17Jp5/pTFGDBGBt+dtz7MGAV845efkZr`
    );

    SentryScriptLoader(
      "Sentry",
      `https://browser.sentry-cdn.com/6.12.0/rewriteframes.min.js`,
      `sha384-WOm9k3kzVt1COFAB/zCXOFx4lDMtJh/2vmEizIwgog7OW0P/dPwl3s8f6MdwrD7q`
    );

    const formattedAllowUrls = convertObjectToArray(
      this.allowUrls,
      "allowUrls"
    );
    const formattedDenyUrls = convertObjectToArray(this.denyUrls, "denyUrls");
    const formattedIgnoreErrors = convertObjectToArray(
      this.ignoreErrors,
      "ignoreErrors"
    );
    const formattedIncludePaths = convertObjectToArray(
      this.includePathsArray,
      "includePaths"
    );

    const customRelease = this.customVersionProperty
      ? window[this.customVersionProperty]
      : null;

    const releaseValue = customRelease || (this.release ? this.release : null);

    window.Sentry = {
      dsn: this.dsn,
      debug: this.debugMode,
      environment: this.environment || null,
      release: releaseValue,
      serverName: this.serverName || null,
      allowUrls: formattedAllowUrls,
      denyUrls: formattedDenyUrls,
      ignoreErrors: formattedIgnoreErrors,
    };

    let includePaths = [];

    if (formattedIncludePaths.length > 0) {
      includePaths = formattedIncludePaths.map(function (path) {
        let regex;
        try {
          regex = new RegExp(path);
        } catch (e) {
          // ignored
        }
        return regex;
      });
    }

    if (includePaths.length > 0) {
      window.Sentry.integrations = [];
      window.Sentry.integrations.push(
        new window.Sentry.Integrations.RewriteFrames({
          // eslint-disable-next-line object-shorthand
          iteratee: function (frame) {
            // eslint-disable-next-line consistent-return
            includePaths.forEach((path) => {
              try {
                if (frame.filename.match(path)) {
                  // eslint-disable-next-line no-param-reassign
                  frame.in_app = true;
                  return frame;
                }
              } catch (e) {
                // ignored
              }
            });
            // eslint-disable-next-line no-param-reassign
            frame.in_app = false;
            return frame;
          },
        })
      );
    }
  }

  // eslint-disable-next-line class-methods-use-this
  isLoaded() {
    logger.debug("===in Sentry isLoaded===");
    return !!(
      window.Sentry &&
      isObject(window.Sentry) &&
      window.Sentry.setUser &&
      window.Sentry.Integrations.RewriteFrames
    );
  }

  // eslint-disable-next-line class-methods-use-this
  isReady() {
    logger.debug("===in Sentry isReady===");
    return !!(
      window.Sentry &&
      isObject(window.Sentry) &&
      window.Sentry.setUser &&
      window.Sentry.Integrations.RewriteFrames
    );
  }

  identify(rudderElement) {
    const { traits } = rudderElement.message.context;
    const { userId, email, name } = getDefinedTraits(rudderElement.message); // userId sent as id and username sent as name
    const ipAddress = get(rudderElement.message, "context.traits.ip_address");

    if (!userId && !email && !name && !ipAddress) {
      // if no user identification property is present the event will be dropped
      logger.debug(
        "===[Sentry]: Any one of userId, email, name and ip_address is mandatory==="
      );
      return;
    }

    const combinedPayload = {
      id: userId,
      email: email,
      username: name,
      ip_address: ipAddress,
      ...traits,
    };

    const finalPayload = removeUndefinedAndNullValues(combinedPayload);
    if (this.logger) {
      window.Sentry.setTag("logger", this.logger);
    }
    window.Sentry.setUser(finalPayload);
  }
}
export default Sentry;
