/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */

import logger from '../../utils/logUtil';
import { NAME } from './constants';

class ActiveCampaign {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.actId = config.actid;
    this.name = NAME;
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  loadScript() {
    (function(e,t,o,n,p,r,i){e.visitorGlobalObjectAlias=n;e[e.visitorGlobalObjectAlias]=e[e.visitorGlobalObjectAlias]||function(){(e[e.visitorGlobalObjectAlias].q=e[e.visitorGlobalObjectAlias].q||[]).push(arguments)};e[e.visitorGlobalObjectAlias].l=(new Date).getTime();r=t.createElement("script");r.src=o;r.async=true;i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)})
    (window,document,"https://diffuser-cdn.app-us1.com/diffuser/diffuser.js","vgo");
    window.vgo('setAccount', this.actId);
    window.vgo('setTrackByDefault', true);
    window.vgo('process');
  }

  init() {
    logger.debug('===In init ActiveCampaign===');

    if (!this.actId) {
      logger.debug('actId missing');
      return;
    }
    this.loadScript();
  }

  isLoaded() {
    logger.debug('===In isLoaded ActiveCampaign===');
    return !!window.vgo;
  }

  isReady() {
    logger.debug('===In isReady ActiveCampaign===');
    return !!window.vgo;
  }

  page() {
    window.vgo('process');
  }
}

export default ActiveCampaign;
