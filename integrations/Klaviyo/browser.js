/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import { extractCustomFields } from "../../utils/utils";

class Klaviyo {
  constructor(config) {
    this.publicApiKey = config.publicApiKey;
    this.name = "KLAVIYO";
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
    let traitsInfo;
    if (message.context.traits) {
      traitsInfo = message.context.traits;
    } else if (message.traits) {
      traitsInfo = message.traits;
    } else {
      logger.error("user traits not present");
      return;
    }

    let payload = {
      $id: message.userId,
      $email: traitsInfo.email,
      $phone_number: traitsInfo.phone,
      $first_name: traitsInfo.firstName,
      $last_name: traitsInfo.lastName,
      $organization: traitsInfo.organization,
      $title: traitsInfo.title,
      $city: traitsInfo.city,
      $region: traitsInfo.region,
      $country: traitsInfo.country,
      $zip: traitsInfo.zip,
    };
    if (!payload.$email && !payload.$phone_number) {
      logger.error("user phone or email not present");
      return;
    }
    // Extract other K-V property from traits about user custom properties
    try {
      payload = extractCustomFields(
        message,
        payload,
        ["context.traits", "traits"],
        [
          "email",
          "firstName",
          "lastName",
          "phone",
          "title",
          "organization",
          "city",
          "region",
          "country",
          "zip",
          "image",
          "timezone",
          "anonymousId",
          "userId",
          "properties",
        ]
      );
    } catch (err) {
      logger.debug(`Error occured at extractCustomFields ${err}`);
    }
    window._learnq.push(["identify", payload]);
  }

  track(rudderElement) {
    const { message } = rudderElement;
    if (message.properties)
      window._learnq.push(["track", message.event, message.properties]);
    else window._learnq.push(["track", message.event]);
  }

  page(rudderElement) {
    const { message } = rudderElement;
    if (
      message.name ||
      (message.properties && message.properties.additionalInfo)
    ) {
      const catStr = message.properties.category
        ? `Category: ${message.properties.category}`
        : "";
      const pStr = message.name ? `Page: ${message.name}` : "";
      window._learnq.push([
        "track",
        `${pStr} ${catStr}`,
        message.properties.pageInfo,
      ]);
    } else window._learnq.push(["track"]);
  }
}

export default Klaviyo;
