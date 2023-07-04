/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { NAME } from '@rudderstack/common/constants/integrations/Mouseflow/constants';
import logger from '@rudderstack/common/v1.1/utils/logUtil';
import ScriptLoader from '@rudderstack/common/v1.1/utils/ScriptLoader';
import { setCustomVariables, addCustomVariables } from './utils';

class Mouseflow {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.websiteId = config.websiteId;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===In init mouseflow===');
    window._mfq = window._mfq || [];
    ScriptLoader(
      'mouseflow-integration',
      `https://cdn.mouseflow.com/projects/${this.websiteId}.js`,
    );
  }

  isLoaded() {
    logger.debug('===In isLoaded mouseflow===');
    return !!window.mouseflow && typeof window.mouseflow === 'object';
  }

  isReady() {
    logger.debug('===In isReady mouseflow===');
    return !!window._mfq;
  }

  /**
   * Identify.
   * for supporting userId or email
   * Ref: https://js-api-docs.mouseflow.com/#identifying-a-user
   * for supporting user traits and customVariables
   * Ref: https://js-api-docs.mouseflow.com/#setting-a-custom-variable
   * @param {Identify} identify
   */
  identify(rudderElement) {
    logger.debug('===In mouseflow Identify===');
    const { message } = rudderElement;
    const { traits } = message.context;
    const email = message.context.traits?.email || message.traits?.email;
    const userId = message.userId || email || message.anonymousId;
    window._mfq.push(['stop']);
    if (userId) window.mouseflow.identify(userId);
    window.mouseflow.start();
    setCustomVariables(traits);
    addCustomVariables(message);
  }

  /**
   * Track - tracks an event for a specific user
   * for supporting event
   * Ref: https://js-api-docs.mouseflow.com/#tagging-a-recording
   * for supporting properties and customVariables
   * Ref: https://js-api-docs.mouseflow.com/#setting-a-custom-variable
   * @param {Track} track
   */
  track(rudderElement) {
    logger.debug('===In mouseflow Track===');
    const { message } = rudderElement;
    const { event, properties } = message;
    if (!event) {
      logger.error('[mouseflow]: Event name from track call is missing!!===');
      return;
    }
    window._mfq.push(['tag', event]);
    setCustomVariables(properties);
    addCustomVariables(message);
  }

  /**
   * Page.
   * for supporting path of Page
   * Ref: https://js-api-docs.mouseflow.com/#setting-a-virtual-path
   * @param {Page} page
   */
  page(rudderElement) {
    logger.debug('===In mouseflow Page===');
    const tabPath = rudderElement.message.properties.path || rudderElement.message.context.path;
    if (tabPath) window._mfq.push(['newPageView', tabPath]);
  }
}

export default Mouseflow;
