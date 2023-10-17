/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import get from 'get-value';
import { ScriptLoader } from '@rudderstack/analytics-js-common/v1.1/utils/ScriptLoader';
import {
  NAME,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/PostAffiliatePro/constants';
import Logger from '../../utils/logger';
import { updateSaleObject, getMergedProductIds } from './utils';

const logger = new Logger(DISPLAY_NAME);

class PostAffiliatePro {
  constructor(config, analytics, destinationInfo) {
    if (analytics.logLevel) {
      logger.setLogLevel(analytics.logLevel);
    }
    this.analytics = analytics;
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
    ({
      shouldApplyDeviceModeTransformation: this.shouldApplyDeviceModeTransformation,
      propagateEventsUntransformedOnError: this.propagateEventsUntransformedOnError,
      destinationId: this.destinationId,
    } = destinationInfo ?? {});
  }

  init() {
    if (!this.url) {
      logger.error('URL is missing');
      return;
    }
    ScriptLoader('pap_x2s6df8d', this.url);
  }

  isLoaded() {
    return !!window.PostAffTracker;
  }

  isReady() {
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
    const { message } = rudderElement;
    const visitorId = get(message, 'userId');
    window.PostAffTracker.setVisitorId(visitorId);
  }

  track(rudderElement) {
    const clickEventsArr = this.clickEvents ? this.clickEvents.split(',') : null;
    const { message } = rudderElement;
    const { event } = message;
    const { properties } = message;

    // We are going to call click event, for the event list given in dashboard only.
    if (clickEventsArr?.includes(event)) {
      if (properties) {
        const rudderToWindowPropertiesMap = [
          { property: 'data1', windowProperty: 'Data1' },
          { property: 'data2', windowProperty: 'Data2' },
          { property: 'affiliateId', windowProperty: 'AffiliateID' },
          { property: 'bannerId', windowProperty: 'BannerID' },
          { property: 'campaignId', windowProperty: 'CampaignID' },
          { property: 'channel', windowProperty: 'Channel' },
        ];

        rudderToWindowPropertiesMap.forEach(({ property, windowProperty }) => {
          if (Object.prototype.hasOwnProperty.call(properties, property)) {
            window[windowProperty] = properties[property];
          }
        });
      }
      window.PostAffTracker.track();
    }

    // We are supporting only one event for sale.
    if (event === 'Order Completed') {
      const productsArr = properties?.products || null;
      if (productsArr && this.mergeProducts) {
        window.sale = window.PostAffTracker.createSale();
        if (window.sale) updateSaleObject(window.sale, properties);
        const merged = getMergedProductIds(productsArr);
        window.sale.setProductID(merged);
      } else if (productsArr) {
        productsArr.forEach((product, index) => {
          window[`sale${index}`] = window.PostAffTracker.createSale();
          updateSaleObject(window[`sale${index}`], properties);
          if (product.product_id) {
            window[`sale${index}`].setProductID(product.product_id);
          }
        });
      } else {
        // If any product is not available
        window.sale = window.PostAffTracker.createSale();
      }
      window.PostAffTracker.register();
    }
  }
}
export default PostAffiliatePro;
