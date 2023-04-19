/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import sha256 from 'crypto-js/sha256';
import {
  ADD_TO_CART_EVENT,
  CHECK_OUT_EVENT,
  LEAD_EVENT,
  NAME,
  PRODUCT_EVENT,
  PURCHASE_EVENT,
  standardEventsListMapping,
} from './constants';
import ScriptLoader from '../../utils/ScriptLoader';
import logger from '../../utils/logUtil';
import { getHashFromArrayWithDuplicate, removeUndefinedAndNullValues } from '../../utils/commonUtils';
import { constructPayload } from '../../utils/utils';
import { payloadBuilder, payloadBuilderInList } from './utils';

class Podsights {
  constructor(config, analytics, destinationInfo) {
    this.pixelId = config.pixelId;
    this.eventsToPodsightsEvents = config.eventsToPodsightsEvents;
    this.enableAliasCall = config.enableAliasCall;
    this.name = NAME;
    if (analytics.logLevel) logger.setLogLevel(analytics.logLevel);
    this.areTransformationsConnected = destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo.destinationId;
  }

  init() {
    logger.debug('===In init Podsights===');
    window.pdst =
      window.pdst ||
      function () {
        (window.pdst.q = window.pdst.q || []).push(arguments);
      };
    ScriptLoader('pdst-capture', 'https://cdn.pdst.fm/ping.min.js');
    window.pdst('conf', { key: `${this.pixelId}` });
  }

  isLoaded() {
    logger.debug('===In isLoaded Podsights===');
    return !!(window.pdst && typeof window.pdst === 'function');
  }

  isReady() {
    logger.debug('===In isReady Podsights===');
    return !!(window.pdst && typeof window.pdst === 'function');
  }

  loadAliasEvent(externalId) {
    if (this.enableAliasCall && externalId) {
      window.pdst('alias', {
        id: sha256(externalId).toString(),
      });
    }
  }

  /**
   * ref: https://podsights.com/docs#conversion-event-pixel-scripts
   * Track - tracks an event for an user
   * @param {Track} track
   */
  track(rudderElement) {
    logger.debug('===In Podsights Track===');
    const { message } = rudderElement;
    const { event, properties } = message;
    if (!event) {
      logger.error('[Podsights]: event name from track call is missing.');
      return;
    }

    const eventsMappingFromCustomEvents = getHashFromArrayWithDuplicate(
      this.eventsToPodsightsEvents,
      'from',
      'to',
      false,
    );
    const eventMappingFromStandardEvents = getHashFromArrayWithDuplicate(
      standardEventsListMapping,
      'from',
      'to',
      false,
    );
    const trimmedEvent = event.trim();
    let events = [];
    const customEvent = eventsMappingFromCustomEvents[trimmedEvent] || [];
    const standardEvents = eventMappingFromStandardEvents[trimmedEvent] || [];
    if (customEvent.length !== 0) {
      events = customEvent;
    } else if (standardEvents.length !== 0) {
      events = standardEvents;
    } else {
      logger.error(`===No Podsights Pixel mapped event found. Aborting!===`);
      return;
    }
    const externalId =
      get(message, 'userId') ||
      get(message, 'context.traits.userId') ||
      get(message, 'context.traits.id');
    let payload;
    events.forEach((podsightEvent) => {
      switch (podsightEvent.trim().toLowerCase()) {
        case 'lead':
          payload = constructPayload(properties, LEAD_EVENT);
          window.pdst(podsightEvent, payload);
          this.loadAliasEvent(externalId);
          break;
        case 'purchase': {
          payload = payloadBuilder(properties, PURCHASE_EVENT);
          window.pdst(podsightEvent, payload);
          this.loadAliasEvent(externalId);
          break;
        }
        case 'product': {
          const payloadList = payloadBuilderInList(properties, PRODUCT_EVENT);
          payloadList.forEach((payloadItem) => {
            window.pdst(podsightEvent, payloadItem);
            this.loadAliasEvent(externalId);
          });
          break;
        }
        case 'addtocart': {
          const payloadList = payloadBuilderInList(properties, ADD_TO_CART_EVENT);
          payloadList.forEach((payloadItem) => {
            window.pdst(podsightEvent, payloadItem);
            this.loadAliasEvent(externalId);
          });
          break;
        }
        case 'checkout': {
          payload = payloadBuilder(properties, CHECK_OUT_EVENT);
          window.pdst(podsightEvent, payload);
          this.loadAliasEvent(externalId);
          break;
        }
        default:
          logger.error(`event name ${podsightEvent} not supported. Aborting!===`);
          break;
      }
    });
  }

  /**
   * Page.
   * for supporting path of Page
   * @param {Page} page
   */
  page(rudderElement) {
    const { properties } = rudderElement.message;
    logger.debug('===In Podsights Page===');
    const { page } = rudderElement.message.context;
    let payload = properties;
    if (page) {
      payload = {
        url: page.url,
        referrer: page.referrer,
        ...payload,
      };
    }
    payload = removeUndefinedAndNullValues(payload);
    window.pdst('view', payload);
  }
}

export default Podsights;
