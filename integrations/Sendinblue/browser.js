/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
import logger from "../../utils/logUtil";
import { NAME } from "./constants";
import { LOAD_ORIGIN } from "../ScriptLoader";
import {
  prepareUserTraits,
  prepareTrackEventData,
  preparePagePayload,
  validateEmail,
  validatePhoneWithCountryCode,
} from "./utils";
import { getDefinedTraits } from "../../utils/utils";

class Sendinblue {
  constructor(config, analytics) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.clientKey = config.clientKey;
    this.contactAttributeMapping = config.contactAttributeMapping;
    this.sendTraitsInTrack = config.sendTraitsInTrack;
  }

  loadScript() {
    const { clientKey } = this;
    (function () {
      window.sib = {
        equeue: [],
        client_key: clientKey,
      };
      window.sendinblue = {};
      for (
        var j = ["track", "identify", "trackLink", "page"], i = 0;
        i < j.length;
        i++
      ) {
        (function (k) {
          window.sendinblue[k] = function () {
            var arg = Array.prototype.slice.call(arguments);
            (
              window.sib[k] ||
              function () {
                var t = {};
                t[k] = arg;
                window.sib.equeue.push(t);
              }
            )(arg[0], arg[1], arg[2], arg[3]);
          };
        })(j[i]);
      }
      var n = document.createElement("script"),
        i = document.getElementsByTagName("script")[0];
      (n.type = "text/javascript"),
        (n.id = "sendinblue-js"),
        (n.async = !0),
        (n.src = "https://sibautomation.com/sa.js?key=" + clientKey),
        n.setAttribute("data-loader", LOAD_ORIGIN),
        i.parentNode.insertBefore(n, i);
    })();
  }

  init() {
    logger.debug("===In init Sendinblue===");
    this.loadScript();
  }

  isLoaded() {
    logger.debug("===In isLoaded Sendinblue===");
    return !!window.sendinblue;
  }

  isReady() {
    logger.debug("===In isReady Sendinblue===");
    return !!window.sendinblue;
  }

  identify(rudderElement) {
    logger.debug("===In Sendinblue identify===");
    const { message } = rudderElement;
    const { email, phone } = getDefinedTraits(message);

    if (!email || !validateEmail(email)) {
      logger.error("[Sendinblue]:: provided email is invalid");
      return;
    }

    if (phone && !validatePhoneWithCountryCode(phone)) {
      logger.error("[Sendinblue]:: provided phone number is invalid");
      return;
    }

    const userTraits = prepareUserTraits(message, this.contactAttributeMapping);
    window.sendinblue.identify(email, {
      ...userTraits,
    });
  }

  track(rudderElement) {
    logger.debug("===In Sendinblue track===");
    const { message } = rudderElement;
    const { event } = message;
    if (!event) {
      logger.error("[Sendinblue]:: event is required for track call");
      return;
    }

    if (this.sendTraitsInTrack) {
      const { email, phone } = getDefinedTraits(message);

      if (email && !validateEmail(email)) {
        logger.error("[Sendinblue]:: provided email is invalid");
        return;
      }

      if (phone && !validatePhoneWithCountryCode(phone)) {
        logger.error("[Sendinblue]:: provided phone number is invalid");
        return;
      }
    }

    const userTraits = this.sendTraitsInTrack
      ? prepareUserTraits(message, this.contactAttributeMapping, true)
      : {};
    const eventData = prepareTrackEventData(message);
    window.sendinblue.track(event, userTraits, eventData);
  }

  page(rudderElement) {
    logger.debug("===In Sendinblue page===");
    const { message } = rudderElement;
    const { name } = message;

    if (!name) {
      logger.error("[Sendinblue]:: name is required for page call");
      return;
    }

    const payload = preparePagePayload(message);
    window.sendinblue.page(name, payload);
  }
}

export default Sendinblue;
