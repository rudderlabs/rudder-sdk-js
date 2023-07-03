/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import ScriptLoader from '../../utils/ScriptLoader';
import { sendUserId, prepareParamsAndEventName, formatAndValidateEventName } from './utils';
import { NAME } from './constants';
import { eventsConfig } from './config';
import { Cookie } from '../../utils/storage/cookie';
import { constructPayload, flattenJsonPayload } from '../../utils/utils';

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

    // Setting the userId as part of the configuration
    if (sendUserId(this.analytics.loadOnlyIntegrations) && this.analytics.getUserId()) {
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

    // Set user traits as part of global gtag object
    const userTraits = flattenJsonPayload(this.analytics.getUserTraits());
    if (Object.keys(userTraits).length > 0) {
      window.gtag('set', 'user_properties', userTraits);
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

  /**
   * If the gtag is successfully initialized, client ID and session ID fields will have valid values for the given GA4 configuration
   */
  isLoaded() {
    return !!(this.sessionId && this.clientId);
  }

  isReady() {
    return this.isLoaded();
  }

  /**
   *
   * @param {*} rudderElement
   */
  identify(rudderElement) {
    logger.debug('In Google Analytics 4 Identify');

    const userTraits = this.analytics.getUserTraits();
    window.gtag('set', 'user_properties', flattenJsonPayload(userTraits));

    if (sendUserId(rudderElement.message.integrations) && rudderElement.message.userId) {
      const { userId } = rudderElement.message;
      window.gtag('config', this.measurementId, { user_id: userId });
    }
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

    logger.debug('In Google Analytics 4 Track');

    const { message } = rudderElement;
    const { integrations } = message;

    const eventName = formatAndValidateEventName(message?.event);
    if (!eventName) {
      logger.error('Event name is required');
      return;
    }

    const data = prepareParamsAndEventName(message, eventName);
    if (!data) {
      return;
    }

    const { params, event } = data;
    const parameters = this.addSendToAndMeasurementIdToPayload(params, integrations);

    window.gtag('event', event, parameters);
  }

  /**
   *
   * @param {*} rudderElement
   */
  page(rudderElement) {
    logger.debug('In Google Analytics 4 Page');

    if (this.capturePageView === 'rs') {
      const { message } = rudderElement;
      const { properties, integrations } = message;

      let payload = constructPayload(message, eventsConfig.PAGE.mapping);
      payload = this.addSendToAndMeasurementIdToPayload(payload, integrations);

      if (this.extendPageViewParams) {
        window.gtag('event', 'page_view', {
          ...flattenJsonPayload(properties),
          ...payload,
        });
      } else {
        window.gtag('event', 'page_view', payload);
      }
    }
  }

  /**
   *
   * @param {*} rudderElement
   * @returns
   */
  group(rudderElement) {
    if (this.isHybridModeEnabled) {
      return;
    }

    logger.debug('In Google Analytics 4 Group');

    const { groupId, traits, integrations } = rudderElement.message;
    let payload = traits;
    payload = this.addSendToAndMeasurementIdToPayload(payload, integrations);

    const eventData = {
      group_id: groupId,
      ...payload,
    };

    window.gtag('event', 'join_group', eventData);
  }

  /**
   * Adds send_to and user_id with payload
   * @param {*} params
   * @param {*} integrations
   * @returns
   */
  addSendToAndMeasurementIdToPayload(params, integrations) {
    const parameters = params;
    parameters.send_to = this.measurementId;
    if (sendUserId(integrations) && this.analytics.getUserId()) {
      parameters.user_id = this.analytics.getUserId();
    }
    return parameters;
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
