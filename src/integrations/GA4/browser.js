/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import ScriptLoader from '../../utils/ScriptLoader';

import {
  isReservedName,
  sendUserIdToGA4,
  getPageViewProperty,
  hasRequiredParameters,
  getDestinationEventName,
  getDestinationEventProperties,
  getDestinationItemProperties,
} from './utils';
import { NAME } from './constants';
import { Cookie } from '../../utils/storage/cookie';
import { type, flattenJsonPayload } from '../../utils/utils';

export default class GA4 {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.clientId = '';
    this.sessionId = '';
    this.sessionNumber = '';
    this.cookie = Cookie;
    this.analytics = analytics;
    this.measurementId = config.measurementId;
    this.debugView = config.debugView || false;
    this.capturePageView = config.capturePageView || 'rs';
    this.isHybridModeEnabled = config.connectionMode === 'hybrid';
    this.extendPageViewParams = config.extendPageViewParams || false;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
    this.overrideClientAndSessionId = config.overrideClientAndSessionId || false;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
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
    if (sendUserIdToGA4(this.analytics.loadOnlyIntegrations) && this.analytics.getUserId()) {
      gtagParameterObject.user_id = this.analytics.getUserId();
    }

    if (this.isHybridModeEnabled && this.overrideClientAndSessionId) {
      gtagParameterObject.cookie_prefix = 'rs';
      gtagParameterObject.client_id = this.analytics.getAnonymousId();
      gtagParameterObject.session_id = this.analytics.getSessionId();
    } else {
      // Cookie migration logic
      const clientCookie = this.cookie.get('rs_ga');
      const defaultGA4Cookie = this.cookie.get('_ga');
      const measurementIdArray = this.measurementId.split('-');
      const sessionCookie = this.cookie.get(`rs_ga_${measurementIdArray[1]}`);

      // Only override when both cookie with rs prefix is available and default cookie is not available
      if (!defaultGA4Cookie && clientCookie && sessionCookie) {
        const clientCookieArray = clientCookie.split('.');

        // client_id cookie : GA1.1.51545857.1686555747
        // client_id cookie : GA1.1.48512441-5e44-4860-9900-a8f6e6bc4041
        const clientId =
          clientCookieArray.length > 3
            ? `${clientCookieArray[2]}.${clientCookieArray[3]}`
            : clientCookieArray[2];

        // session_id cookie : GS1.1.1686558743.1.1.1686558965.7.0.0
        const sessionCookieArray = sessionCookie.split('.');
        const sessionId = sessionCookieArray[2];

        // Use existing client and session ids
        if (clientId) {
          gtagParameterObject.client_id = clientId;
        }
        if (sessionId) {
          gtagParameterObject.session_id = sessionId;
        }
      }

      // Remove rs prefixed cookies so that it won't used again
      this.cookie.remove('rs_ga');
      this.cookie.remove(`rs_ga_${measurementIdArray[1]}`);
    }

    if (this.debugView) {
      gtagParameterObject.debug_mode = true;
    }

    if (Object.keys(gtagParameterObject).length === 0) {
      window.gtag('config', measurementId);
    } else {
      window.gtag('config', measurementId, gtagParameterObject);
    }

    // If userTraits available, setting it as a part of global gtag object
    if (this.analytics.getUserTraits()) {
      window.gtag('set', 'user_properties', flattenJsonPayload(this.analytics.getUserTraits()));
    }

    /**
     * Setting the parameter sessionId, clientId and session_number using gtag api
     * Ref: https://developers.google.com/tag-platform/gtagjs/reference
     */
    window.gtag('get', this.measurementId, 'session_id', (sessionId) => {
      this.sessionId = sessionId;
    });
    window.gtag('get', this.measurementId, 'client_id', (clientId) => {
      this.clientId = clientId;
    });
    window.gtag('get', this.measurementId, 'session_number', (sessionNumber) => {
      this.sessionNumber = sessionNumber;
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
    return !!(this.sessionId && this.clientId);
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

  sendGAEvent(event, parameters, checkRequiredParameters, eventMappingObj, integrations) {
    if (checkRequiredParameters && !hasRequiredParameters(parameters, eventMappingObj)) {
      throw Error('Payload must have required parameters..');
    }
    const params = { ...parameters };
    params.send_to = this.measurementId;
    if (sendUserIdToGA4(integrations) && this.analytics.getUserId()) {
      params.user_id = this.analytics.getUserId();
    }
    window.gtag('event', event, params);
  }

  handleEventMapper(eventMappingObj, properties, products, integrations) {
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
    this.sendGAEvent(event, destinationProperties, true, eventMappingObj, integrations);
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
    const { properties, integrations } = rudderElement.message;
    const { products } = properties;
    if (!event || isReservedName(event)) {
      throw Error('Cannot call un-named/reserved named track event');
    }
    // get GA4 event name and corresponding configs defined to add properties to that event
    const eventMappingArray = getDestinationEventName(event);
    if (eventMappingArray && eventMappingArray.length > 0) {
      eventMappingArray.forEach((events) => {
        this.handleEventMapper(events, properties, products, integrations);
      });
    } else {
      this.sendGAEvent(event, flattenJsonPayload(properties), false, {}, integrations);
    }
  }

  identify(rudderElement) {
    logger.debug('In GoogleAnalyticsManager Identify');

    window.gtag('set', 'user_properties', flattenJsonPayload(this.analytics.getUserTraits()));
    // Setting the userId as a part of configuration
    if (sendUserIdToGA4(rudderElement.message.integrations) && rudderElement.message.userId) {
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
      if (sendUserIdToGA4(rudderElement.message.integrations) && this.analytics.getUserId()) {
        properties.user_id = this.analytics.getUserId();
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
    const { traits, integrations } = rudderElement.message;
    traits.send_to = this.measurementId;

    getDestinationEventName(rudderElement.message.type).forEach((events) => {
      this.sendGAEvent(
        events.dest,
        {
          group_id: groupId,
          ...traits,
        },
        false,
        {},
        integrations,
      );
    });
  }

  getDataForIntegrationsObject() {
    return {
      'Google Analytics 4': {
        clientId: this.clientId,
        sessionId: this.sessionId,
        sessionNumber: this.sessionNumber,
      },
    };
  }
}
