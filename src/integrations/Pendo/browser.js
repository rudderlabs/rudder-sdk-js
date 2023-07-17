/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import logger from '../../utils/logUtil';
import { NAME } from './constants';
import { loadNativeSdk } from './nativeSdkLoader';

class Pendo {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.apiKey = !config.apiKey ? '' : config.apiKey;
    this.name = NAME;
    this.areTransformationsConnected =
      destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
    logger.debug('Config ', config);
  }

  init() {
    loadNativeSdk(this.apiKey, window, document, 'script', 'pendo');
    this.initializeMe();
    logger.debug('===in init Pendo===');
  }

  initializeMe() {
    const userId =
      this.analytics.getUserId() || this.constructPendoAnonymousId(this.analytics.getAnonymousId());

    const accountObj = {
      id: this.analytics.getGroupId(),
      ...this.analytics.getGroupTraits(),
    };
    const visitorObj = { id: userId, ...this.analytics.getUserTraits() };

    window.pendo.initialize({ account: accountObj, visitor: visitorObj });
  }

  /* utility functions ---Start here ---  */
  isLoaded() {
    return !!(window.pendo && window.pendo.push !== Array.prototype.push);
  }

  isReady() {
    return !!(window.pendo && window.pendo.push !== Array.prototype.push);
  }

  constructPendoAnonymousId(id) {
    return `_PENDO_T_${id}`;
  }
  /* utility functions --- Ends here ---  */

  /*
   * PENDO MAPPED FUNCTIONS :: identify, track, group
   */

  /* Pendo's identify call works intelligently, once u have identified a visitor/user,
   *or associated a visitor to a group/account then Pendo save this data in local storage and
   *any further upcoming calls are done taking user info from local.
   * To track user pendo maps user to Visitor in Pendo.
   */
  identify(rudderElement) {
    let visitorObj = {};
    let accountObj = {};
    const { groupId } = this.analytics;
    const id =
      this.analytics.getUserId() || this.constructPendoAnonymousId(this.analytics.getAnonymousId());
    visitorObj = {
      id,
      ...this.analytics.getUserTraits(),
    };

    if (groupId) {
      accountObj = { id: groupId, ...this.analytics.getGroupTraits() };
    }

    window.pendo.identify({ visitor: visitorObj, account: accountObj });
  }
  /*
   *Group call maps to an account for which visitor belongs.
   *It is same as identify call but here we send account object.
   */
  group(rudderElement) {
    let accountObj = {};
    let visitorObj = {};
    const { userId, traits, context } = rudderElement.message;
    accountObj.id = this.analytics.getGroupId() || this.analytics.getAnonymousId();
    accountObj = {
      ...accountObj,
      ...traits,
    };

    if (userId) {
      visitorObj = {
        id: userId,
        ...(context && context.traits),
      };
    }

    window.pendo.identify({ account: accountObj, visitor: visitorObj });
  }

  /* Once user is identified Pendo makes Track call to track user activity.
   */
  track(rudderElement) {
    const { event, properties } = rudderElement.message;
    if (!event) {
      throw Error('Cannot call un-named track event');
    }
    const props = properties;
    window.pendo.track(event, props);
  }
}

export { Pendo };
