/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Fullstory/constants';
import {
  isDefined,
  isDefinedAndNotNull,
  isFunction,
  isString,
} from '@rudderstack/analytics-js-common/utilities/checks';
import Logger from '../../utils/logger';
import camelcase from '../../utils/camelcase';
import { getDestinationOptions } from './utils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class Fullstory {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.fs_org = config.fs_org;
    this.fs_debug_mode = config.fs_debug_mode;
    this.fs_host = config.fs_host || 'fullstory.com';
    this.name = NAME;
    this.analytics = analytics;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  static getFSProperties(properties) {
    const fsProperties = {};
    Object.keys(properties).forEach(key => {
      fsProperties[key === 'displayName' || key === 'email' ? key : Fullstory.camelCaseField(key)] =
        properties[key];
    });
    return fsProperties;
  }

  static camelCaseField(fieldName) {
    // Do not camel case across type suffixes.
    const parts = fieldName.split('_');
    if (parts.length > 1) {
      const typeSuffix = parts.pop();
      switch (typeSuffix) {
        case 'str':
        case 'int':
        case 'date':
        case 'real':
        case 'bool':
        case 'strs':
        case 'ints':
        case 'dates':
        case 'reals':
        case 'bools':
          return `${camelcase(parts.join('_'))}_${typeSuffix}`;
        default: // passthrough
      }
    }
    // No type suffix found. Camel case the whole field name.
    return camelcase(fieldName);
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  init() {
    loadNativeSdk(this.fs_debug_mode, this.fs_host, this.fs_org);
    const fullstoryIntgConfig = getDestinationOptions(this.analytics.loadOnlyIntegrations);
    // Checking if crossDomainSupport is their or not.
    if (fullstoryIntgConfig?.crossDomainSupport === true) {
      // This function will check if the customer hash is available or not in localStorage
      window._fs_identity = function () {
        if (window.localStorage) {
          const { tata_customer_hash: tataCustomerHash } = window.localStorage;
          if (tataCustomerHash) {
            return {
              uid: tataCustomerHash,
              displayName: tataCustomerHash,
            };
          }
        } else {
          logger.info('Unable to access localStorage');
        }

        return null;
      };

      (function () {
        function fs(api) {
          if (!isDefined(window._fs_namespace)) {
            logger.error(`FullStory unavailable, window["_fs_namespace"] must be defined`);
            return undefined;
          }
          return api ? window[window._fs_namespace][api] : window[window._fs_namespace];
        }
        function waitUntil(predicateFn, callbackFn, timeout, timeoutFn) {
          let totalTime = 0;
          let delay = 64;
          const resultFn = function () {
            if (typeof predicateFn === 'function' && predicateFn()) {
              callbackFn();
              return;
            }
            delay = Math.min(delay * 2, 1024);
            if (totalTime > timeout && timeoutFn) {
              timeoutFn();
            }
            totalTime += delay;
            setTimeout(resultFn, delay);
          };
          resultFn();
        }
        // Checking if timeout is provided or not.
        const timeout = fullstoryIntgConfig.timeout || 2000;

        function identify() {
          if (isFunction(window._fs_identity)) {
            const userVars = window._fs_identity();
            if (typeof userVars === 'object' && isString(userVars.uid)) {
              fs('setUserVars')(userVars);
              fs('restart')();
            } else {
              fs('log')('error', 'FS.setUserVars requires an object that contains uid');
            }
          } else {
            fs('log')('error', 'window["_fs_identity"] function not found');
          }
        }
        fs('shutdown')();
        waitUntil(window._fs_identity, identify, timeout, fs('restart'));
      })();
    }
  }

  isLoaded() {
    return !!window.FS;
  }

  isReady() {
    return this.isLoaded();
  }

  page(rudderElement) {
    const rudderMessage = rudderElement.message;
    const pageName = rudderMessage.name;
    const props = {
      name: pageName,
      ...rudderMessage.properties,
    };

    window.FS.event('Viewed a Page', Fullstory.getFSProperties(props));
  }

  identify(rudderElement) {
    let { userId } = rudderElement.message;
    const { context, anonymousId } = rudderElement.message;
    const { traits } = context;

    if (!isDefinedAndNotNull(userId)) userId = anonymousId;
    if (Object.keys(traits).length === 0 && traits.constructor === Object)
      window.FS.identify(userId);
    else window.FS.identify(userId, Fullstory.getFSProperties(traits));
  }

  track(rudderElement) {
    window.FS.event(
      rudderElement.message.event,
      Fullstory.getFSProperties(rudderElement.message.properties),
    );
  }
}

export default Fullstory;
