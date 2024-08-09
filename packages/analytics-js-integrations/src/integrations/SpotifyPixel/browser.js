/* eslint-disable prefer-rest-params */
/* eslint-disable func-names */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import sha256 from 'crypto-js/sha256';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/SpotifyPixel/constants';
import {
  PRODUCT_EVENT,
  PURCHASE_EVENT,
  standardEventsListMapping,
  LINE_ITEMS_CONFIG,
  ADD_TO_CART_EVENT,
  CHECK_OUT_EVENT,
  LEAD_EVENT,
} from '@rudderstack/analytics-js-common/constants/integrations/CommonIntegrationsConstant/constants';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import Logger from '../../utils/logger';
import {
  getHashFromArrayWithDuplicate,
  removeUndefinedAndNullValues,
} from '../../utils/commonUtils';
import { constructPayload } from '../../utils/utils';
import { payloadBuilder, payloadBuilderInList } from '../Podsights/utils';

const logger = new Logger(DISPLAY_NAME);

class SpotifyPixel {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.pixelId = config.pixelId;
    this.eventsToSpotifyPixelEvents = config.eventsToSpotifyPixelEvents;
    this.enableAliasCall = config.enableAliasCall;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    window.spdt =
      window.spdt ||
      function () {
        (window.spdt.q = window.spdt.q || []).push(arguments);
      };
    ScriptLoader('spdt-capture', 'https://pixel.byspotify.com/ping.min.js');
    window.spdt('conf', { key: `${this.pixelId}` });
  }

  isLoaded() {
    return !!(window.spdt && typeof window.spdt === 'function');
  }

  isReady() {
    return this.isLoaded();
  }

  // ref :  https://help.adanalytics.spotify.com/technical-pixel-docs#:~:text=these%20specific%20events.-,Alias,alias%20event%20script%20and%20Spotify%20Ad%20Analytics%C2%A0will%20send%20encrypted%20data.,-spdt(%27alias%27%2C%20%7B
  loadAliasEvent(externalId) {
    if (this.enableAliasCall && externalId) {
      window.spdt('alias', {
        id: sha256(externalId).toString(),
      });
    }
  }

  /**
   * ref: https://help.adanalytics.spotify.com/technical-pixel-docs
   * Track - tracks an event for an user
   * @param {Track} track
   */
  track(rudderElement) {
    const { message } = rudderElement;
    const { event, properties } = message;
    if (!event) {
      logger.error('event name from track call is missing');
      return;
    }

    const eventsMappingFromCustomEvents = getHashFromArrayWithDuplicate(
      this.eventsToSpotifyPixelEvents,
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
    if (customEvent.length > 0) {
      events = customEvent;
    } else if (standardEvents.length > 0) {
      events = standardEvents;
    } else {
      logger.error('No Spotify Pixel mapped event found. Aborting');
      return;
    }
    const externalId =
      get(message, 'userId') ||
      get(message, 'context.traits.userId') ||
      get(message, 'context.traits.id');
    let payload;
    events.forEach(spotifyEvent => {
      switch (spotifyEvent.trim().toLowerCase()) {
        case 'lead':
          payload = constructPayload(properties, LEAD_EVENT);
          window.spdt(spotifyEvent, payload);
          this.loadAliasEvent(externalId);
          break;
        case 'purchase': {
          payload = payloadBuilder(properties, PURCHASE_EVENT, LINE_ITEMS_CONFIG);
          window.spdt(spotifyEvent, payload);
          this.loadAliasEvent(externalId);
          break;
        }
        case 'product': {
          const payloadList = payloadBuilderInList(properties, PRODUCT_EVENT);
          payloadList.forEach(payloadItem => {
            window.spdt(spotifyEvent, payloadItem);
            this.loadAliasEvent(externalId);
          });
          break;
        }
        case 'addtocart': {
          const payloadList = payloadBuilderInList(properties, ADD_TO_CART_EVENT);
          payloadList.forEach(payloadItem => {
            window.spdt(spotifyEvent, payloadItem);
            this.loadAliasEvent(externalId);
          });
          break;
        }
        case 'checkout': {
          payload = payloadBuilder(properties, CHECK_OUT_EVENT, LINE_ITEMS_CONFIG);
          window.spdt(spotifyEvent, payload);
          this.loadAliasEvent(externalId);
          break;
        }
        default:
          logger.error(`event name ${spotifyEvent} not supported. Aborting`);
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
    const { properties, context } = rudderElement.message;
    const { page } = context;
    let payload = properties;
    if (page) {
      payload = {
        url: page.url,
        referrer: page.referrer,
        ...payload,
      };
    }
    payload = removeUndefinedAndNullValues(payload);
    window.spdt('view', payload);
  }
}

export default SpotifyPixel;
