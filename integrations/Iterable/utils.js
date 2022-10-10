import { getDataFromSource } from "../../utils/utils";


const ITEMS_MAPPING = [
  { src: "product_id", dest: "id" },
  { src: "sku", dest: "sku" },
  { src: "name", dest: "name" },
  { src: "price", dest: "price" },
  { src: "quantity", dest: "quantity" },
  { src: "image_url", dest: "imageUrl" },
  { src: "url", dest: "url" }
]

function getMappingObject (properties, mappings) {
    let itemsObject = {};
    mappings.forEach((mapping) => {
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
    products.forEach((p) => {
        const product = getMappingObject(p, ITEMS_MAPPING);
        lineItems.push(product);
    });
    purchaseEventPayload.items = lineItems;
    return purchaseEventPayload;
}

export { formPurchaseEventPayload };