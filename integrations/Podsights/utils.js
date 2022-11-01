import { constructPayload } from "../../utils/utils";
import { removeUndefinedAndNullValues } from "../utils/commonUtils";
import { LINE_ITEMS_CONFIG } from "./constants";

const payloadBuilder = (properties, CONFIG_EVENT) => {
  const payload = constructPayload(properties, CONFIG_EVENT);
  // if line_items is present in message.properties
  if (payload.line_items) {
    return payload;
  }

  const lineItems = [];
  // mapping the line_items_payload from message.properties
  const lineItemsPayload = constructPayload(properties, LINE_ITEMS_CONFIG);
  // if products is an array of objects, then we'll build each line_items payload from products.
  const productList = properties?.products;
  if (productList && Array.isArray(productList)) {
    for (const product of productList) {
      const productDetails = constructPayload(product, LINE_ITEMS_CONFIG);
      lineItems.push({
        ...lineItemsPayload,
        ...removeUndefinedAndNullValues(productDetails),
      });
    }
  } else {
    lineItems.push(lineItemsPayload);
  }
  return { ...payload, line_items: lineItems };
};

const payloadBuilderInList = (properties, CONFIG_EVENT) => {
  const payloadList = [];
  const productList = properties?.products;
  let productPayload = constructPayload(properties, CONFIG_EVENT);
  if (productList && Array.isArray(productList)) {
    for (const product of productList) {
      const productDetails = constructPayload(product, CONFIG_EVENT);
      payloadList.push({
        ...productPayload,
        ...removeUndefinedAndNullValues(productDetails),
      });
    }
  } else {
    payloadList.push(productPayload);
  }
  return payloadList;
};

export { payloadBuilder, payloadBuilderInList };
