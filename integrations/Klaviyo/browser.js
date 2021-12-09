/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import get from "get-value";
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import { extractCustomFields, getDefinedTraits } from "../../utils/utils";
import ecommEventPayload from "./util";

class Klaviyo {
  constructor(config) {
    this.publicApiKey = config.publicApiKey;
    this.sendPageAsTrack = config.sendPageAsTrack;
    this.additionalPageInfo = config.additionalPageInfo;
    this.enforceEmailAsPrimary = config.enforceEmailAsPrimary;
    this.name = "KLAVIYO";
    this.keysToExtract = ["context.traits"];
    this.exclusionKeys = [
      "email",
      "E-mail",
      "Email",
      "firstName",
      "firstname",
      "first_name",
      "lastName",
      "lastname",
      "last_name",
      "phone",
      "Phone",
      "title",
      "organization",
      "city",
      "City",
      "region",
      "country",
      "Country",
      "zip",
      "image",
      "timezone",
      "anonymousId",
      "userId",
      "properties",
    ];
    this.ecomEvents = [
      "product viewed",
      "product clicked",
      "product added",
      "order cancelled",
      "checkout started",
    ];
    this.eventNameMapping = {
      "product viewed": "Viewed Product",
      "product clicked": "Viewed Product",
      "product added": "Added to Cart",
      "checkout started": "Started Checkout",
    };
  }

  init() {
    logger.debug("===in init Klaviyo===");
    ScriptLoader(
      "klaviyo-integration",
      `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${this.publicApiKey}`
    );
  }

  isLoaded() {
    logger.debug("===in isLoaded Klaviyo===");

    return !!(window._learnq && window._learnq.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug("===in isReady Klaviyo===");

    return !!(window._learnq && window._learnq.push !== Array.prototype.push);
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    if (!(message.context && message.context.traits)) {
      logger.error("user traits not present");
      return;
    }

    const { userId, email, phone, firstName, lastName, city, country } =
      getDefinedTraits(message);

    let payload = {
      $id: userId,
      $email: email,
      $phone_number: phone,
      $first_name: firstName,
      $last_name: lastName,
      $city: city,
      $country: country,
      $organization: get(message, "context.traits.organization"),
      $title: get(message, "context.traits.title"),
      $region: get(message, "context.traits.region"),
      $zip: get(message, "context.traits.zip"),
    };
    if (!payload.$email && !payload.$phone_number && !payload.$id) {
      logger.error("user id, phone or email not present");
      return;
    }
    if (this.enforceEmailAsPrimary) {
      delete payload.$id;
      payload._id = userId;
    }
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
    window._learnq.push(["identify", payload]);
  }

  track(rudderElement) {
    const { message } = rudderElement;
    if (message.properties) {
      // ecomm events
      let { event } = message.event;
      event = event ? event.trim().toLowerCase() : event;
      if (this.ecomEvents.includes(event)) {
        const payload = ecommEventPayload(event, message);
        window._learnq.push(["track", this.eventNameMapping[event], payload]);
        return;
      }
      const propsPayload = message.properties;
      if (propsPayload.revenue) {
        propsPayload.$value = propsPayload.revenue;
        delete propsPayload.revenue;
      }
      window._learnq.push(["track", message.event, propsPayload]);
    } else window._learnq.push(["track", message.event]);
  }

  page(rudderElement) {
    const { message } = rudderElement;
    if (this.sendPageAsTrack) {
      let eventName;
      if (message.properties && message.properties.category && message.name) {
        eventName = `Viewed ${message.properties.category} ${message.name} page`;
      } else if (message.name) {
        eventName = `Viewed ${message.name} page`;
      } else {
        eventName = "Viewed a Page";
      }
      if (this.additionalPageInfo && message.properties) {
        window._learnq.push(["track", `${eventName}`, message.properties]);
      } else {
        window._learnq.push(["track", `${eventName}`]);
      }
    } else {
      window._learnq.push(["track"]);
    }
  }
}

export default Klaviyo;
