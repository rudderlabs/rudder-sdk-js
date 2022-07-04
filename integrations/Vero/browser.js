/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import { NAME } from "./constants";
import logger from "../../utils/logUtil";
import { isDefinedAndNotNull } from "../utils/commonUtils";
import ScriptLoader from "../ScriptLoader";

class Vero {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.name = NAME;
  }

  init() {
    logger.debug("===In init Vero===");
    window._veroq = window._veroq || [];
    ScriptLoader(null, "https://d3qxef4rp70elm.cloudfront.net/m.js", true);
    window._veroq.push(["init", { api_key: this.apiKey }]);
  }

  isLoaded() {
    logger.debug("in Vero isLoaded");
    return !!window._veroq;
  }

  isReady() {
    logger.debug("in Vero isReady");
    return !!window._veroq && !!window._veroq.ready;
  }

  /**
   * AddOrRemoveTags.
   * This block handles any tag addition or removal requests.
   * Ref - http://developers.getvero.com/?javascript#tags
   *
   * @param {Object} tags
   */
  addOrRemoveTags(tags, userId) {
    const addTags = get(tags, "add");
    const removeTags = get(tags, "remove");
    window._veroq.push([
      "tags",
      {
        id: userId,
        add: addTags,
        remove: removeTags,
      },
    ]);
  }

  /**
   * Identify.
   * Ref - https://developers.getvero.com/?javascript#users-identify
   *
   * @param {Identify} identify
   */
  identify(rudderElement) {
    const { message } = rudderElement;
    const { traits } = message.context || message;
    const userId = message.userId || message.anonymousId;
    let payload = traits;
    if (userId) {
      payload = { id: userId, ...payload };
    }
    window._veroq.push(["user", payload]);
    const tags = message.context.integerations?.[("vero", "Vero")]?.tags;
    if (isDefinedAndNotNull(tags)) this.addOrRemoveTags(tags, userId);
  }

  /**
   * Track - tracks an event for a specific user
   * for event `unsubscribe`
   * Ref - https://developers.getvero.com/?javascript#users-unsubscribe
   * for event `resubscribe`
   * Ref - https://developers.getvero.com/?javascript#users-resubscribe
   * else
   * Ref - https://developers.getvero.com/?javascript#events-track
   *
   * @param {Track} track
   */
  track(rudderElement) {
    logger.debug("=== In Vero track ===");

    const { message } = rudderElement;
    const { event, properties } = message;
    if (!event) {
      logger.error("[Vero]: Event name from track call is missing!!===");
      return;
    }
    const userId = message.userId || message.anonymousId;
    switch (event.toLowerCase()) {
      case "unsubscribe":
        window._veroq.push(["unsubscribe", userId]);
        break;
      case "resubscribe":
        window._veroq.push(["resubscribe", userId]);
        break;
      default:
        window._veroq.push(["track", event, properties]);
    }

    const tags = message.context.integerations?.[("vero", "Vero")]?.tags;
    if (isDefinedAndNotNull(tags)) this.addOrRemoveTags(tags, userId);
  }

  /**
   * Page.
   *
   * @param {Page} page
   */
  page(rudderElement) {
    logger.debug("=== In Vero Page ===");
    const { message } = rudderElement;
    let eventName;
    if (!message.name && !message.category) {
      eventName = `Viewed a Page`;
    } else if (!message.name && message.category) {
      eventName = `Viewed ${message.category} Page`;
    } else if (message.name && !message.category) {
      eventName = `Viewed ${message.name} Page`;
    } else {
      eventName = `Viewed ${message.category} ${message.name} Page`;
    }
    rudderElement.message.event = eventName;
    this.track(rudderElement);
  }

  /**
   * Alias.
   * Ref - https://www.getvero.com/api/http/#users
   *
   * @param {Alias} alias
   */
  alias(rudderElement) {
    const { message } = rudderElement;
    const { userId, previousId } = message;
    if (!previousId) {
      logger.debug("===Vero: previousId is required for alias call===");
    }
    if (!userId) {
      logger.debug("===Vero: userId is required for alias call===");
      return;
    }
    if (userId && previousId) {
      window._veroq.push(["reidentify", userId, previousId]);
    }

    const tags = message.context.integerations?.[("vero", "Vero")]?.tags;
    if (isDefinedAndNotNull(tags)) this.addOrRemoveTags(tags, userId);
  }
}

export default Vero;
