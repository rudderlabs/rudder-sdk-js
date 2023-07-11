/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import get from 'get-value';
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Drip/constants';
import { isDefinedAndNotNull, removeUndefinedAndNullValues } from '../../utils/commonUtils';
import { getDestinationExternalID } from './utils';
import { extractCustomFields } from '../../utils/utils';

class Drip {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.accountId = config.accountId;
    this.campaignId = config.campaignId;
    this.name = NAME;
    this.exclusionFields = [
      'email',
      'new_email',
      'newEmail',
      'tags',
      'remove_tags',
      'removeTags',
      'prospect',
      'eu_consent',
      'euConsent',
      'eu_consent_message',
      'euConsentMessage',
    ];
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===In init Drip===');

    window._dcq = window._dcq || [];
    window._dcs = window._dcs || {};
    window._dcs.account = this.accountId;

    (function () {
      const dc = document.createElement('script');
      dc.type = 'text/javascript';
      dc.setAttribute('data-loader', LOAD_ORIGIN);
      dc.async = true;
      dc.src = `//tag.getdrip.com/${window._dcs.account}.js`;
      const s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(dc, s);
    })();
  }

  isLoaded() {
    logger.debug('===In isLoaded Drip===');
    return !!window._dcq;
  }

  isReady() {
    logger.debug('===In isReady Drip===');
    return !!window._dcq;
  }

  identify(rudderElement) {
    logger.debug('===In Drip identify===');

    const { message } = rudderElement;
    if (!message.context || !message.context.traits) {
      logger.error('user context or traits not present');
      return;
    }

    const email = get(message, 'context.traits.email');
    if (!email) {
      logger.error('email is required for identify');
      return;
    }

    let euConsent = get(message, 'context.traits.euConsent');
    if (
      euConsent &&
      !(euConsent.toLowerCase() === 'granted' || euConsent.toLowerCase() === 'denied')
    ) {
      euConsent = null;
    }

    let payload = {
      email,
      new_email: get(message, 'context.traits.newEmail'),
      user_id: get(message, 'userId') || get(message, 'anonymousId'),
      tags: get(message, 'context.traits.tags'),
      remove_tags: get(message, 'context.traits.removeTags'),
      prospect: get(message, 'context.traits.prospect'),
      eu_consent: euConsent,
      eu_consent_message: get(message, 'context.traits.euConsentMessage'),
    };

    let extraFields = {};
    try {
      extraFields = extractCustomFields(
        message,
        extraFields,
        ['context.traits'],
        this.exclusionFields,
      );
    } catch (err) {
      logger.debug(`Error occured at extractCustomFields ${err}`);
    }

    payload = {
      ...payload,
      ...extraFields,
    };

    payload = removeUndefinedAndNullValues(payload);
    window._dcq.push(['identify', payload]);

    const campaignId = getDestinationExternalID(message, 'dripCampaignId') || this.campaignId;

    if (campaignId) {
      const fields = payload;
      delete fields.campaignId;
      delete fields.doubleOptin;
      delete fields.tags;

      let campaignPayload = {
        fields,
        campaign_id: campaignId,
        double_optin: get(message, 'context.traits.doubleOptin'),
      };
      campaignPayload = removeUndefinedAndNullValues(campaignPayload);
      window._dcq.push(['subscribe', campaignPayload]);
    }
  }

  track(rudderElement) {
    logger.debug('===In Drip track===');

    const { message } = rudderElement;
    const { event } = rudderElement.message;

    if (!event) {
      logger.error('Event name not present');
      return;
    }

    const email = get(message, 'properties.email') || get(message, 'context.traits.email');
    if (!email) {
      logger.error('email is required for track');
      return;
    }

    let payload = get(message, 'properties');

    if (isDefinedAndNotNull(payload.revenue)) {
      const cents = Math.round(payload.revenue * 100);
      if (cents) {
        payload.value = cents;
      }

      delete payload.revenue;
    }

    payload = {
      ...payload,
      email,
      occurred_at: get(message, 'properties.occurred_at') || get(message, 'originalTimestamp'),
    };

    payload = removeUndefinedAndNullValues(payload);
    window._dcq.push(['track', event, payload]);
  }
}

export default Drip;
