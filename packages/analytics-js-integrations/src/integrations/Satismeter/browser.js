/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import { recordSatismeterEvents } from './util';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);
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
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.writeKey);
  }

  isLoaded() {
    return !!window.satismeter;
  }

  isReady() {
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
    const { message } = rudderElement;
    const { event, context } = message;
    if (!event) {
      logger.error('event is required for track call');
    }
    const integrationName = context.integration?.name;
    if (integrationName && integrationName.toLowerCase() === 'satismeter') {
      logger.info(`dropping callback event: ${event}`);
      return;
    }
    window.satismeter('track', { event });
  }
}

export default Satismeter;
