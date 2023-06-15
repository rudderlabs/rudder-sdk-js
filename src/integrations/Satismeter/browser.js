/* eslint-disable no-var */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { NAME } from './constants';
import Logger from '../../utils/logger';
import { recordSatismeterEvents } from './util';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';

const logger = new Logger(NAME);
class Satismeter {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.name = NAME;
    this.writeKey = config.writeKey;
    this.identifyAnonymousUsers = config.identifyAnonymousUsers;
    this.recordSatismeterEvents = config.recordSatismeterEvents;
    this.eventsToStandard = config.eventsToStandard;
    this.updateEventNames = config.updateEventNames;
    this.eventsList = config.eventsList;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===In init Satismeter===');
    (function () {
      window.satismeter =
        window.satismeter ||
        function () {
          (window.satismeter.q = window.satismeter.q || []).push(arguments);
        };
      window.satismeter.l = 1 * new Date();
      var script = document.createElement('script');
      var parent = document.getElementsByTagName('script')[0].parentNode;
      script.async = 1;
      script.src = 'https://app.satismeter.com/js';
      script.setAttribute('data-loader', LOAD_ORIGIN), parent.appendChild(script);
    })();

    window.satismeter({
      writeKey: this.writeKey,
    });
  }

  isLoaded() {
    logger.debug('===In isLoaded Satismeter===');
    return !!window.satismeter;
  }

  isReady() {
    logger.debug('===In isReady Satismeter===');
    if (this.recordSatismeterEvents) {
      recordSatismeterEvents(
        this.updateEventNames,
        this.eventsList,
        this.eventsToStandard,
        this.analytics,
      );
    }
    return !!window.satismeter;
  }

  identify(rudderElement) {
    logger.debug('===In Satismeter identify===');
    const { message } = rudderElement;
    const { traits } = message.context;
    let userId = message.userId || traits.userId;
    if (!userId && this.identifyAnonymousUsers) {
      userId = message.anonymousId || traits?.anonymousId;
    }
    if (userId) {
      if (!traits?.createdAt) {
        window.satismeter({
          writeKey: this.writeKey,
          userId,
          type: 'identify',
          traits: { ...traits, createdAt: message.sentAt },
        });
      }
      window.satismeter({
        writeKey: this.writeKey,
        userId,
        type: 'identify',
        traits,
      });
    }
  }

  track(rudderElement) {
    logger.debug('===In Satismeter track===');
    const { message } = rudderElement;
    const { event, context } = message;
    if (!event) {
      logger.error('[Satismeter]:: event is required for track call');
    }
    const integrationName = context.integration?.name;
    if (integrationName && integrationName.toLowerCase() === 'satismeter') {
      logger.info(`[Satismeter]:: dropping callback event: ${event}`);
      return;
    }
    window.satismeter('track', { event });
  }
}

export default Satismeter;
