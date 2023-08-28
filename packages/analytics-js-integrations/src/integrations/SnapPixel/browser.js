/* eslint-disable class-methods-use-this */
import get from 'get-value';
import { Storage } from '@rudderstack/analytics-js-common/utilsV1/storage';
import { logger } from '@rudderstack/analytics-js-common/utilsV1/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/SnapPixel/constants';
import {
  getEventMappingFromConfig,
  removeUndefinedAndNullValues,
  getHashFromArrayWithDuplicate,
} from '../../utils/commonUtils';
import { ecommEventPayload, eventPayload, getUserEmailAndPhone, sendEvent } from './util';
import { loadNativeSdk } from './nativeSdkLoader';

class SnapPixel {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.pixelId = config.pixelId;
    this.hashMethod = config.hashMethod;
    this.name = NAME;
    this.deduplicationKey = config.deduplicationKey;
    this.enableDeduplication = config.enableDeduplication;
    this.eventMappingFromConfig = config.eventMappingFromConfig;
    this.trackEvents = [
      'SIGN_UP',
      'OPEN_APP',
      'SAVE',
      'SUBSCRIBE',
      'COMPLETE_TUTORIAL',
      'INVITE',
      'LOGIN',
      'SHARE',
      'RESERVE',
      'ACHIEVEMENT_UNLOCKED',
      'SPENT_CREDITS',
      'RATE',
      'START_TRIAL',
      'LIST_VIEW',
    ];

    this.ecomEvents = {
      PURCHASE: 'PURCHASE',
      START_CHECKOUT: 'START_CHECKOUT',
      ADD_CART: 'ADD_CART',
      ADD_BILLING: 'ADD_BILLING',
      AD_CLICK: 'AD_CLICK',
      AD_VIEW: 'AD_VIEW',
      ADD_TO_WISHLIST: 'ADD_TO_WISHLIST',
      VIEW_CONTENT: 'VIEW_CONTENT',
      SEARCH: 'SEARCH',
    };

    this.customEvents = [
      'custom_event_1',
      'custom_event_2',
      'custom_event_3',
      'custom_event_4',
      'custom_event_5',
    ];
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    logger.debug('===In init SnapPixel===');

    loadNativeSdk();

    const userTraits = Storage.getUserTraits();

    const userEmail = userTraits?.email;
    const userPhoneNumber = userTraits?.phone;

    let payload = getUserEmailAndPhone(this.hashMethod, userEmail, userPhoneNumber);

    payload = removeUndefinedAndNullValues(payload);
    window.snaptr('init', this.pixelId, payload);
  }

  isLoaded() {
    logger.debug('===In isLoaded SnapPixel===');
    return !!window.snaptr;
  }

  isReady() {
    logger.debug('===In isReady SnapPixel===');
    return !!window.snaptr;
  }

  identify(rudderElement) {
    logger.debug('===In SnapPixel identify');

    const { message } = rudderElement;

    const userEmail = get(message, 'context.traits.email');
    const userPhoneNumber = get(message, 'context.traits.phone');
    const ipAddress = get(message, 'context.ip') || get(message, 'request_ip');
    let payload = {};

    if (!userEmail && !userPhoneNumber && !ipAddress) {
      logger.error(
        'User parameter (email or phone number or ip address) is required for Identify call.',
      );
      return;
    }

    payload = getUserEmailAndPhone(this.hashMethod, userEmail, userPhoneNumber);
    payload = { ...payload, ip_address: ipAddress };

    payload = removeUndefinedAndNullValues(payload);
    window.snaptr('init', this.pixelId, payload);
  }

  track(rudderElement) {
    logger.debug('===In SnapPixel track===');

    const { message } = rudderElement;
    const { event } = message;
    const eventMappingFromConfigMap = getHashFromArrayWithDuplicate(
      this.eventMappingFromConfig,
      'from',
      'to',
      false,
    );

    if (!event) {
      logger.error('Event name not present');
      return;
    }

    try {
      if (eventMappingFromConfigMap[event]) {
        // mapping event from UI
        const events = getEventMappingFromConfig(event, eventMappingFromConfigMap);
        events.forEach(ev => {
          sendEvent(
            ev,
            ecommEventPayload(event, message, this.deduplicationKey, this.enableDeduplication),
          );
        });
      } else {
        switch (event.toLowerCase().trim()) {
          case 'order completed':
            sendEvent(
              this.ecomEvents.PURCHASE,
              ecommEventPayload(event, message, this.deduplicationKey, this.enableDeduplication),
            );
            break;
          case 'checkout started':
            sendEvent(
              this.ecomEvents.START_CHECKOUT,
              ecommEventPayload(event, message, this.deduplicationKey, this.enableDeduplication),
            );
            break;
          case 'product added':
            sendEvent(
              this.ecomEvents.ADD_CART,
              ecommEventPayload(event, message, this.deduplicationKey, this.enableDeduplication),
            );
            break;
          case 'payment info entered':
            sendEvent(
              this.ecomEvents.ADD_BILLING,
              ecommEventPayload(event, message, this.deduplicationKey, this.enableDeduplication),
            );
            break;
          case 'promotion clicked':
            sendEvent(
              this.ecomEvents.AD_CLICK,
              ecommEventPayload(event, message, this.deduplicationKey, this.enableDeduplication),
            );
            break;
          case 'promotion viewed':
            sendEvent(
              this.ecomEvents.AD_VIEW,
              ecommEventPayload(event, message, this.deduplicationKey, this.enableDeduplication),
            );
            break;
          case 'product added to wishlist':
            sendEvent(
              this.ecomEvents.ADD_TO_WISHLIST,
              ecommEventPayload(event, message, this.deduplicationKey, this.enableDeduplication),
            );
            break;
          case 'product viewed':
          case 'product list viewed':
            sendEvent(
              this.ecomEvents.VIEW_CONTENT,
              ecommEventPayload(event, message, this.deduplicationKey, this.enableDeduplication),
            );
            break;
          case 'products searched':
            sendEvent(
              this.ecomEvents.SEARCH,
              ecommEventPayload(event, message, this.deduplicationKey, this.enableDeduplication),
            );
            break;
          default:
            if (
              !this.trackEvents.includes(event.trim().toUpperCase()) &&
              !this.customEvents.includes(event.trim().toLowerCase())
            ) {
              logger.error("Event doesn't match with Snap Pixel Events!");
              return;
            }
            sendEvent(
              event,
              eventPayload(message, this.deduplicationKey, this.enableDeduplication),
            );
            break;
        }
      }
    } catch (err) {
      logger.error('[Snap Pixel] track failed with following error', err);
    }
  }

  page(rudderElement) {
    logger.debug('===In SnapPixel page===');

    const { message } = rudderElement;
    sendEvent('PAGE_VIEW', eventPayload(message, this.deduplicationKey, this.enableDeduplication));
  }
}

export default SnapPixel;
