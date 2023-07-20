/* eslint-disable no-var */
/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable class-methods-use-this */
import { LOAD_ORIGIN } from '@rudderstack/analytics-js-common/v1.1/utils/constants';
import { NAME } from '@rudderstack/analytics-js-common/constants/integrations/Lemnisk/constants';
import Logger from '../../utils/logger';

const logger = new Logger(NAME);
class Lemnisk {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.accountId = config.accountId;
    this.sdkWriteKey = config.sdkWriteKey;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init Lemnisk Marketing Automation===');
    (function (window, tag, o, a, r) {
      var methods = ['init', 'page', 'track', 'identify'];
      window.lmSMTObj = window.lmSMTObj || [];

      for (var i = 0; i < methods.length; i++) {
        lmSMTObj[methods[i]] = (function (methodName) {
          return function () {
            lmSMTObj.push([methodName].concat(Array.prototype.slice.call(arguments)));
          };
        })(methods[i]);
      }
      // eslint-disable-next-line no-param-reassign
      a = o.getElementsByTagName('head')[0];
      // eslint-disable-next-line no-param-reassign
      r = o.createElement('script');
      r.setAttribute('data-loader', LOAD_ORIGIN);
      r.type = 'text/javascript';
      r.async = 1;
      r.src = tag;
      a.appendChild(r);
    })(
      window,
      document.location.protocol === 'https:'
        ? `https://cdn25.lemnisk.co/ssp/st/${this.accountId}.js`
        : `http://cdn25.lemnisk.co/ssp/st/${this.accountId}.js`,
      document,
    );
    window.lmSMTObj.init(this.sdkWriteKey);
  }

  isLoaded() {
    logger.debug('===In isLoaded Lemnisk Marketing Automation===');
    return !!window.lmSMTObj;
  }

  isReady() {
    logger.debug('===In isReady Lemnisk Marketing Automation===');
    return !!window.lmSMTObj;
  }

  identify(rudderElement) {
    logger.debug('===In Lemnisk Marketing Automation identify===');
    const userId = rudderElement.message.userId || rudderElement.message.anonymousId;
    if (!userId) {
      logger.debug('[Lemnisk] identify:: user id is required');
      return;
    }
    // disabling eslint as message will be there iinn any case
    // eslint-disable-next-line no-unsafe-optional-chaining
    const { traits } = rudderElement.message?.context;
    if (traits) {
      window.lmSMTObj.identify(rudderElement.message.userId, traits);
    } else {
      window.lmSMTObj.identify(rudderElement.message.userId);
    }
  }

  track(rudderElement) {
    logger.debug('===In Lemnisk Marketing Automation track===');
    const { event, properties } = rudderElement.message;

    if (!event) {
      logger.error('[Lemnisk] track:: Event name is missing!');
      return;
    }
    if (properties) {
      window.lmSMTObj.track(event, properties);
    } else {
      window.lmSMTObj.track(event);
    }
  }

  page(rudderElement) {
    logger.debug('===In Lemnisk Marketing Automation page===');
    const { name, properties } = rudderElement.message;
    if (name && !properties) {
      window.lmSMTObj.page(name);
    } else if (!name && properties) {
      window.lmSMTObj.page(properties);
    } else if (name && properties) {
      window.lmSMTObj.page(name, properties);
    } else {
      window.lmSMTObj.page();
    }
  }
}
export default Lemnisk;
