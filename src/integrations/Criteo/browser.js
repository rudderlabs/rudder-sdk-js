/* eslint-disable no-unused-expressions */
import logger from '../../utils/logUtil';
import ScriptLoader from '../../utils/ScriptLoader';
import {
  getDeviceType,
  handleListView,
  handlingEventDuo,
  handleProductView,
  generateExtraData,
  handleCommonFields,
} from './utils';
import { NAME, supportedEvents } from './constants';
import { getHashFromArrayWithDuplicate } from '../../utils/commonUtils';

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
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init Criteo===');
    if (!this.accountId) {
      logger.debug('Account ID missing');
      return;
    }
    window.criteo_q = window.criteo_q || [];

    ScriptLoader('Criteo', `//dynamic.criteo.com/js/ld/ld.js?a=${this.accountId}`);
    window.criteo_q.push({ event: 'setAccount', account: this.accountId });
    window.criteo_q.push({ event: 'setSiteType', type: this.deviceType });
  }

  // eslint-disable-next-line class-methods-use-this
  isLoaded() {
    logger.debug('===in Criteo isLoaded===');
    return !!(window.criteo_q && window.criteo_q.push !== Array.prototype.push);
  }

  // eslint-disable-next-line class-methods-use-this
  isReady() {
    logger.debug('===in Criteo isReady===');
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
      logger.debug('[Criteo] Home page is not detected');
      return;
    }

    const extraDataObject = generateExtraData(rudderElement, this.fieldMapping);
    if (Object.keys(extraDataObject).length > 0) {
      finalPayload.push({ event: 'setData', ...extraDataObject });
    }

    window.criteo_q.push(finalPayload);

    // Final example payload supported by destination
    // window.criteo_q.push(
    //   { event: "setAccount", account: YOUR_PARTNER_ID},
    //   {
    //     event: "setEmail",
    //     email: "##Email Address##",
    //     hash_method: "##Hash Method##",
    //   },
    //   { event: "setSiteType", type: deviceType},
    //   { event: "setCustomerId", id: "##Customer Id##" },
    //   { event: "setRetailerVisitorId", id: "##Visitor Id##"},
    //   { event: "setZipcode", zipcode: "##Zip Code##" },
    //   { event: "viewHome" }
    // );
  }

  track(rudderElement) {
    const { event, properties } = rudderElement.message;

    const finalPayload = handleCommonFields(rudderElement, this.hashMethod);

    if (!event) {
      logger.debug('[Criteo] Event name from track call is missing!!===');
      return;
    }

    if (!properties || Object.keys(properties).length === 0) {
      logger.debug('[Criteo] Either properties object is missing or empty in the track call');
      return;
    }

    const eventMapping = getHashFromArrayWithDuplicate(this.eventsToStandard);
    const trimmedEvent = event.toLowerCase().trim();

    if (!supportedEvents.includes(trimmedEvent) && !eventMapping[trimmedEvent]) {
      logger.debug(`[Criteo] event ${trimmedEvent} is not supported`);
      return;
    }
    let events = [];
    if (supportedEvents.includes(trimmedEvent)) {
      events.push(trimmedEvent);
    } else {
      events = eventMapping[trimmedEvent];
    }

    events.forEach((eventType) => {
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
