import { getDataFromSource } from '../../utils/utils';

const ITEMS_MAPPING = [
  { src: 'product_id', dest: 'id' },
  { src: 'sku', dest: 'sku' },
  { src: 'name', dest: 'name' },
  { src: 'price', dest: 'price' },
  { src: 'quantity', dest: 'quantity' },
  { src: 'image_url', dest: 'imageUrl' },
  { src: 'url', dest: 'url' },
];

function getMappingObject(properties, mappings) {
  let itemsObject = {};
  mappings.forEach(mapping => {
    itemsObject = {
      ...getDataFromSource(mapping.src, mapping.dest, properties),
      ...itemsObject,
    };
  });
  return itemsObject;
}

function formPurchaseEventPayload(message) {
  let purchaseEventPayload = {};
  const { products } = message.properties;
  purchaseEventPayload.id = message.properties.order_id || message.properties.checkout_id;
  purchaseEventPayload.total = message.properties.total;
  purchaseEventPayload.items = [];
  const lineItems = [];
  if (products) {
    products.forEach(p => {
      const product = getMappingObject(p, ITEMS_MAPPING);
      lineItems.push(product);
    });
  } else {
    // if product related info is on properties root
    let product = {};
    product.id = message.properties.product_id;
    product.sku = message.properties.sku;
    product.name = message.properties.name;
    product.price = message.properties.price;
    product.quantity = message.properties.quantity;
    product.imageUrl = message.properties.image_url;
    product.url = message.properties.url;
    lineItems.push(product);
  }
  purchaseEventPayload.items = lineItems;
  return purchaseEventPayload;
}

function existsInMapping(mappedEvents, event) {
  let mapped = false;
  mappedEvents.forEach(e => {
    if (e.eventName == event) mapped = true;
  });
  return mapped;
}

export { formPurchaseEventPayload, existsInMapping };
