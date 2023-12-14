/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-template-curly-in-string */
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Keen/constants';
import Logger from '../../utils/logger';

const logger = new Logger(DISPLAY_NAME);

class Keen {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.projectID = config.projectID;
    this.writeKey = config.writeKey;
    this.ipAddon = config.ipAddon;
    this.uaAddon = config.uaAddon;
    this.urlAddon = config.urlAddon;
    this.referrerAddon = config.referrerAddon;
    this.client = null;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    ScriptLoader('keen-integration', 'https://cdn.jsdelivr.net/npm/keen-tracking@4');

    const check = setInterval(checkAndInitKeen.bind(this), 1000);
    function initKeen(object) {
      const client = new window.KeenTracking({
        projectId: object.projectID,
        writeKey: object.writeKey,
      });
      return client;
    }
    function checkAndInitKeen() {
      if (typeof window.KeenTracking !== 'undefined') {
        this.client = initKeen(this);
        clearInterval(check);
      }
    }
  }

  isLoaded() {
    return !!(this.client != null);
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    let { userId } = message;
    const { context, anonymousId } = message;
    const { traits } = context;
    let properties = message?.properties || {};

    userId = userId || anonymousId;
    properties.user = {
      userId,
      traits,
    };
    properties = this.getAddOn(properties);
    this.client.extendEvents(properties);
  }

  track(rudderElement) {
    const { event } = rudderElement.message;
    let { properties } = rudderElement.message;
    properties = this.getAddOn(properties);
    this.client.recordEvent(event, properties);
  }

  page(rudderElement) {
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
    properties = this.getAddOn(properties);
    this.client.recordEvent(name, properties);
  }

  getAddOn(properties) {
    const params = properties;
    const addOns = [];
    if (this.ipAddon) {
      params.ip_address = '${keen.ip}';
      addOns.push({
        name: 'keen:ip_to_geo',
        input: {
          ip: 'ip_address',
        },
        output: 'ip_geo_info',
      });
    }
    if (this.uaAddon) {
      params.user_agent = '${keen.user_agent}';
      addOns.push({
        name: 'keen:ua_parser',
        input: {
          ua_string: 'user_agent',
        },
        output: 'parsed_user_agent',
      });
    }
    if (this.urlAddon) {
      params.page_url = document.location.href;
      addOns.push({
        name: 'keen:url_parser',
        input: {
          url: 'page_url',
        },
        output: 'parsed_page_url',
      });
    }
    if (this.referrerAddon) {
      params.page_url = document.location.href;
      params.referrer_url = document.referrer;
      addOns.push({
        name: 'keen:referrer_parser',
        input: {
          referrer_url: 'referrer_url',
          page_url: 'page_url',
        },
        output: 'referrer_info',
      });
    }
    params.keen = {
      addons: addOns,
    };
    return params;
  }
}

export { Keen };
