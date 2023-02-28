/* eslint-disable no-param-reassign */
import get from 'get-value';
import { isNotEmpty, removeUndefinedAndNullValues } from '../../utils/commonUtils';

const itemsPayload = item => {
  const itemObj = {};
  itemObj.ProductID = item.product_id;
  itemObj.SKU = item.sku;
  itemObj.ProductName = item.name;
  itemObj.Quantity = item.quantity;
  itemObj.ItemPrice = item.price;
  itemObj.RowTotal = item.total;
  itemObj.ProductURL = item.url;
  itemObj.ImageURL = item.image_url;
  itemObj.ProductCategories = item.categories;
  return itemObj;
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
      payload.Categories = get(message, 'properties.categories');
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
      payload.AddedItemCategories = get(message, 'properties.categories');
      payload.ItemNames = get(message, 'properties.item_names');
      payload.CheckoutURL = get(message, 'properties.checkout_url');
      if (message.properties.items && Array.isArray(message.properties.items)) {
        const itemArr = [];
        message.properties.items.forEach(element => {
          let item = itemsPayload(element);
          item = removeUndefinedAndNullValues(item);
          if (isNotEmpty(item)) {
            itemArr.push(item);
          }
        });
        payload.Items = itemArr;
      }
      break;
    }
    case 'Started Checkout': {
      payload.$event_id = get(message, 'properties.order_id');
      payload.$value = get(message, 'properties.value');
      payload.Categories = get(message, 'properties.categories');
      payload.CheckoutURL = get(message, 'properties.checkout_url');
      payload.ItemNames = get(message, 'item_names');
      if (message.properties.items && Array.isArray(message.properties.items)) {
        const itemArr = [];
        message.properties.items.forEach(element => {
          let item = itemsPayload(element);
          item = removeUndefinedAndNullValues(item);
          if (isNotEmpty(item)) {
            itemArr.push(item);
          }
        });
        payload.Items = itemArr;
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
