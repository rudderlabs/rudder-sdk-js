/* eslint-disable class-methods-use-this */
/* eslint-disable lines-between-class-members */
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/Pendo/constants';
import Logger from '../../utils/logger';
import { loadNativeSdk } from './nativeSdkLoader';

const logger = new Logger(DISPLAY_NAME);

class Pendo {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
    this.apiKey = !config.apiKey ? '' : config.apiKey;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    loadNativeSdk(this.apiKey);
    this.initializeMe();
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

  isLoaded() {
    return !!(window.pendo && window.pendo.push !== Array.prototype.push);
  }

  isReady() {
    return this.isLoaded();
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
    const { userId, anonymousId } = rudderElement.message;
    const id = userId || this.constructPendoAnonymousId(anonymousId);
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
        ...context?.traits,
      };
    }

    window.pendo.identify({ account: accountObj, visitor: visitorObj });
  }

  /* Once user is identified Pendo makes Track call to track user activity.
   */
  track(rudderElement) {
    const { event, properties } = rudderElement.message;
    if (!event) {
      logger.error('Cannot call un-named track event');
      return;
    }
    const props = properties;
    window.pendo.track(event, props);
  }
}

export { Pendo };
