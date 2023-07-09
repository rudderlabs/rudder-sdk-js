/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
import camelcase from '../../utils/camelcase';
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { loader } from './loader';

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
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  static getFSProperties(properties) {
    const FS_properties = {};
    Object.keys(properties).map(function (key, index) {
      FS_properties[
        key === 'displayName' || key === 'email' ? key : Fullstory.camelCaseField(key)
      ] = properties[key];
    });
    return FS_properties;
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

  init() {
    logger.debug('===in init FULLSTORY===');
    window._fs_debug = this.fs_debug_mode;
    window._fs_host = this.fs_host;
    window._fs_script = 'edge.fullstory.com/s/fs.js';
    window._fs_org = this.fs_org;
    window._fs_namespace = 'FS';

    loader(window, document, window._fs_namespace, 'script', 'user');
    const { FULLSTORY } = this.analytics.loadOnlyIntegrations;
    // Checking if crossDomainSupport is their or not.
    if (FULLSTORY?.crossDomainSupport === true) {
      // This function will check if the customer hash is available or not in localStorage
      window._fs_identity = function () {
        if (window.localStorage) {
          const { tata_customer_hash } = window.localStorage;
          if (tata_customer_hash) {
            return {
              uid: tata_customer_hash,
              displayName: tata_customer_hash,
            };
          }
        } else {
          logger.debug('Unable to access localStorage');
        }

        return null;
      };

      (function () {
        function fs(api) {
          if (!window._fs_namespace) {
            console.error('FullStory unavailable, window["_fs_namespace"] must be defined');
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
            if (totalTime > timeout) {
              if (timeoutFn) {
                timeoutFn();
              }
            }
            totalTime += delay;
            setTimeout(resultFn, delay);
          };
          resultFn();
        }
        // Checking if timeout is provided or not.
        const timeout = FULLSTORY.timeout || 2000;

        function identify() {
          if (typeof window._fs_identity === 'function') {
            const userVars = window._fs_identity();
            if (typeof userVars === 'object' && typeof userVars.uid === 'string') {
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

  page(rudderElement) {
    logger.debug('in FULLSORY page');
    const rudderMessage = rudderElement.message;
    const pageName = rudderMessage.name;
    const props = {
      name: pageName,
      ...rudderMessage.properties,
    };

    window.FS.event('Viewed a Page', Fullstory.getFSProperties(props));
  }

  identify(rudderElement) {
    logger.debug('in FULLSORY identify');
    let { userId } = rudderElement.message;
    const { traits } = rudderElement.message.context;
    if (!userId) userId = rudderElement.message.anonymousId;

    if (Object.keys(traits).length === 0 && traits.constructor === Object)
      window.FS.identify(userId);
    else window.FS.identify(userId, Fullstory.getFSProperties(traits));
  }

  track(rudderElement) {
    logger.debug('in FULLSTORY track');
    window.FS.event(
      rudderElement.message.event,
      Fullstory.getFSProperties(rudderElement.message.properties),
    );
  }

  isLoaded() {
    logger.debug('in FULLSTORY isLoaded');
    return !!window.FS;
  }
}

export default Fullstory;
