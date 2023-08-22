/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import ScriptLoader from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import logger from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/HubSpot/constants';
import { getDefinedTraits } from '../../utils/utils';

class HubSpot {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.hubId = config.hubID; // 6405167
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    const hubSpotJs = `https://js.hs-scripts.com/${this.hubId}.js`;
    ScriptLoader('hubspot-integration', hubSpotJs);
    logger.debug('===in init HS===');
  }

  isLoaded() {
    logger.debug('in HubSpotAnalyticsManager isLoaded');
    return !!(window._hsq && window._hsq.push !== Array.prototype.push);
  }

  isReady() {
    return !!(window._hsq && window._hsq.push !== Array.prototype.push);
  }

  identify(rudderElement) {
    logger.debug('in HubSpotAnalyticsManager identify');

    const { message } = rudderElement;
    const { traits } = message.context;

    const { userId, email } = getDefinedTraits(message);

    if (!email) {
      logger.error('Email is required');
      return;
    }

    const traitsValue = {};
    if (userId) {
      traitsValue.id = userId;
    }

    if (traits) {
      Object.keys(traits).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(traits, key)) {
          const value = traits[key];
          traitsValue[key] = value instanceof Date ? value.getTime() : value;
        }
      });
    }

    logger.debug(traitsValue);

    if (typeof window !== 'undefined') {
      window._hsq.push(['identify', traitsValue]);
    }
  }

  track(rudderElement) {
    logger.debug('in HubSpotAnalyticsManager track');

    const { properties, event } = rudderElement.message;
    const eventValue = {
      name: event,
      properties: properties || {},
    };

    window._hsq.push(['trackCustomBehavioralEvent', eventValue]);
  }

  page(rudderElement) {
    logger.debug('in HubSpotAnalyticsManager page');

    const { properties } = rudderElement.message;
    const { path } = properties;
    if (path) {
      window._hsq.push(['setPath', path]);
    }
    window._hsq.push(['trackPageView']);
  }
}

export { HubSpot };
