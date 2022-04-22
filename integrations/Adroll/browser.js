/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import sha256 from "crypto-js/sha256";
import Storage from "../../utils/storage";
import logger from "../../utils/logUtil";

import {
  isDefinedAndNotNull,
  removeUndefinedAndNullValues,
} from "../utils/commonUtils";

import { NAME } from "./constants";
import ScriptLoader from "../ScriptLoader";

class Adroll {
  constructor(config) {
    this.advId = config.advId;
    this.pixId = config.pixId;
    // this.pixelId = config.pixelId;
    // this.hashMethod = config.hashMethod;
    this.name = NAME;
  }

  init() {
    logger.debug("===In init Adroll===");
    ScriptLoader("adroll roundtrip",`https://s.adroll.com/j/${this.advId}/roundtrip.js`,)
  }

  isLoaded() {
    logger.debug("===In isLoaded Adroll===");
    return !!window.__adroll;
  }

  isReady() {
    logger.debug("===In isReady Adroll===");
    return !!window.__adroll;
  }

  identify(rudderElement) {
    logger.debug("===In Adroll Identify===");
    const { message } = rudderElement;

    let payload = {
      adroll_email: get(message, "context.traits.email"),
    };

    if (!payload.adroll_email) {
      logger.error("User parameter (email) is required for identify call");
      return;
    }
    window.__adroll.record_adroll_email('segment');
  }

  page(rudderElement) {
      
  }
}

export default Adroll;
