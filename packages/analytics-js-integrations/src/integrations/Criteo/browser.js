/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
  supportedEvents,
} from '@rudderstack/analytics-js-common/constants/integrations/Criteo/constants';
import Logger from '../../utils/logger';
import {
  getDeviceType,
  handleListView,
  handlingEventDuo,
  handleProductView,
  generateExtraData,
  handleCommonFields,
} from './utils';
import { getHashFromArrayWithDuplicate } from '../../utils/commonUtils';

const logger = new Logger(NAME);

class Criteo {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.hashMethod = config.hashMethod;
    this.accountId = config.accountId;
    this.url = config.homePageUrl;
    this.deviceType = getDeviceType(navigator.userAgent);
    this.fieldMapping = config.fieldMapping;
    this.eventsToStandard = config.eventsToStandard;
    this.OPERATOR_LIST = ['eq', 'gt', 'lt', 'ge', 'le', 'in'];
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    if (!this.accountId) {
      logger.debug(`${DISPLAY_NAME} : Account Id is required`);
      return;
    }
    window.criteo_q = window.criteo_q || [];

    ScriptLoader('Criteo', `//dynamic.criteo.com/js/ld/ld.js?a=${this.accountId}`);
    window.criteo_q.push({ event: 'setAccount', account: this.accountId });
    window.criteo_q.push({ event: 'setSiteType', type: this.deviceType });
  }

  isLoaded() {
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!(window.criteo_q && window.criteo_q.push !== Array.prototype.push);
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return !!(window.criteo_q && window.criteo_q.push !== Array.prototype.push);
  }

  page(rudderElement) {
    const { name, properties } = rudderElement.message;

    const finalPayload = handleCommonFields(rudderElement, this.hashMethod);

    if (
      name === 'home' ||
      (properties && properties.name === 'home') ||
      (this.url && this.url === window.location.href) ||
      (properties && properties.url === this.url)
    ) {
      const homeEvent = {
        event: 'viewHome',
      };
      finalPayload.push(homeEvent);
    } else {
      logger.debug(`${DISPLAY_NAME} : Home page is not detected`);
      return;
    }

    const extraDataObject = generateExtraData(rudderElement, this.fieldMapping);
    if (Object.keys(extraDataObject).length > 0) {
      finalPayload.push({ event: 'setData', ...extraDataObject });
    }

    window.criteo_q.push(finalPayload);
  }

  track(rudderElement) {
    const { event, properties } = rudderElement.message;

    const finalPayload = handleCommonFields(rudderElement, this.hashMethod);

    if (!event) {
      logger.debug(`${DISPLAY_NAME} : Event name from track call is missing`);
      return;
    }

    if (!properties || Object.keys(properties).length === 0) {
      logger.debug(
        `${DISPLAY_NAME} : Either properties object is missing or empty in the track call`,
      );
      return;
    }

    const eventMapping = getHashFromArrayWithDuplicate(this.eventsToStandard);
    const trimmedEvent = event.toLowerCase().trim();

    if (!supportedEvents.includes(trimmedEvent) && !eventMapping[trimmedEvent]) {
      logger.debug(`${DISPLAY_NAME} : event ${trimmedEvent} is not supported`);
      return;
    }
    let events = [];
    if (supportedEvents.includes(trimmedEvent)) {
      events.push(trimmedEvent);
    } else {
      events = eventMapping[trimmedEvent];
    }

    events.forEach(eventType => {
      switch (eventType) {
        case 'product viewed':
          handleProductView(rudderElement.message, finalPayload);
          break;
        case 'cart viewed':
        case 'order completed':
          handlingEventDuo(rudderElement.message, finalPayload);
          break;
        case 'product list viewed':
          handleListView(rudderElement.message, finalPayload, this.OPERATOR_LIST);
          break;
        default:
          break;
      }
    });

    const extraDataObject = generateExtraData(rudderElement, this.fieldMapping);
    if (Object.keys(extraDataObject).length > 0) {
      finalPayload.push({ event: 'setData', ...extraDataObject });
    }
    window.criteo_q.push(finalPayload);
  }
}
export default Criteo;
