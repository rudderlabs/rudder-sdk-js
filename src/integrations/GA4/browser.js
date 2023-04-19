/* eslint-disable class-methods-use-this */
import ScriptLoader from '../ScriptLoader';
import Logger from '../../utils/logger';

import {
  isReservedName,
  getDestinationEventName,
  getDestinationEventProperties,
  getDestinationItemProperties,
  getPageViewProperty,
  hasRequiredParameters,
} from './utils';
import { type, flattenJsonPayload } from '../../utils/utils';
import { NAME } from './constants';

const logger = new Logger(NAME);
export default class GA4 {
  constructor(config, analytics) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.sessionId = '';
    this.analytics = analytics;
    this.measurementId = config.measurementId;
    this.capturePageView = config.capturePageView || 'rs';
    this.overrideSessionId = config.overrideSessionId || false;
    this.extendPageViewParams = config.extendPageViewParams || false;
    this.isHybridModeEnabled = config.useNativeSDKToSend === false || false;
  }

  loadScript(measurementId) {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gt() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      };
    window.gtag('js', new Date());
    const gtagParameterObject = {};

    if (this.capturePageView === 'rs') {
      gtagParameterObject.send_page_view = false;
    }
    // Setting the userId as a part of configuration
    if (this.analytics.userId) {
      gtagParameterObject.user_id = this.analytics.userId;
    }

    gtagParameterObject.cookie_prefix = 'rs';
    gtagParameterObject.client_id = this.analytics.anonymousId;
    if (this.isHybridModeEnabled && this.overrideSessionId) {
      gtagParameterObject.session_id = this.analytics.uSession.sessionInfo.id;
    }
    gtagParameterObject.debug_mode = true;

    if (Object.keys(gtagParameterObject).length === 0) {
      window.gtag('config', measurementId);
    } else {
      window.gtag('config', measurementId, gtagParameterObject);
    }

    /**
     * Setting the parameter sessionId using gtag api
     * Ref: https://developers.google.com/tag-platform/gtagjs/reference
     */
    window.gtag('get', this.measurementId, 'session_id', (sessionId) => {
      this.sessionId = sessionId;
    });

    ScriptLoader(
      'google-analytics 4',
      `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
    );
  }

  init() {
    this.loadScript(this.measurementId);
  }

  /* utility functions ---Start here ---  */

  /**
   * If the gtag is successfully initialized, client ID and session ID fields will have valid values for the given GA4 configuration
   */
  isLoaded() {
    return !!this.sessionId;
  }

  isReady() {
    return this.isLoaded();
  }

  /* utility functions --- Ends here ---  */

  /**
   * Function to get destination properties for both event parameters and items array if present
   * For top level properties, include only those properties that are in the includeList
   * @param {*} properties
   * @param {*} hasItem
   * @param {*} products
   * @param {*} includeList
   */
  getdestinationProperties(properties, hasItem, products, includeList) {
    let destinationProperties = {};
    destinationProperties = getDestinationEventProperties(
      properties,
      includeList,
      'properties',
      hasItem,
    );

    if (hasItem) {
      // only for events where GA requires an items array to be sent
      // get the product related destination keys || if products is not present use the rudder message properties to get the product related destination keys
      if (products && type(products) !== 'array') {
        logger.debug("Event payload doesn't have products array");
      }
      destinationProperties.items = getDestinationItemProperties(
        products || properties,
        destinationProperties.items,
      );
    }

    return destinationProperties;
  }

  /**
   * Only include params that are present in given mapping config for things like Cart/Product shared, Product/Products shared
   * @param {*} params
   * @param {*} properties
   */
  getIncludedParameters(params, properties) {
    const destinationProperties = {};
    if (type(params) === 'object') {
      const { defaults, mappings } = params;
      if (type(defaults) === 'object') {
        Object.keys(defaults).forEach((key) => {
          destinationProperties[key] = defaults[key];
        });
      }
      if (type(mappings) === 'object') {
        Object.keys(mappings).forEach((key) => {
          destinationProperties[mappings[key]] = properties[key];
        });
      }
    }
    return destinationProperties;
  }

  sendGAEvent(event, parameters, checkRequiredParameters, eventMappingObj) {
    if (checkRequiredParameters && !hasRequiredParameters(parameters, eventMappingObj)) {
      throw Error('Payload must have required parameters..');
    }
    const params = { ...parameters };
    params.send_to = this.measurementId;
    if (this.analytics.userId) {
      params.user_id = this.analytics.userId;
    }
    window.gtag('event', event, params);
  }

  handleEventMapper(eventMappingObj, properties, products) {
    let destinationProperties = {};
    const event = eventMappingObj.dest;
    if (eventMappingObj.onlyIncludeParams) {
      /* Only include params that are present in given mapping config for things like Cart/Product shared, Product/Products shared
       */
      const includeParams = eventMappingObj.onlyIncludeParams;
      destinationProperties = this.getIncludedParameters(includeParams, properties);
    } else {
      destinationProperties = this.getdestinationProperties(
        properties,
        eventMappingObj.hasItem,
        products,
        eventMappingObj.includeList,
      );
    }
    this.sendGAEvent(event, destinationProperties, true, eventMappingObj);
  }

  /**
   *
   * @param {*} rudderElement
   */
  track(rudderElement) {
    // if Hybrid mode is enabled, don't send data to the device-mode
    if (this.isHybridModeEnabled) {
      return;
    }

    logger.debug('In GoogleAnalyticsManager Track');
    const { event } = rudderElement.message;
    const { properties } = rudderElement.message;
    const { products } = properties;
    if (!event || isReservedName(event)) {
      throw Error('Cannot call un-named/reserved named track event');
    }
    // get GA4 event name and corresponding configs defined to add properties to that event
    const eventMappingArray = getDestinationEventName(event);
    if (eventMappingArray && eventMappingArray.length > 0) {
      eventMappingArray.forEach((events) => {
        this.handleEventMapper(events, properties, products);
      });
    } else {
      this.sendGAEvent(event, flattenJsonPayload(properties), false);
    }
  }

  identify(rudderElement) {
    // if Hybrid mode is enabled, don't send data to the device-mode
    if (this.isHybridModeEnabled) {
      return;
    }

    logger.debug('In GoogleAnalyticsManager Identify');
    window.gtag('set', 'user_properties', flattenJsonPayload(this.analytics.userTraits));
    // Setting the userId as a part of configuration
    if (rudderElement.message.userId) {
      const { userId } = rudderElement.message;
      if (this.capturePageView === 'rs') {
        window.gtag('config', this.measurementId, {
          user_id: userId,
          send_page_view: false,
        });
      } else {
        window.gtag('config', this.measurementId, {
          user_id: userId,
        });
      }
    }
  }

  page(rudderElement) {
    logger.debug('In GoogleAnalyticsManager Page');
    if (this.capturePageView === 'rs') {
      let pageProps = rudderElement.message.properties;
      if (!pageProps) return;
      pageProps = flattenJsonPayload(pageProps);
      const properties = { ...getPageViewProperty(pageProps) };
      properties.send_to = this.measurementId;
      if (this.analytics.userId) {
        properties.user_id = this.analytics.userId;
      }
      if (this.extendPageViewParams) {
        window.gtag('event', 'page_view', {
          ...pageProps,
          ...properties,
        });
      } else {
        window.gtag('event', 'page_view', properties);
      }
    }
  }

  group(rudderElement) {
    // if Hybrid mode is enabled, don't send data to the device-mode
    if (this.isHybridModeEnabled) {
      return;
    }

    logger.debug('In GoogleAnalyticsManager Group');
    const { groupId } = rudderElement.message;
    const { traits } = rudderElement.message;
    if (this.analytics.userId) {
      traits.user_id = this.analytics.userId;
    }
    traits.send_to = this.measurementId;

    getDestinationEventName(rudderElement.message.type).forEach((events) => {
      this.sendGAEvent(events.dest, {
        group_id: groupId,
        ...traits,
      });
    });
  }

  getDataForIntegrationsObject() {
    return {
      'Google Analytics 4': {
        sessionId: this.sessionId,
      },
    };
  }
}
