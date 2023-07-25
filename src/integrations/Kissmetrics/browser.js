/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import is from 'is';
import extend from '@ndhoule/extend';
import each from 'component-each';
import { getRevenue } from '../../utils/utils';
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { loadeNativeSdk } from './nativeSdkLoader';

class Kissmetrics {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.apiKey = config.apiKey;
    this.prefixProperties = config.prefixProperties;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init Kissmetrics===');
    loadeNativeSdk(this.apiKey);

    if (this.isEnvMobile()) {
      window._kmq.push(['set', { 'Mobile Session': 'Yes' }]);
    }
  }

  isLoaded() {
    return is.object(window.KM);
  }

  isReady() {
    return is.object(window.KM);
  }

  isEnvMobile() {
    return (
      navigator.userAgent.match(/android/i) ||
      navigator.userAgent.match(/blackberry/i) ||
      navigator.userAgent.match(/iemobile/i) ||
      navigator.userAgent.match(/opera mini/i) ||
      navigator.userAgent.match(/ipad/i) ||
      navigator.userAgent.match(/iphone|ipod/i)
    );
  }

  // source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
  toUnixTimestamp(date) {
    const newDate = new Date(date);
    return Math.floor(newDate.getTime() / 1000);
  }

  // source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
  clean(obj) {
    let ret = {};

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value) {
        if (is.date(value)) {
          // convert date to unix
          ret[key] = this.toUnixTimestamp(value);
        } else if (is.bool(value) || is.number(value)) {
          // leave boolean and  numbers as is
          ret[key] = value;
        } else if (value.toString() !== '[object Object]') {
          // convert non objects to strings
          logger.debug(value.toString());
          ret[key] = value.toString();
        } else {
          // json
          // must flatten including the name of the original trait/property
          const nestedObj = {};
          nestedObj[key] = value;
          const flattenedObj = this.flatten(nestedObj, { safe: true });

          // stringify arrays inside nested object to be consistent with top level behavior of arrays
          Object.keys(flattenedObj).forEach((objKey) => {
            if (is.array(flattenedObj[objKey])) {
              flattenedObj[objKey] = flattenedObj[objKey].toString();
            }
          });

          ret = extend(ret, flattenedObj);
          delete ret[key];
        }
      }
    });
    return ret;
  }

  // source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
  flatten(target, opts) {
    const options = opts || {};

    const delimiter = options.delimiter || '.';
    let { maxDepth } = options;
    const { safe } = options;
    let currentDepth = 1;
    const output = {};

    // eslint-disable-next-line consistent-return
    function step(object, prev) {
      // eslint-disable-next-line no-restricted-syntax
      for (const key in object) {
        if (object[key]) {
          const value = object[key];
          const isarray = safe && is.array(value);
          const type = Object.prototype.toString.call(value);
          const isobject = type === '[object Object]' || type === '[object Array]';
          const arr = [];

          const newKey = prev ? prev + delimiter + key : key;

          if (!options.maxDepth) {
            maxDepth = currentDepth + 1;
          }

          Object.keys(value).forEach((valueKey) => {
            if (value[valueKey]) {
              arr.push(valueKey);
            }
          });

          if (!isarray && isobject && arr.length > 0 && currentDepth < maxDepth) {
            // eslint-disable-next-line no-plusplus
            ++currentDepth;
            return step(value, newKey);
          }

          output[newKey] = value;
        }
      }
    }

    step(target);

    return output;
  }

  //  source : https://github.com/segment-integrations/analytics.js-integration-kissmetrics/blob/master/lib/index.js
  prefix(event, properties) {
    const prefixed = {};
    each(properties, (key, val) => {
      if (key === 'Billing Amount') {
        prefixed[key] = val;
      } else if (key === 'revenue') {
        prefixed[`${event} - ${key}`] = val;
        prefixed['Billing Amount'] = val;
      } else {
        prefixed[`${event} - ${key}`] = val;
      }
    });
    return prefixed;
  }

  identify(rudderElement) {
    logger.debug('in KissMetrics identify');

    const { userId, context } = rudderElement.message;
    const { traits } = context;
    const userTraits = this.clean(traits);

    if (userId && userId !== '') {
      window._kmq.push(['identify', userId]);
    }
    if (traits) {
      window._kmq.push(['set', userTraits]);
    }
  }

  track(rudderElement) {
    logger.debug('in KissMetrics track');

    const { event } = rudderElement.message;
    let properties = JSON.parse(JSON.stringify(rudderElement.message.properties));
    const timestamp = this.toUnixTimestamp(new Date());

    const revenue = getRevenue(properties);
    if (revenue) {
      properties.revenue = revenue;
    }

    const { products } = properties;
    if (products) {
      delete properties.products;
    }

    properties = this.clean(properties);
    logger.debug(JSON.stringify(properties));

    if (this.prefixProperties) {
      properties = this.prefix(event, properties);
    }
    window._kmq.push(['record', event, properties]);

    const iterator = function pushItem(product, i) {
      let item = product;
      if (this.prefixProperties) item = this.prefix(event, item);
      item._t = timestamp + i;
      item._d = 1;
      window.KM.set(item);
    }.bind(this);

    if (products) {
      window._kmq.push(() => {
        each(products, iterator);
      });
    }
  }

  page(rudderElement) {
    logger.debug('in KissMetrics page');

    let { properties } = rudderElement.message;
    const pageName = rudderElement.message.name;
    const pageCategory = properties.category || undefined;
    let name = 'Loaded a Page';
    if (pageName) {
      name = `Viewed ${pageName} page`;
    }
    if (pageCategory && pageName) {
      name = `Viewed ${pageCategory} ${pageName} page`;
    }

    if (this.prefixProperties) {
      properties = this.prefix('Page', properties);
    }

    window._kmq.push(['record', name, properties]);
  }

  alias(rudderElement) {
    logger.debug('in KissMetrics alias');

    const { previousId, userId } = rudderElement.message;
    window._kmq.push(['alias', userId, previousId]);
  }

  group(rudderElement) {
    logger.debug('in KissMetrics group');

    const { groupId, traits } = rudderElement.message;
    const groupTraits = this.prefix('Group', traits);
    if (groupId) {
      groupTraits['Group - id'] = groupId;
    }
    window._kmq.push(['set', groupTraits]);
  }
}

export { Kissmetrics };
