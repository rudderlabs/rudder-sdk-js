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
    this.logger = config.Logger;
    this.allowUrls = config.allowUrls;
    this.denyUrls = config.denyUrls;
    this.release = config.release;
    this.customVersionProperty = config.customVersionProperty;
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
      `https://browser.sentry-cdn.com/6.12.0/bundle.min.js`,
      `sha384-S3qfdh3AsT1UN84WIYNuOX9vVOoFg3nB17Jp5/pTFGDBGBt+dtz7MGAV845efkZr`
    );

    const formattedAllowUrls = convertObjectToArray(this.allowUrls);
    const formattedDenyUrls = convertObjectToArray(this.denyUrls);
    const formattedIgnoreErrors = convertObjectToArray(this.ignoreErrors);
    const formattedIncludePaths = convertObjectToArray(this.includePathsArray);

    const customRelease = this.customVersionProperty
      ? window[this.customVersionProperty]
      : null;

    window.Sentry = {
      dsn: this.dsn,
      debug: this.debugMode,
      environment: this.environment,
      release: customRelease || this.release,
      serverName: this.serverName,
      allowUrls: formattedAllowUrls,
      denyUrls: formattedDenyUrls,
      ignoreErrors: formattedIgnoreErrors,
      integrations: [],
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
    const { traits } = rudderElement.message;
    const { userId, email, name } = getDefinedTraits(rudderElement.message); // userId sent as id and username sent as name
    const ipAddress =
      get(rudderElement.message, "traits.ip_address") ||
      get(rudderElement.message, "context.traits.ip_address");

    const finalPayload = {
      id: userId,
      email: email,
      username: name,
      ip_address: ipAddress,
      ...traits,
    };
    if (this.logger) {
      window.Sentry.setTag("logger", logger);
    }
    window.Sentry.setUser(removeUndefinedAndNullValues(finalPayload));
  }
}
export default Sentry;
