// This function helps to populate the sale object
const updateSaleObject = (sale, properties) => {
  const saleMethodsMap = [
    { property: 'total', method: 'setTotalCost' },
    { property: 'fixedCost', method: 'setFixedCost' },
    { property: 'order_id', method: 'setOrderID' },
    { property: 'data1', method: 'setData1' },
    { property: 'data2', method: 'setData2' },
    { property: 'data3', method: 'setData3' },
    { property: 'data4', method: 'setData4' },
    { property: 'data5', method: 'setData5' },
    { property: 'doNotDeleteCookies', method: 'doNotDeleteCookies' },
    { property: 'status', method: 'setStatus' },
    { property: 'currency', method: 'setCurrency' },
    { property: 'customCommission', method: 'setCustomCommission' },
    { property: 'channel', method: 'setChannelID' },
    { property: 'coupon', method: 'setCoupon' },
    { property: 'campaignId', method: 'setCampaignID' },
    { property: 'affiliateId', method: 'setAffiliateID' },
  ];

  saleMethodsMap.forEach(({ property, method }) => {
    if (Object.prototype.hasOwnProperty.call(properties, property)) {
      if (method === 'doNotDeleteCookies') {
        sale[method]();
      } else {
        sale[method](properties[property]);
      }
    }
  });
};

const getMergedProductIds = (productsArr) => {
  const mergedProductId = productsArr
    .filter((product) => product.product_id)
    .map((product) => product.product_id)
    .join();
  return mergedProductId;
};
export { updateSaleObject, getMergedProductIds };
