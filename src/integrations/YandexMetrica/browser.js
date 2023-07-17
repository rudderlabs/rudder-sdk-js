import logger from '../../utils/logUtil';

import { ecommEventPayload, sendEvent, ecommerceEventMapping } from './utils';
import {
  removeUndefinedAndNullValues,
  getHashFromArrayWithDuplicate,
} from '../../utils/commonUtils';
import { NAME } from './constants';
import { getDefinedTraits } from '../../utils/utils';
import { loadNativeSdk } from './nativeSdkLoader';

class YandexMetrica {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.tagId = config.tagId;
    this.clickMap = config.clickMap;
    this.trackLinks = config.trackLinks;
    this.trackBounce = config.trackBounce;
    this.webvisor = config.webvisor;
    this.containerName = config.containerName || 'dataLayer';
    this.goalId = config.goalId;
    this.eventNameToYandexEvent = config.eventNameToYandexEvent;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  loadScript() {
    loadNativeSdk(
      window,
      document,
      'script',
      'https://mc.yandex.ru/metrika/tag.js',
      'ym',
      this.tagId,
      this.clickMap,
      this.trackLinks,
      this.accurateTrackBounce,
      this.webvisor,
      this.containerName,
    );
  }

  init() {
    logger.debug('===In init YandexMetrica===');
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded YandexMetrica===');
    return !!window.ym && typeof window.ym === 'function';
  }

  isReady() {
    logger.debug('===In isReady YandexMetrica===');
    return !!window.ym;
  }

  // identify call to yandex.metrica
  identify(rudderElement) {
    logger.debug('===In YandexMetrica Identify===');

    const { message } = rudderElement;
    const { userId } = getDefinedTraits(message);
    let payload = { UserID: userId };
    if (!(message.context && message.context.traits)) {
      logger.debug('user traits not present');
    } else {
      const { traits } = message.context;
      payload = { ...payload, ...traits };
    }
    window.ym(this.tagId, 'setUserID', userId);
    window.ym(this.tagId, 'userParams', payload);
  }

  // track call
  track(rudderElement) {
    logger.debug('===In YandexMetrica track===');

    const { message } = rudderElement;
    const { event } = message;
    const eventMappingFromConfigMap = getHashFromArrayWithDuplicate(
      this.eventNameToYandexEvent,
      'from',
      'to',
      false,
    );

    if (!event) {
      logger.error('Event name not present');
      return;
    }
    const ecomEvents = Object.keys(ecommerceEventMapping);

    const trimmedEvent = event.trim().replace(/\s+/g, '_');
    if (!message.properties) {
      logger.error('Properties is not present in the payload');
      return;
    }

    if (eventMappingFromConfigMap[event]) {
      eventMappingFromConfigMap[event].forEach((eventType) => {
        sendEvent(
          this.containerName,
          ecommEventPayload(eventType, message.properties, this.goalId),
        );
      });
    } else if (ecomEvents.includes(trimmedEvent)) {
      sendEvent(
        this.containerName,
        ecommEventPayload(ecommerceEventMapping[trimmedEvent], message.properties, this.goalId),
      );
    } else {
      logger.error(
        '[Yandex Metrica]: Event is neither mapped in UI nor it belongs to the supported ecommerce events',
      );
    }
  }

  // page call
  page(rudderElement) {
    logger.debug('===In YandexMetrica Page===');
    const { message } = rudderElement;
    if (!(message.context && message.context.page)) {
      logger.error('page object containing page properties are not present in the payload');
      return;
    }
    const { page } = message.context;
    if (!page.url) {
      logger.error('[Yandex Metrica]: url from page call is missing!!===');
      return;
    }
    let payload = {};
    payload = {
      ...payload,
      title: page.title,
      referer: page.referrer,
    };
    payload = removeUndefinedAndNullValues(payload);
    window.ym(this.tagId, 'hit', page.url, payload);
  }
}

export default YandexMetrica;
