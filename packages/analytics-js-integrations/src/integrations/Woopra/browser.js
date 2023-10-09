/* eslint-disable class-methods-use-this */
import { NAME, DISPLAY_NAME } from '@rudderstack/analytics-js-common/constants/integrations/Woopra/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(NAME);

class Woopra {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.projectName = config.projectName;
    this.name = NAME;
    this.cookieName = config.cookieName;
    this.cookiePath = config.cookiePath;
    this.cookieDomain = config.cookieDomain;
    this.clickTracking = config.clickTracking;
    this.downloadTracking = config.downloadTracking;
    this.hideCampaign = config.hideCampaign;
    this.idleTimeout = config.idleTimeout;
    this.ignoreQueryUrl = config.ignoreQueryUrl;
    this.outgoingIgnoreSubdomain = config.outgoingIgnoreSubdomain;
    this.outgoingTracking = config.outgoingTracking;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk();
    window.Woopra.config({
      domain: this.projectName,
      cookie_name: this.cookieName,
      cookie_path: this.cookiePath,
      cookie_domain: this.cookieDomain,
      click_tracking: this.clickTracking,
      download_tracking: this.downloadTracking,
      hide_campaign: this.hideCampaign,
      idle_timeout: this.idleTimeout,
      ignore_query_url: this.ignoreQueryUrl,
      outgoing_ignore_subdomain: this.outgoingIgnoreSubdomain,
      outgoing_tracking: this.outgoingTracking,
    });
  }

  isLoaded() {
    logger.debug(`In isLoaded ${DISPLAY_NAME}`);
    return !!window?.Woopra?.loaded;
  }

  isReady() {
    logger.debug(`In isReady ${DISPLAY_NAME}`);
    return !!window.Woopra;
  }

  identify(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} identify`);
    const { traits } = rudderElement.message.context;
    if (traits) {
      window.Woopra.identify(traits).push();
    }
  }

  track(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} track`);
    const { event, properties } = rudderElement.message;
    window.Woopra.track(event, properties);
  }

  page(rudderElement) {
    logger.debug(`In ${DISPLAY_NAME} page`);
    const { name, properties, category } = rudderElement.message;
    const pageCat = category ? `${category} ` : '';
    const pageName = name ? `${name} ` : '';
    const eventName = `Viewed ${pageCat}${pageName}Page`;
    window.Woopra.track(eventName, properties);
  }
}

export default Woopra;
