import logger from "../../utils/logUtil";

import {
  ecommEventPayload,
  sendEvent,
  commonEventPayload,
  eventMapping,
} from "./utils";
import {
  removeUndefinedAndNullValues,
  getHashFromArrayWithDuplicate,
} from "../utils/commonUtils";
import { NAME } from "./constants";

class YandexMetrica {
  constructor(config) {
    this.tagId = config.tagId;
    this.clickMap = config.clickMap;
    this.trackLinks = config.trackLinks;
    this.trackBounce = config.trackBounce;
    this.webvisor = config.webvisor;
    this.containerName = config.containerName;
    this.eventNameToYandexEvent = config.eventNameToYandexEvent;
    this.name = NAME;
  }

  loadScript() {
    (function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = 1 * new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) {
          return;
        }
      }
      (k = e.createElement(t)),
        (a = e.getElementsByTagName(t)[0]),
        (k.async = 1),
        (k.src = r),
        a.parentNode.insertBefore(k, a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(this.tagId, "init", {
      clickmap: this.clickMap,
      trackLinks: this.trackLinks,
      accurateTrackBounce: this.accurateTrackBounce,
      webvisor: this.webvisor,
      ecommerce: this.containerName,
    });
    window[`${this.containerName}`] = window[`${this.containerName}`] || [];
    window[`${this.containerName}`].push({});
  }

  init() {
    logger.debug("===In init YandexMetrica===");
    this.loadScript();
  }

  isLoaded() {
    logger.debug("===In isLoaded YandexMetrica===");
    return !!window.ym && typeof window.ym === "function";
  }

  isReady() {
    logger.debug("===In isReady YandexMetrica===");
    return !!window.ym;
  }

  identify(rudderElement) {
    logger.debug("===In YandexMetrica Identify");

    const { message } = rudderElement;
    const userId = message.userId || message.anonymousId;
    const { traits } = message.context;
    const payload = { ...traits, UserID: userId };
    window.ym(this.tagId, "setUserID", userId);
    window.ym(this.tagId, "userParams", payload);
  }

  track(rudderElement) {
    logger.debug("===In YandexMetrica track===");

    const { message } = rudderElement;
    const { event } = message;
    const eventMappingFromConfigMap = getHashFromArrayWithDuplicate(
      this.eventMappingFromConfig,
      "from",
      "to",
      false
    );

    if (!event) {
      logger.error("Event name not present");
      return;
    }
    const ecomEvents = Object.keys(eventMapping);
    if (
      eventMappingFromConfigMap[event] &&
      !ecomEvents.includes(event.trim().replace(/\s+/g, "_"))
    ) {
      // mapping event from UI
      sendEvent(
        this.containerName,
        commonEventPayload(eventMappingFromConfigMap[event], message.properties)
      );
    } else {
      switch (event.trim().replace(/\s+/g, "_")) {
        case "order_completed":
          sendEvent(this.containerName, ecommEventPayload(event, message));
          break;
        case "product_added":
          sendEvent(this.containerName, ecommEventPayload(event, message));
          break;
        case "product_removed":
          sendEvent(this.containerName, ecommEventPayload(event, message));
          break;
        case "product_viewed":
        case "product_list_viewed":
          sendEvent(this.containerName, ecommEventPayload(event, message));
          break;
        default:
          break;
      }
    }
  }

  page(rudderElement) {
    logger.debug("===In YandexMetrica Page===");
    const { message } = rudderElement;
    const { properties } = message;
    if (!properties.url) {
      logger.error("[Yandex Metrica]: url from page call is missing!!===");
      return;
    }
    let payload = {};
    payload = {
      ...payload,
      title: properties.title,
      referer: properties.referrer,
    };
    payload = removeUndefinedAndNullValues(payload);
    window.ym(this.tagId, "hit", properties.url, payload);
  }
}

export default YandexMetrica;
