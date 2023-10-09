/* eslint-disable class-methods-use-this */
import { NAME, DISPLAY_NAME } from '@rudderstack/analytics-js-common/constants/integrations/YandexMetrica/constants';
import Logger from '../../utils/logger';
import { ecommEventPayload, sendEvent, ecommerceEventMapping } from './utils';
import {
  removeUndefinedAndNullValues,
  getHashFromArrayWithDuplicate,
} from '../../utils/commonUtils';
import { getDefinedTraits } from '../../utils/utils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(NAME);

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
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadScript() {
    loadNativeSdk(
      this.tagId,
      this.clickMap,
      this.trackLinks,
      this.accurateTrackBounce,
      this.webvisor,
      this.containerName,
    );
  }

  init() {
    this.loadScript();
  }

  isLoaded() {
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!window.ym && typeof window.ym === 'function';
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return !!window.ym;
  }

  // identify call to yandex.metrica
  identify(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} identify`);

    const { message } = rudderElement;
    const { userId } = getDefinedTraits(message);
    let payload = { UserID: userId };
    if (!message?.context?.traits) {
      logger.debug(`${DISPLAY_NAME} : user traits not present`);
    } else {
      const { traits } = message.context;
      payload = { ...payload, ...traits };
    }
    window.ym(this.tagId, 'setUserID', userId);
    window.ym(this.tagId, 'userParams', payload);
  }

  // track call
  track(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} track`);

    const { message } = rudderElement;
    const { event, properties } = message;
    const eventMappingFromConfigMap = getHashFromArrayWithDuplicate(
      this.eventNameToYandexEvent,
      'from',
      'to',
      false,
    );

    if (!event) {
      logger.error(`${DISPLAY_NAME} : Event name not present`);
      return;
    }
    const ecomEvents = Object.keys(ecommerceEventMapping);

    const trimmedEvent = event.trim().replace(/\s+/g, '_');
    if (!properties) {
      logger.error(`${DISPLAY_NAME} : Properties is not present in the payload`);
      return;
    }

    if (eventMappingFromConfigMap[event]) {
      eventMappingFromConfigMap[event].forEach(eventType => {
        sendEvent(this.containerName, ecommEventPayload(eventType, properties, this.goalId));
      });
    } else if (ecomEvents.includes(trimmedEvent)) {
      sendEvent(
        this.containerName,
        ecommEventPayload(ecommerceEventMapping[trimmedEvent], properties, this.goalId),
      );
    } else {
      logger.error(
        `${DISPLAY_NAME} : Event is neither mapped in UI nor it belongs to the supported ecommerce events`,
      );
    }
  }

  // page call
  page(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} page`);

    const { message } = rudderElement;
    if (!message?.context?.page) {
      logger.error(`${DISPLAY_NAME} : page object containing page properties are not present in the payload`);
      return;
    }
    const { page } = message.context;
    if (!page.url) {
      logger.error(`${DISPLAY_NAME} : url from page call is missing`);
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
