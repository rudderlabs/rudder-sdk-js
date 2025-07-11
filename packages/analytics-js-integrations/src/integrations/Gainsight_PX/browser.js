/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import { NAME, DISPLAY_NAME } from './constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';
import { getDestinationOptions } from './utils';

const logger = new Logger(DISPLAY_NAME);

class Gainsight_PX {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.productKey = config.productTagKey;
    this.dataCenter = !config.dataCenter ? 'US' : config.dataCenter;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    const pxConfig = getDestinationOptions(this.analytics.loadOnlyIntegrations) || {};
    loadNativeSdk(this.productKey, this.dataCenter, pxConfig);
    this.initializeMe();
  }

  initializeMe() {
    const userId = this.analytics.getUserId();

    // Only proceed with identify if user ID is defined
    if (userId) {
      const visitorObj = { id: userId, ...this.analytics.getUserTraits() };

      const accountObj = {
        id: this.analytics.getGroupId(),
        ...this.analytics.getGroupTraits(),
      };

      window.aptrinsic('identify', visitorObj, accountObj);
    }
  }

  isLoaded() {
    return !!window.aptrinsic?.init;
  }

  isReady() {
    return this.isLoaded();
  }

  /* utility functions --- Ends here ---  */

  /*
   * Gainsight_PX MAPPED FUNCTIONS :: identify, track, group
   */

  identify(rudderElement) {
    let visitorObj = {};
    const accountObj = {};
    const { userId, context } = rudderElement.message;
    const id = userId;
    const userTraits = context?.traits || {};
    visitorObj = {
      id,
      ...userTraits,
    };

    if (!userId) {
      return;
    }
    window.aptrinsic('identify', visitorObj, accountObj);
  }

  /*
   *Group call maps to an account for which visitor belongs.
   *It is same as identify call
   */
  group(rudderElement) {
    let accountObj = {};
    let visitorObj = {};
    const { userId, traits, context, groupId, anonymousId } = rudderElement.message;
    accountObj.id = groupId || anonymousId;
    accountObj = {
      ...accountObj,
      ...traits,
    };

    const userTraits = context?.traits || {};
    if (userId) {
      visitorObj = {
        id: userId,
        ...userTraits,
      };
    }

    window.aptrinsic('identify', visitorObj, accountObj);
  }

  // Custom Events
  track(rudderElement) {
    const { event, properties } = rudderElement.message;
    if (!event) {
      logger.error('Cannot send un-named custom event');
      return;
    }
    const props = properties;
    window.aptrinsic('track', event, props);
  }
}

export default Gainsight_PX;
