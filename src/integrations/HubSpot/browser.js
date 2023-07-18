/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import ScriptLoader from '../../utils/ScriptLoader';
import logger from '../../utils/logUtil';
import { NAME } from './constants';

class HubSpot {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.hubId = config.hubID; // 6405167
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
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

    const { traits, user_properties: userProperties } = rudderElement.message.context;
    const traitsValue = {};

    Object.keys(traits).forEach((key) => {
      if (traits[key]) {
        const value = traits[key];
        traitsValue[key] = value instanceof Date ? value.getTime() : value;
      }
    });

    Object.keys(userProperties).forEach((key) => {
      if (userProperties[key]) {
        const value = userProperties[key];
        traitsValue[key] = value;
      }
    });

    logger.debug(traitsValue);

    if (typeof window !== 'undefined') {
      const _hsq = Object.assign((window._hsq = window._hsq || []));
      _hsq.push(['identify', traitsValue]);
    }
  }

  track(rudderElement) {
    logger.debug('in HubSpotAnalyticsManager track');

    const { properties } = rudderElement.message;
    const { revenue, value } = properties;
    const _hsq = Object.assign((window._hsq = window._hsq || []));

    const eventValue = {
      id: rudderElement.message.event,
    };
    if (revenue || value) {
      eventValue.value = revenue || value;
    }

    _hsq.push(['trackEvent', eventValue]);
  }

  page(rudderElement) {
    logger.debug('in HubSpotAnalyticsManager page');

    const { properties } = rudderElement.message;
    const { path } = properties;
    const _hsq = Object.assign((window._hsq = window._hsq || []));
    if (path) {
      _hsq.push(['setPath', path]);
    }
    _hsq.push(['trackPageView']);
  }
}

export { HubSpot };
