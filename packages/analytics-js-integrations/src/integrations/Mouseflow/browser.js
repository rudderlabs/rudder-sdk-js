/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Mouseflow/constants';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import Logger from '../../utils/logger';
import { setCustomVariables, addCustomVariables } from './utils';

const logger = new Logger(DISPLAY_NAME);

class Mouseflow {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.websiteId = config.websiteId;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    window._mfq = window._mfq || [];
    ScriptLoader(
      'mouseflow-integration',
      `https://cdn.mouseflow.com/projects/${this.websiteId}.js`,
    );
  }

  isLoaded() {
    return !!window.mouseflow && typeof window.mouseflow === 'object';
  }

  isReady() {
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
    const { message } = rudderElement;
    const { context, traits: rootLevelTraits, anonymousId } = message;
    const { traits } = context;
    const email = traits?.email || rootLevelTraits?.email;
    const userId = message?.userId || email || anonymousId;
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
    const { message } = rudderElement;
    const { event, properties } = message;
    if (!event) {
      logger.error('Event name from track call is missing');
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
    const tabPath = rudderElement.message.properties.path || rudderElement.message.context.path;
    if (tabPath) window._mfq.push(['newPageView', tabPath]);
  }
}

export default Mouseflow;
