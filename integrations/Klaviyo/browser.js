/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import logger from "../../utils/logUtil";
import ScriptLoader from "../ScriptLoader";
import { extractCustomFields } from "../../utils/utils";

class Klaviyo {
  constructor(config) {
    this.publicApiKey = config.publicApiKey;
    this.apiKey = config.privateApiKey;
    this.listId = config.listId;
    this.consent = config.consent;
    this.smsConsent = config.smsConsent;
    this.name = "KLAVIYO";
    this.CONFIG_MEMBERSHIP = "Membership";
    this.CONFIG_SUBSCRIBE = "Subscribe";
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

    return !!window._learnq;
  }

  isReady() {
    logger.debug("===in isReady Klaviyo===");

    return !!window._learnq;
  }

  

  identify(rudderElement) {
    const { message } = rudderElement;
    if (!message.context.traits) logger.error("user traits not present");
    let payload = {
      $id: message.userId,
      $email: message.context.traits.email,
      $phone_number: message.context.traits.phone,
      $first_name: message.context.traits.firstName,
      $last_name: message.context.traits.lastName,
      $organization: message.context.traits.organization,
      $title: message.context.traits.title,
      $city: message.context.traits.city,
      $region: message.context.traits.region,
      $country: message.context.traits.country,
      $zip: message.context.traits.zip,
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
        ["context.traits"],
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
    if (message.properties.additionalInfo)
      window._learnq.push([
        "track",
        `Catagoty: ${message.categoty}, Page: ${message.name}`,
        message.properties.pageInfo,
      ]);
    else window._learnq.push(["track"]);
  }
}

export default Klaviyo;
