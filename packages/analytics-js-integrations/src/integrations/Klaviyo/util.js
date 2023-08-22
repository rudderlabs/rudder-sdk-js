/* eslint-disable no-param-reassign */
import get from 'get-value';
import { isNotEmpty, removeUndefinedAndNullValues } from '../../utils/commonUtils';

const categoryKey = 'properties.categories';

const itemsPayload = item => {
  const itemObj = {
    ProductID: item.product_id,
    SKU: item.sku,
    ProductName: item.name,
    Quantity: item.quantity,
    ItemPrice: item.price,
    RowTotal: item.total,
    ProductURL: item.url,
    ImageURL: item.image_url,
    ProductCategories: item.categories,
  };
  return itemObj;
};

/**
 * Returns items array
 * @param {*} items
 * @returns
 */
const prepareItemsArray = items => {
  const itemArr = [];
  items.forEach(element => {
    let item = itemsPayload(element);
    item = removeUndefinedAndNullValues(item);
    if (isNotEmpty(item)) {
      itemArr.push(item);
    }
  });
  return itemArr;
};

const ecommEventPayload = (event, message) => {
  let payload = {};
  switch (event) {
    case 'Viewed Product': {
      payload.ProductName = get(message, 'properties.name');
      payload.ProductID = get(message, 'properties.product_id');
      payload.SKU = get(message, 'properties.sku');
      payload.ImageURL = get(message, 'properties.image_url');
      payload.URL = get(message, 'properties.url');
      payload.Brand = get(message, 'properties.brand');
      payload.Price = get(message, 'properties.price');
      payload.CompareAtPrice = get(message, 'properties.compare_at_price');
      payload.Categories = get(message, categoryKey);
      break;
    }
    case 'Added to Cart': {
      payload.$value = get(message, 'properties.value');
      payload.AddedItemProductName = get(message, 'properties.name');
      payload.AddedItemProductID = get(message, 'properties.product_id');
      payload.AddedItemSKU = get(message, 'properties.sku');
      payload.AddedItemImageURL = get(message, 'properties.image_url');
      payload.AddedItemURL = get(message, 'properties.url');
      payload.AddedItemPrice = get(message, 'properties.price');
      payload.AddedItemQuantity = get(message, 'properties.quantity');
      payload.AddedItemCategories = get(message, categoryKey);
      payload.ItemNames = get(message, 'properties.item_names');
      payload.CheckoutURL = get(message, 'properties.checkout_url');
      if (message.properties.items && Array.isArray(message.properties.items)) {
        payload.Items = prepareItemsArray(message.properties.items);
      }
      break;
    }
    case 'Started Checkout': {
      payload.$event_id = get(message, 'properties.order_id');
      payload.$value = get(message, 'properties.value');
      payload.Categories = get(message, categoryKey);
      payload.CheckoutURL = get(message, 'properties.checkout_url');
      payload.ItemNames = get(message, 'item_names');
      if (message.properties.items && Array.isArray(message.properties.items)) {
        payload.Items = prepareItemsArray(message.properties.items);
      }
      break;
    }
    default:
      break;
  }
  if (payload) {
    payload = removeUndefinedAndNullValues(payload);
  }
  return payload;
};

export default ecommEventPayload;
