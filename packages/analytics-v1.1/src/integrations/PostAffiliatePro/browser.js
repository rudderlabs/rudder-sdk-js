/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import get from 'get-value';
import updateSaleObject from './utils';
import ScriptLoader from '../../utils/ScriptLoader';
import logger from '../../utils/logUtil';
import { NAME } from './constants';

class PostAffiliatePro {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.name = NAME;
    this.url = config.url;
    this.mergeProducts = config.mergeProducts;
    this.accountId = config.accountId;
    this.affLinkId = config.affLinkId;
    this.idName = config.idName;
    this.cookieLinkId = config.cookieLinkId;
    this.cookieName = config.cookieName;
    this.affiliateToCustomField = config.affiliateToCustomField;
    this.campaignToCustomField = config.campaignToCustomField;
    this.cookieDomain = config.cookieDomain;
    this.cookieToCustomField = config.cookieToCustomField;
    this.disableTrackingMethod = config.disableTrackingMethod;
    this.paramNameUserId = config.paramNameUserId;
    this.clickEvents = config.clickEvents;
    this.areTransformationsConnected = destinationInfo && destinationInfo.areTransformationsConnected;
    this.destinationId = destinationInfo && destinationInfo.destinationId;
  }

  init() {
    logger.debug('===in init Post Affiliate Pro===');
    if (!this.url) {
      logger.debug('URL is missing');
      return;
    }
    ScriptLoader('pap_x2s6df8d', this.url);
  }

  isLoaded() {
    logger.debug('===In isLoaded Post Affiliate Pro===');
    return !!window.PostAffTracker;
  }

  isReady() {
    logger.debug('===In isReady Post Affiliate Pro===');

    if (window.PostAffTracker) {
      if (!this.disableTrackingMethod) window.PostAffTracker.disableTrackingMethod('F');
      if (this.paramNameUserId) window.PostAffTracker.setParamNameUserId(this.paramNameUserId);
      if (this.accountId) window.PostAffTracker.setAccountId(this.accountId);
      if (this.cookieDomain) window.PostAffTracker.setCookieDomain(this.cookieDomain);
      if (this.cookieToCustomField)
        window.PostAffTracker.writeCookieToCustomField(this.cookieToCustomField);
      if (this.affiliateToCustomField)
        window.PostAffTracker.writeAffiliateToCustomField(this.affiliateToCustomField);
      if (this.campaignToCustomField)
        window.PostAffTracker.writeCampaignToCustomField(this.campaignToCustomField);
      if (this.affLinkId && this.idName)
        window.PostAffTracker.writeAffiliateToLink(this.affLinkId, this.idName);
      if (this.cookieName && this.cookieLinkId)
        window.PostAffTracker.writeCookieToLink(this.cookieLinkId, this.cookieName);
      return true;
    }
    return false;
  }

  identify(rudderElement) {
    logger.debug('===In Post Affiliate Pro identify===');
    const { message } = rudderElement;
    const visitorId = get(message, 'userId');
    window.PostAffTracker.setVisitorId(visitorId);
  }
  // eslint-disable-next-line lines-between-class-members
  track(rudderElement) {
    logger.debug('===In Post Affiliate Pro track===');
    const clickEventsArr = this.clickEvents ? this.clickEvents.split(',') : null;
    const { message } = rudderElement;
    const { event } = message;
    const { properties } = message;
    // We are going to call click event, for the event list given in dashboard only.
    if (clickEventsArr && clickEventsArr.includes(event)) {
      if (properties) {
        if (properties.data1) window.Data1 = properties.data1;
        if (properties.data2) window.Data2 = properties.data2;
        if (properties.affiliateId) window.AffiliateID = properties.affiliateId;
        if (properties.bannerId) window.BannerID = properties.bannerId;
        if (properties.campaignId) window.CampaignID = properties.campaignId;
        if (properties.channel) window.Channel = properties.channel;
      }
      window.PostAffTracker.track();
    }
    // We are supporting only one event for sale.
    if (event === 'Order Completed') {
      const productsArr = properties && properties.products ? properties.products : null;
      if (productsArr) {
        if (this.mergeProducts) {
          window.sale = window.PostAffTracker.createSale();
          if (window.sale) updateSaleObject(window.sale, properties);
          const mergedProductId = [];
          for (let i = 0; i < productsArr.length; i += 1)
            if (productsArr[i].product_id) mergedProductId.push(productsArr[i].product_id);
          const merged = mergedProductId.join();
          if (merged) window.sale.setProductID(merged);
        } else {
          for (let i = 0; i < productsArr.length; i += 1) {
            window[`sale${i}`] = window.PostAffTracker.createSale();
            updateSaleObject(window[`sale${i}`], properties);
            if (productsArr[i].product_id)
              window[`sale${i}`].setProductID(productsArr[i].product_id);
          }
        }
      } else {
        // If any product is not available.
        window.sale = window.PostAffTracker.createSale();
      }
      window.PostAffTracker.register();
    }
  }

  // reset() {
  //   window.PostAffTracker.setVisitorId(null);
  // }
}
export default PostAffiliatePro;
