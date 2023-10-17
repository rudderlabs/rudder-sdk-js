/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Vero/constants';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import Logger from '../../utils/logger';
import { isDefinedAndNotNull } from '../../utils/commonUtils';
import { getDestinationOptions } from './utils';

const logger = new Logger(DISPLAY_NAME);

class Vero {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.apiKey = config.apiKey;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    window._veroq = window._veroq || [];
    ScriptLoader('vero-integration', 'https://d3qxef4rp70elm.cloudfront.net/m.js');
    window._veroq.push(['init', { api_key: this.apiKey }]);
  }

  isLoaded() {
    return !!window._veroq && typeof window._veroq === 'object';
  }

  isReady() {
    return !!window._veroq && !!window._veroq.ready;
  }

  /**
   * AddOrRemoveTags.
   * This block handles any tag addition or removal requests.
   * Ref - http://developers.getvero.com/?javascript#tags
   *
   * @param {Object} tags
   */
  addOrRemoveTags(message) {
    const { integrations, anonymousId, userId } = message;
    const veroIntgConfig = getDestinationOptions(integrations);
    if (veroIntgConfig) {
      const { tags } = veroIntgConfig;
      if (isDefinedAndNotNull(tags)) {
        const id = userId || anonymousId;
        const addTags = Array.isArray(tags.add) ? tags.add : [];
        const removeTags = Array.isArray(tags.remove) ? tags.remove : [];
        window._veroq.push([
          'tags',
          {
            id,
            add: addTags,
            remove: removeTags,
          },
        ]);
      }
    }
  }

  /**
   * Identify.
   * Ref - https://developers.getvero.com/?javascript#users-identify
   *
   * @param {Identify} identify
   */
  identify(rudderElement) {
    const { message } = rudderElement;
    const { traits } = message.context || message;
    const userId = message.userId || message.anonymousId;
    let payload = traits;
    if (userId) {
      payload = { id: userId, ...payload };
    }
    window._veroq.push(['user', payload]);
    this.addOrRemoveTags(message);
  }

  /**
   * Track - tracks an event for a specific user
   * for event `unsubscribe`
   * Ref - https://developers.getvero.com/?javascript#users-unsubscribe
   * for event `resubscribe`
   * Ref - https://developers.getvero.com/?javascript#users-resubscribe
   * else
   * Ref - https://developers.getvero.com/?javascript#events-track
   *
   * @param {Track} track
   */
  track(rudderElement) {
    const { message } = rudderElement;
    const { event, properties, anonymousId, userId } = message;
    if (!event) {
      logger.error('Event name from track call is missing');
      return;
    }
    const id = userId || anonymousId;
    switch (event.toLowerCase()) {
      case 'unsubscribe':
        window._veroq.push(['unsubscribe', id]);
        break;
      case 'resubscribe':
        window._veroq.push(['resubscribe', id]);
        break;
      default:
        window._veroq.push(['track', event, properties]);
    }
    this.addOrRemoveTags(message);
  }

  /**
   * Page.
   *
   * @param {Page} page
   */
  page(rudderElement) {
    const { name, category } = rudderElement.message;
    let eventName;
    if (!name && !category) {
      eventName = `Viewed Page`;
    } else if (!name && category) {
      eventName = `Viewed ${category} Page`;
    } else if (name && !category) {
      eventName = `Viewed ${name} Page`;
    } else {
      eventName = `Viewed ${category} ${name} Page`;
    }
    const elemClone = { ...rudderElement };
    elemClone.message = { ...rudderElement.message };
    elemClone.message.event = eventName;
    this.track(elemClone);
  }

  /**
   * Alias.
   * Ref - https://www.getvero.com/api/http/#users
   *
   * @param {Alias} alias
   */
  alias(rudderElement) {
    const { message } = rudderElement;
    const { userId, previousId } = message;
    if (!previousId) {
      logger.error('previousId is required for alias call');
      return;
    }
    if (!userId) {
      logger.error('userId is required for alias call');
      return;
    }
    window._veroq.push(['reidentify', userId, previousId]);
    this.addOrRemoveTags(message);
  }
}

export default Vero;
