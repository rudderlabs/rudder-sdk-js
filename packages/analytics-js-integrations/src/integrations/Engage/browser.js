import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Engage/constants';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import { refinePayload, getDestinationExternalID } from './utils';
import { getDefinedTraits } from '../../utils/utils';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';

class Engage {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.api_key = config.publicKey;
    this.api_secret = config.privateKey;
    this.name = NAME;
    this.listsIds = config.listsIds;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    logger.debug('===In init Engage===');

    !(function (n) {
      if (!window.Engage) {
        (window[n] = window[n] || {}),
          (window[n].queue = window[n].queue || []),
          (window.Engage = window.Engage || {});
        for (var e = ['init', 'identify', 'addAttribute', 'track'], i = 0; i < e.length; i++)
          window.Engage[e[i]] = w(e[i]);
        var d = document.createElement('script');
        (d.src = '//d2969mkc0xw38n.cloudfront.net/next/engage.min.js'),
          d.setAttribute('data-loader', LOAD_ORIGIN),
          (d.async = !0),
          document.head.appendChild(d);
      }
      function w(e) {
        return function () {
          window[n].queue.push([e].concat([].slice.call(arguments)));
        };
      }
    })('engage');

    window.Engage.init({
      key: this.api_key,
      secret: this.api_secret,
    });
  }

  isLoaded() {
    logger.debug('===In isLoaded Engage===');

    return !!window.Engage;
  }

  isReady() {
    logger.debug('===In isReady Engage===');
    return !!window.Engage;
  }

  identify(rudderElement) {
    logger.debug('===In Engage identify');

    const { message } = rudderElement;
    const engageId = getDestinationExternalID(message, 'engageId');
    const { userIdOnly, firstName, phone, lastName } = getDefinedTraits(message);
    if (!engageId && !userIdOnly) {
      logger.error('externalId or userId is required for Identify call.');
      return;
    }
    let { originalTimestamp } = message;

    const { traits } = message.context;
    let payload = refinePayload(traits, (this.identifyFlag = true));

    payload.number = phone;
    payload.last_name = lastName;
    payload.first_name = firstName;
    payload.created_at = originalTimestamp;
    payload = removeUndefinedAndNullValues(payload);
    payload.id = engageId || userIdOnly;
    window.Engage.identify(payload);
  }

  track(rudderElement) {
    logger.debug('===In Engage track===');
    const { message } = rudderElement;
    const { event, properties, originalTimestamp } = message;
    let engageId = getDestinationExternalID(message, 'engageId');
    if (!engageId) {
      const { userIdOnly } = getDefinedTraits(message);
      engageId = userIdOnly || null;
    }
    if (!engageId) {
      logger.error('externalId or userId is required for track call.');
      return;
    }
    if (!event) {
      logger.error('[ Engage ]:: Event name not present');
      return;
    }
    let payload = refinePayload(properties);
    payload = removeUndefinedAndNullValues(payload);
    window.Engage.track(engageId, {
      event: event,
      timestamp: originalTimestamp,
      properties: payload,
    });
  }

  page(rudderElement) {
    logger.debug('===In Engage page===');
    const { message } = rudderElement;
    const { name, properties, originalTimestamp, category } = message;
    let engageId = getDestinationExternalID(message, 'engageId');
    if (!engageId) {
      const { userIdOnly } = getDefinedTraits(message);
      engageId = userIdOnly || null;
    }
    if (!engageId) {
      logger.error('externalId or userId is required for page call.');
      return;
    }
    let payload = refinePayload(properties);
    payload = removeUndefinedAndNullValues(payload);
    const pageCat = category ? `${category} ` : '';
    const pageName = name ? `${name} ` : '';
    const eventName = `Viewed ${pageCat}${pageName}Page`;
    window.Engage.track(engageId, {
      event: eventName,
      timestamp: originalTimestamp,
      properties: payload,
    });
  }
}

export default Engage;
