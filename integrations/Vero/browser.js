/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from "get-value";
import { NAME } from "./constants";
import logger from "../../utils/logUtil";
import { isDefinedAndNotNull } from "../utils/commonUtils";

class Vero {
  constructor(config) {
    this.apiKey = config.apiKey;
    this.name = NAME;
  }

  init() {
    logger.debug("===In init Vero===");
    window._veroq = window._veroq || [];
    (function () {
      var ve = document.createElement("script");
      ve.type = "text/javascript";
      ve.async = true;
      ve.src = "https://d3qxef4rp70elm.cloudfront.net/m.js";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(ve, s);
    })();
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
   *
   * http://developers.getvero.com/?javascript#tags
   *
   * @api public
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
   *
   * https://developers.getvero.com/?javascript#users-identify
   *
   * @api public
   * @param {Identify} identify
   */
  identify(rudderElement) {
    const { message } = rudderElement;
    const { traits } = message.context || message;
    const userId = message.userId || message.anonymousId;
    /*
      userId OR email address are required by Vero's API. When userId isn't present,
      email will be used as the userId.
     */
    const email =
      get(message, "context.traits.email") || get(message, "traits.email");
    if (!userId && !email) {
      logger.error("[Vero]: User parameter userId or email is required.");
      return;
    }
    let payload = traits;
    if (userId) payload = { id: userId, ...payload };
    window._veroq.push(["user", payload]);
    const tags = message.context.integerations?.Vero?.tags;
    const id = userId || email;
    if (isDefinedAndNotNull(tags)) this.addOrRemoveTags(tags, id);
  }

  /**
   * Track.
   *
   * https://developers.getvero.com/?javascript#events-track
   *
   * @api public
   * @param {Track} track
   */
  track(rudderElement) {
    logger.debug("===In Vero track===");

    const { message } = rudderElement;
    const { event, properties } = message;
    if (!event) {
      logger.error("[Vero]: Event name from track call is missing!!===");
      return;
    }
    window._veroq.push(["track", event, properties]);
    const tags = message.context.integerations?.Vero?.tags;
    const email =
      get(message, "context.traits.email") ||
      get(message, "traits.email") ||
      get(message, "properties.email");
    const userId = message.userId || message.anonymousId || email;
    if (isDefinedAndNotNull(tags)) this.addOrRemoveTags(tags, userId);
  }

  /**
   * Alias.
   *
   * https://www.getvero.com/api/http/#users
   *
   * @api public
   * @param {Alias} alias
   */
  alias(rudderElement) {
    const { message } = rudderElement;
    const { userId, previousId } = message;
    window._veroq.push(["reidentify", userId, previousId]);
    const tags = message.context.integerations?.Vero?.tags;
    if (isDefinedAndNotNull(tags)) this.addOrRemoveTags(tags, userId);
  }
}

export default Vero;
