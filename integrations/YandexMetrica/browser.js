import logger from "../../utils/logUtil";

import { ecommEventPayload, sendEvent, eventMapping } from "./utils";
import {
  removeUndefinedAndNullValues,
  getHashFromArrayWithDuplicate,
} from "../utils/commonUtils";
import { NAME } from "./constants";
import { LOAD_ORIGIN } from "../ScriptLoader";

class YandexMetrica {
  constructor(config, analytics) {
    this.analytics = analytics;
    if (analytics.logLevel) logger.setLogLevel(analytics.logLevel);
    this.tagId = config.tagId;
    this.clickMap = config.clickMap;
    this.trackLinks = config.trackLinks;
    this.trackBounce = config.trackBounce;
    this.webvisor = config.webvisor;
    this.containerName = config.containerName;
    this.goalId = config.goalId;
    if (!config.containerName) {
      this.containerName = "dataLayer";
    }
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
        k.setAttribute("data-loader", LOAD_ORIGIN),
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
    logger.debug("===In YandexMetrica Identify===");

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
      this.eventNameToYandexEvent,
      "from",
      "to",
      false
    );

    if (!event) {
      logger.error("Event name not present");
      return;
    }
    const ecomEvents = Object.keys(eventMapping);

    const trimmedEvent = event.trim().replace(/\s+/g, "_");

    if (eventMappingFromConfigMap[event]) {
      eventMappingFromConfigMap[event].forEach((eventType) => {
        if (eventType !== eventMapping[trimmedEvent]) {
          sendEvent(
            this.containerName,
            ecommEventPayload(eventType, message.properties, this.goalId)
          );
        }
      });
    }
    if (ecomEvents.includes(trimmedEvent)) {
      sendEvent(
        this.containerName,
        ecommEventPayload(
          eventMapping[trimmedEvent],
          message.properties,
          this.goalId
        )
      );
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
