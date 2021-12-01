/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import get from "get-value";
import logger from "../../utils/logUtil";
import ScriptLoader from "./util";

class PostAffiliatePro {
  constructor(config) {
    this.name = "POSTAFFILIATEPRO";
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
  }

  init() {
    logger.debug("===in init Post Affiliate Pro===");
    if (!this.url) {
      logger.debug("URL is missing");
      return;
    }
    ScriptLoader(this.url);
  }

  isLoaded() {
    logger.debug("===In isLoaded Post Affiliate Pro===");
    return !!window.PostAffTracker;
  }

  isReady() {
    logger.debug("===In isReady Post Affiliate Pro===");

    if (window.PostAffTracker) {
      if (!this.disableTrackingMethod)
        window.PostAffTracker.disableTrackingMethod("F");
      if (this.paramNameUserId)
        window.PostAffTracker.setParamNameUserId(this.paramNameUserId);
      if (this.accountId) window.PostAffTracker.setAccountId(this.accountId);
      if (this.cookieDomain)
        window.PostAffTracker.setCookieDomain(this.cookieDomain);
      if (this.cookieToCustomField)
        window.PostAffTracker.writeCookieToCustomField(
          this.cookieToCustomField
        );
      if (this.affiliateToCustomField)
        window.PostAffTracker.writeAffiliateToCustomField(
          this.affiliateToCustomField
        );
      if (this.campaignToCustomField)
        window.PostAffTracker.writeCampaignToCustomField(
          this.campaignToCustomField
        );
      if (this.affLinkId && this.idName)
        window.PostAffTracker.writeAffiliateToLink(this.affLinkId, this.idName);
      if (this.cookieName && this.cookieLinkId)
        window.PostAffTracker.writeCookieToLink(
          this.cookieLinkId,
          this.cookieName
        );
      return true;
    }
    return false;
  }

  identify(rudderElement) {
    logger.debug("===In Post Affiliate Pro identify===");
    const { message } = rudderElement;
    const visitorId = get(message, "userId");
    window.PostAffTracker.setVisitorId(visitorId);
  }
  // eslint-disable-next-line lines-between-class-members
  track(rudderElement) {
    logger.debug("===In Post Affiliate Pro track===");
    const clickEventsArr = this.clickEvents
      ? this.clickEvents.split(",")
      : null;
    const { message } = rudderElement;
    const { event } = message;
    const { properties } = message;
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
    if (event === "Order Completed") {
      const productsArr =
        properties && properties.products ? properties.products : null;
      if (!productsArr) {
        logger.debug(
          "===Required properties and products for Order Completed event."
        );
        return;
      }

      /* if mergeProduct is enabled we will merge the products */

      if (this.mergeProducts) {
        window.sale = window.PostAffTracker.createSale();
        if (properties.total) window.sale.setTotalCost(properties.total);
        if (properties.fixedCost)
          window.sale.setFixedCost(properties.fixedCost);
        if (properties.order_id) window.sale.setOrderID(properties.order_id);
        if (properties.data1) window.sale.setData1(properties.data1);
        if (properties.data2) window.sale.setData2(properties.data2);
        if (properties.data3) window.sale.setData3(properties.data3);
        if (properties.data4) window.sale.setData4(properties.data4);
        if (properties.data5) window.sale.setData5(properties.data5);
        if (
          properties.doNotDeleteCookies &&
          properties.doNotDeleteCookies === true
        )
          window.sale.doNotDeleteCookies();
        if (properties.status) window.sale.setStatus(properties.status);
        if (properties.currency) window.sale.setCurrency(properties.currency);
        if (properties.customCommision)
          window.sale.setCustomCommission(properties.customCommision);
        if (properties.channel) window.sale.setChannelID(properties.channel);
        if (properties.coupon) window.sale.setCoupon(properties.coupon);
        if (properties.campaignId)
          window.sale.setCampaignID(properties.campaignId);
        if (properties.affiliateId)
          window.sale.setAffiliateID(properties.affiliateId);
        const mergedProductId = [];
        for (let i = 0; i < productsArr.length; i += 1)
          mergedProductId.push(productsArr[i].product_id);
        const merged = mergedProductId.join();
        window.sale.setProductID(merged);
        window.PostAffTracker.register();
      } else {
        logger.debug("===TO DO===");
      }
    }
  }
}
export default PostAffiliatePro;
