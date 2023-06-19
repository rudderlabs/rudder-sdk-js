/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import ScriptLoader from '../../utils/ScriptLoader';
import { recordQualarooEvents, transformUserTraits } from './utils';
import { isNotEmpty } from '../../utils/commonUtils';

class Qualaroo {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.customerId = config.customerId;
    this.siteToken = config.siteToken;
    this.recordQualarooEvents = config.recordQualarooEvents;
    this.eventsToStandard = config.eventsToStandard;
    this.updateEventNames = config.updateEventNames;
    this.eventsList = config.eventsList;
    this.enableTransformationForDeviceMode =
      destinationInfo && destinationInfo.enableTransformationForDeviceMode;
    this.propagateEventsUntransformedOnError =
      destinationInfo && destinationInfo.propagateEventsUntransformedOnError;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  loadScript() {
    window._kiq = window._kiq || [];
    ScriptLoader(
      'qualaroo-integration',
      `https://cl.qualaroo.com/ki.js/${this.customerId}/${this.siteToken}.js`,
    );
  }

  init() {
    logger.debug('===In init Qualaroo===');
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded Qualaroo===');
    return !!window._kiq && typeof window._kiq === 'object';
  }

  isReady() {
    logger.debug('===In isReady Qualaroo===');
    if (this.recordQualarooEvents) {
      recordQualarooEvents(
        this.updateEventNames,
        this.eventsList,
        this.eventsToStandard,
        this.analytics,
      );
    }
    return !!window._kiq && typeof window._kiq === 'object';
  }

  identify(rudderElement) {
    logger.debug('===In Qualaroo identify===');
    const { message } = rudderElement;
    const { traits } = message.context;
    const userId = traits?.email || message.userId || traits?.userId || traits?.Id || '';

    if (traits?.email) {
      delete traits.email;
    }
    const transformedTraits = transformUserTraits(traits);

    // If userId is not passed in the request, an empty string will be send for unknown visitors.
    // ref :- https://help.qualaroo.com/hc/en-us/articles/201956628-Using-the-Identity-API-call#:~:text=echo%20%24current_user%2D%3Eemail%20%3F%3E%27%5D)%3B-,Note,-%3A%20Our%20system
    window._kiq.push(['identify', userId]);

    if (isNotEmpty(transformedTraits)) {
      window._kiq.push(['set', transformedTraits]);
    }
  }

  track(rudderElement) {
    logger.debug('===In Qualaroo track===');
    const { message } = rudderElement;
    const { event, context } = message;
    if (!event) {
      logger.error('[Qualaroo]:: event is required for track call');
      return;
    }

    const integrationName = context.integration?.name;
    if (integrationName && integrationName === 'Qualaroo') {
      logger.debug(`[Qualaroo]:: dropping callback event: ${event}`);
      return;
    }

    window._kiq.push(['set', { 'Triggered Event': event }]);
  }

  page(rudderElement) {
    logger.debug('===In Qualaroo page===');
    const { name, category } = rudderElement.message;
    let pageFullName;
    if (name && category) {
      pageFullName = `${category} ${name}`;
    } else if (name) {
      pageFullName = name;
    } else if (category) {
      pageFullName = category;
    }

    if (pageFullName) {
      window._kiq.push(['set', { 'Viewed Page': pageFullName }]);
    }
  }
}

export default Qualaroo;
