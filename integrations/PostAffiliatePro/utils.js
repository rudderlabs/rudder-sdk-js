// This function helps to populate the sale object
const updateSaleObject = (sale, properties) => {
  if (properties.total) sale.setTotalCost(properties.total);
  if (properties.fixedCost) sale.setFixedCost(properties.fixedCost);
  if (properties.order_id) sale.setOrderID(properties.order_id);
  // Post Affiliate Pro supports five extra data only.
  if (properties.data1) sale.setData1(properties.data1);
  if (properties.data2) sale.setData2(properties.data2);
  if (properties.data3) sale.setData3(properties.data3);
  if (properties.data4) sale.setData4(properties.data4);
  if (properties.data5) sale.setData5(properties.data5);
  if (properties.doNotDeleteCookies && properties.doNotDeleteCookies === true)
    sale.doNotDeleteCookies();
  if (properties.status) sale.setStatus(properties.status);
  if (properties.currency) sale.setCurrency(properties.currency);
  if (properties.customCommision) sale.setCustomCommission(properties.customCommision);
  if (properties.channel) sale.setChannelID(properties.channel);
  if (properties.coupon) sale.setCoupon(properties.coupon);
  if (properties.campaignId) sale.setCampaignID(properties.campaignId);
  if (properties.affiliateId) sale.setAffiliateID(properties.affiliateId);
};
export default updateSaleObject;
