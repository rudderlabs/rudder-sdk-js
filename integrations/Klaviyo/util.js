/* eslint-disable no-param-reassign */
import get from "get-value";
import { removeUndefinedAndNullValues } from "../utils/commonUtils";

const itemsPayload = (message, payload) => {
  payload.Items.ProductID = get(message, "properties.items.product_id");
  payload.Items.SKU = get(message, "properties.items.sku");
  payload.Items.ProductName = get(message, "properties.items.name");
  payload.Items.Quantity = get(message, "properties.items.quantity");
  payload.Items.ItemPrice = get(message, "properties.items.price");
  payload.Items.RowTotal = get(message, "properties.items.total");
  payload.Items.ProductURL = get(message, "properties.items.url");
  payload.Items.ImageURL = get(message, "properties.items.image_url");
  payload.Items.ProductCategories = get(message, "properties.items.categories");
  payload.Items = removeUndefinedAndNullValues(payload.Items);
  return payload;
};

const ecommEventPayload = (event, message) => {
  let payload = {};
  switch (event.toLowerCase().trim()) {
    case "product viewed": {
      payload.ProductName = get(message, "properties.name");
      payload.ProductID = get(message, "properties.product_id");
      payload.SKU = get(message, "properties.sku");
      payload.ImageURL = get(message, "properties.image_url");
      payload.URL = get(message, "properties.url");
      payload.Brand = get(message, "properties.brand");
      payload.Price = get(message, "properties.price");
      payload.CompareAtPrice = get(message, "properties.compare_at_price");
      break;
    }
    case "product added": {
      payload.$value = get(message, "properties.price");
      payload.AddedItemProductName = get(message, "properties.name");
      payload.AddedItemProductID = get(message, "properties.product_id");
      payload.AddedItemSKU = get(message, "properties.sku");
      payload.AddedItemImageURL = get(message, "properties.image_url");
      payload.AddedItemURL = get(message, "properties.url");
      payload.AddedItemPrice = get(message, "properties.price");
      payload.AddedItemQuantity = get(message, "properties.quantity");
      payload.AddedItemCategories = get(message, "properties.categories");
      payload.ItemNames = get(message, "properties.categories");
      payload.CheckoutURL = get(message, "properties.checkout_url");
      payload.Items = get(message, "properties.items");
      if (payload.Items) {
        itemsPayload(message, payload);
      }
      break;
    }
    case "checkout started": {
      payload.$event_id = get(message, "properties.order_id");
      payload.$value = get(message, "properties.value");
      payload.Categories = get(message, "properties.categories");
      payload.CheckoutURL = get(message, "properties.checkout_url");
      payload.ItemNames = get(message, "product_names");
      payload.Items = get(message, "properties.products");
      if (payload.Items) {
        itemsPayload(message, payload);
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
