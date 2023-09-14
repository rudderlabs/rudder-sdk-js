/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import get from 'get-value';
import { logger } from '@rudderstack/analytics-js-common/v1.1/utils/logUtil';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Posthog/constants';
import { removeTrailingSlashes } from '../../utils/utils';
import { getXhrHeaders, getPropertyBlackList, getDestinationOptions } from './utils';
import { loadNativeSdk } from './nativeSdkLoader';

class Posthog {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.analytics = analytics;
    this.teamApiKey = config.teamApiKey;
    this.yourInstance = removeTrailingSlashes(config.yourInstance) || 'https://app.posthog.com';
    this.autocapture = config.autocapture || false;
    this.capturePageView = config.capturePageView || false;
    this.disableSessionRecording = config.disableSessionRecording || false;
    this.disableCookie = config.disableCookie || false;
    this.propertyBlackList = getPropertyBlackList(config);
    this.xhrHeaders = getXhrHeaders(config);
    this.enableLocalStoragePersistence = config.enableLocalStoragePersistence;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    const options = getDestinationOptions(this.analytics.loadOnlyIntegrations);
    if (options && !options.loadIntegration) {
      logger.debug('===[POSTHOG]: loadIntegration flag is disabled===');
      return;
    }
    loadNativeSdk();

    const configObject = {
      api_host: this.yourInstance,
      autocapture: this.autocapture,
      capture_pageview: this.capturePageView,
      disable_session_recording: this.disableSessionRecording,
      property_blacklist: this.propertyBlackList,
      disable_cookie: this.disableCookie,
    };

    if (options?.loaded) {
      configObject.loaded = options.loaded;
    }
    if (this.xhrHeaders && Object.keys(this.xhrHeaders).length > 0) {
      configObject.xhr_headers = this.xhrHeaders;
    }
    if (this.enableLocalStoragePersistence) {
      configObject.persistence = 'localStorage+cookie';
    }

    posthog.init(this.teamApiKey, configObject);
  }

  isLoaded() {
    logger.debug('in Posthog isLoaded');
    return !!window?.posthog?.__loaded;
  }

  isReady() {
    return !!window?.posthog?.__loaded;
  }

  /**
   * superproperties should be part of rudderelement.message.integrations.POSTHOG object.
   * Once we call the posthog.register api, the corresponding property will be sent along with subsequent capture calls.
   * To remove the superproperties, we call unregister api.
   */
  processSuperProperties(rudderElement) {
    const posthogIntgConfig = getDestinationOptions(rudderElement.message.integrations);
    if (posthogIntgConfig) {
      const { superProperties, setOnceProperties, unsetProperties } = posthogIntgConfig;
      if (superProperties && Object.keys(superProperties).length > 0) {
        posthog.register(superProperties);
      }
      if (setOnceProperties && Object.keys(setOnceProperties).length > 0) {
        posthog.register_once(setOnceProperties);
      }
      if (unsetProperties && unsetProperties.length > 0) {
        unsetProperties.forEach(property => {
          if (property && property.trim() !== '') {
            posthog.unregister(property);
          }
        });
      }
    }
  }

  identify(rudderElement) {
    logger.debug('in Posthog identify');

    // rudderElement.message.context will always be present as part of identify event payload.
    const { traits } = rudderElement.message.context;
    const { userId } = rudderElement.message;

    if (userId) {
      posthog.identify(userId, traits);
    }

    this.processSuperProperties(rudderElement);
  }

  track(rudderElement) {
    logger.debug('in Posthog track');

    const { event, properties } = rudderElement.message;

    this.processSuperProperties(rudderElement);

    posthog.capture(event, properties);
  }

  /**
   *
   *
   * @memberof Posthog
   */
  page(rudderElement) {
    logger.debug('in Posthog page');

    this.processSuperProperties(rudderElement);

    posthog.capture('$pageview');
  }

  group(rudderElement) {
    logger.debug('in Posthog group');
    const traits = get(rudderElement.message, 'traits');
    const groupKey = get(rudderElement.message, 'groupId');
    let groupType;
    if (traits) {
      groupType = get(traits, 'groupType');
      delete traits.groupType;
    }
    if (!groupType || !groupKey) {
      logger.error('groupType and groupKey is required for group call');
      return;
    }
    posthog.group(groupType, groupKey, traits);

    this.processSuperProperties(rudderElement);
  }
}

export default Posthog;
