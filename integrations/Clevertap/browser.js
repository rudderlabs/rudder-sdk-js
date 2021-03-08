/* eslint-disable class-methods-use-this */
import get from "get-value";
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import { extractCustomFields, getDefinedTraits } from "../../utils/utils";

class Clevertap {
  constructor(config) {
    this.accountId = config.accountId;
    this.apiKey = config.passcode;
    this.name = "CLEVERTAP";
    this.region = config.region;
    this.keysToExtract = ["context.traits"];
    this.exclusionKeys = [
      "email",
      "E-mail",
      "Email",
      "phone",
      "Phone",
      "name",
      "Name",
      "gender",
      "Gender",
      "birthday",
      "Birthday",
      "anonymousId",
      "userId",
      "msgEmail",
      "msgemail",
      "msg_email",
      "msgPush",
      "msgpush",
      "msg_push",
      "msgSms",
      "msgsms",
      "msg_sms",
      "msgSMS",
      "msgWhatsapp",
      "msgwhatsapp",
      "msg_whatsapp",
    ];
  }

  init() {
    logger.debug("===in init Clevertap===");
    const sourceUrl =
      document.location.protocol == "https:"
        ? "https://d2r1yp2w7bby2u.cloudfront.net/js/a.js"
        : "http://static.clevertap.com/js/a.js";

    ScriptLoader("clevertap-integration", sourceUrl);

    window.clevertap = {
      event: [],
      profile: [],
      account: [],
      onUserLogin: [],
      notifications: [],
    };
    window.clevertap.enablePersonalization = true;
    window.clevertap.account.push({ id: this.accountId });
    if (this.region && this.region !== "none") {
      window.clevertap.region.push(this.region);
    }
  }

  isLoaded() {
    logger.debug("in clevertap isLoaded");
    return !!window.clevertap && window.clevertap.logout !== "undefined";
  }

  isReady() {
    logger.debug("in clevertap isReady");
    return !!window.clevertap && window.clevertap.logout !== "undefined";
  }

  identify(rudderElement) {
    logger.debug("in clevertap identify");

    const { message } = rudderElement;
    if (!(message.context && message.context.traits)) {
      logger.error("user traits not present");
      return;
    }
    const { userId, email, phone, name } = getDefinedTraits(message);
    let payload = {
      Name: name,
      Identity: userId,
      Email: email,
      Phone: phone,
      Gender: get(message, "context.traits.gender"),
      DOB: get(message, "context.traits.birthday"),
      // optional fields. controls whether the user will be sent email, push etc.
      "MSG-email":
        get(message, "context.traits.msgEmail") ||
        get(message, "context.traits.msgemail") ||
        get(message, "context.traits.msg_email"),
      "MSG-push":
        get(message, "context.traits.msgPush") ||
        get(message, "context.traits.msgpush") ||
        get(message, "context.traits.msg_push"),
      // Enable push notifications
      "MSG-sms":
        get(message, "context.traits.msgSms") ||
        get(message, "context.traits.msgsms") ||
        get(message, "context.traits.msg_sms") ||
        get(message, "context.traits.msgSMS"),
      // Enable sms notifications
      "MSG-whatsapp":
        get(message, "context.traits.msgWhatsapp") ||
        get(message, "context.traits.msgwhatsapp") ||
        get(message, "context.traits.msg_whatsapp"),
      // Enable WhatsApp notifications
    };
    // Extract other K-V property from traits about user custom properties
    try {
      payload = extractCustomFields(
        message,
        payload,
        this.keysToExtract,
        this.exclusionKeys
      );
    } catch (err) {
      logger.debug(`Error occured at extractCustomFields ${err}`);
    }

    window.clevertap.onUserLogin.push({
      Site: payload,
    });
  }

  track(rudderElement) {
    logger.debug("in clevertap track");
    const { event, properties } = rudderElement.message;
    if (properties) {
      window.clevertap.event.push(event, properties);
    } else {
      window.clevertap.event.push(event);
    }
  }

  page(rudderElement) {
    const { name, properties } = rudderElement.message;
    let eventName;
    if (properties && properties.category && name) {
      eventName = `Viewed ${properties.category} ${name} page`;
    } else if (name) {
      eventName = `Viewed ${name} page`;
    } else {
      eventName = "Viewed a Page";
    }
    if (properties) {
      window.clevertap.event.push(eventName, properties);
    } else {
      window.clevertap.event.push(eventName);
    }
  }
}

export default Clevertap;
