/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-rest-params */
/* eslint-disable prefer-spread */
/* eslint-disable no-multi-assign */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-unused-expressions */
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import { getHashFromArrayWithDuplicate, getEventMappingFromConfig } from '../../utils/commonUtils';
import { loadNativeSdk } from './nativeSdkLoader';
import { createUserIdentifier, verifySignUpMapped } from './utils';

const logger = new Logger(DISPLAY_NAME);

class RedditPixel {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.pixelId = config.advertiserId;
    this.name = NAME;
    this.eventMappingFromConfig = config.eventMappingFromConfig;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    const traits = this.analytics.getUserTraits();
    loadNativeSdk(this.pixelId, createUserIdentifier(traits));
  }

  isLoaded() {
    return !!(window.rdt && window.rdt.pixelId === this.pixelId);
  }

  isReady() {
    return this.isLoaded();
  }

  identify(rudderElement) {
    if (!verifySignUpMapped(this.eventMappingFromConfig)) {
      window.rdt('track', 'SignUp');
    }
    const userIdentifier = createUserIdentifier(
      rudderElement.message?.context?.traits,
      rudderElement.message?.context,
    );
    /**
     * Doc Link : https://business.reddithelp.com/helpcenter/s/article/Reddit-Pixel-Advanced-Matching
     */
    if (Object.keys(userIdentifier).length > 0) {
      window.rdt('init', this.pixelId, userIdentifier);
    }
  }

  track(rudderElement) {
    const { event } = rudderElement.message;
    if (!event) {
      logger.error('Event name is required');
      return;
    }
    const eventMappingFromConfigMap = getHashFromArrayWithDuplicate(
      this.eventMappingFromConfig,
      'from',
      'to',
      false,
    );
    if (eventMappingFromConfigMap[event]) {
      // mapping event from UI
      const events = getEventMappingFromConfig(event, eventMappingFromConfigMap);
      events.forEach(ev => {
        window.rdt('track', ev);
      });
    } else {
      switch (event.toLowerCase()) {
        case 'product added':
          window.rdt('track', 'AddToCart');
          break;
        case 'product added to wishlist':
          window.rdt('track', 'AddToWishlist');
          break;
        case 'order completed':
          window.rdt('track', 'Purchase');
          break;
        case 'lead':
          window.rdt('track', 'Lead');
          break;
        case 'view content':
        case 'product viewed':
        case 'productlist viewed':
          window.rdt('track', 'ViewContent');
          break;
        case 'search':
          window.rdt('track', 'Search');
          break;
        default:
          logger.error(`Invalid event ${event}. Track call not supported`);
          break;
      }
    }
  }

  page(rudderElement) {
    window.rdt('track', 'PageVisit');
  }
}

export default RedditPixel;
