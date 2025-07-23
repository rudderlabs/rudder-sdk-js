/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import { recordingLiveChatEvents } from './utils';
import { getHashFromArray } from '../../utils/commonUtils';
import { getDefinedTraits } from '../../utils/utils';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);
class Olark {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.siteId = config.siteId;
    this.groupId = config.groupId;
    this.recordLiveChatEvents = config.recordLiveChatEvents;
    this.standardToEvent = config.standardToEvent;
    this.updateEventNames = config.updateEventNames;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadScript() {
    loadNativeSdk();
    /* custom configuration goes here (www.olark.com/documentation) */
    window.olark.identify(this.siteId);

    if (this.groupId) {
      window.olark('api.chat.setOperatorGroup', { group: this.groupId });
    }
  }

  init() {
    this.loadScript();
  }

  isLoaded() {
    return !!window.olark;
  }

  isReady() {
    // Dashboard Other Settings
    if (this.recordLiveChatEvents) {
      const standardEventsMap = getHashFromArray(this.standardToEvent, 'from', 'to', false);

      recordingLiveChatEvents(this.updateEventNames, standardEventsMap, this.analytics);
    }
    return !!window.olark;
  }

  identify(rudderElement) {
    const { message } = rudderElement;
    const { context } = message;

    const userTraits = getDefinedTraits(message);

    if (context.traits) {
      const { traits } = context;
      window.olark('api.visitor.updateCustomFields', traits);
    }

    if (userTraits?.email) {
      window.olark('api.visitor.updateEmailAddress', {
        emailAddress: userTraits.email,
      });
    }

    if (userTraits?.name) {
      window.olark('api.visitor.updateFullName', {
        fullName: userTraits.name,
      });
    }

    if (userTraits?.phone) {
      window.olark('api.visitor.updatePhoneNumber', {
        phoneNumber: userTraits.phone,
      });
    }
  }
}

export default Olark;
