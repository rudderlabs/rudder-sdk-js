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

  // To be used later for any requirement for list api using native SDK

  /*
  addUserToList(message, conf) {
    const BASE_ENDPOINT = "https://a.klaviyo.com";
    // Check if list Id is present in message properties, if yes override
    let targetUrl = `${BASE_ENDPOINT}/api/v2/list/${this.listId}`;
    if (message.context.traits.properties.listId) {
      targetUrl = `${BASE_ENDPOINT}/api/v2/list/${message.context.traits.properties.listId}`;
    }
    const profile = {
      email: message.context.traits.email,
      phone_number: message.context.traits.phone,
    };
    // If func is called as membership func else subscribe func
    if (conf === "Membership") {
      targetUrl = `${targetUrl}/members`;
    } else {
      // get consent statuses from message if availabe else from dest config
      targetUrl = `${targetUrl}/subscribe`;
      profile.sms_consent = message.context.traits.properties.smsConsent
        ? message.context.traits.properties.smsConsent
        : this.smsConsent;
      profile.$consent = message.context.traits.properties.consent
        ? message.context.traits.properties.consent
        : this.consent;
    }

    fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "*",
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        profiles: [profile],
      }),
    })
      .then((response) => response.status)
      .then((data) => {
        logger.log("Success:", data);
      })
      .catch((error) => {
        logger.error("Error:", error);
      });
  }
  */

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
    // TO be used for List API for future requirements
    /*
    const addToList = message.context.traits.properties
      ? message.context.traits.properties.addToList
      : false;

    if (
      (!!this.listId || !!message.context.traits.properties.listId) &&
      addToList
    ) {
      this.addUserToList(message, this.CONFIG_MEMBERSHIP);
      this.addUserToList(message, this.CONFIG_SUBSCRIBE);
    } else {
      logger.info(
        `Cannot process list operation as listId is not available, both in message or config`
      );
    }
    */
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
