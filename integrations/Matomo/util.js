import get from "get-value";
import each from "@ndhoule/each";
import logger from "../../utils/logUtil";
import { getHashFromArray } from "../utils/commonUtils";

/** If any event name matches with the goals list provided by the dashboard
 * we will call the trackGoal with the id provided in the mapping.
 */
const goalIdMapping = (event, goalListTo) => {
  each((val, key) => {
    if (key === event.toLowerCase()) {
      // val is the goalId provided in the dashboard
      window._paq.push(["trackGoal", val]);
    }
  }, goalListTo);
};

/** Mapping Standard Events 
 If any event name matches with the standard events list provided in the dashboard
 */
const standardEventsMapping = (event, standardTo, properties) => {
  each((val, key) => {
    if (key === event.toLowerCase()) {
      let url;
      let linkType;
      let keyword;
      let category;
      let resultsCount;
      let contentInteraction;
      let contentName;
      let contentPiece;
      let contentTarget;

      switch (val) {
        case "trackLink":
          url = get(properties, "url");
          linkType = get(properties, "linkType");
          window._paq.push(["trackLink", url, linkType]);
          break;

        case "trackSiteSearch":
          keyword = get(properties, "keyword");
          category = get(properties, "category");
          resultsCount = get(properties, "resultsCount");
          window._paq.push([
            "trackSiteSearch",
            keyword,
            category,
            resultsCount,
          ]);
          break;

        case "ping":
          window._paq.push(["ping"]);
          break;

        case "trackContentImpressionsWithinNode":
          window._paq.push(["trackContentImpressionsWithinNode", document]);
          break;

        case "trackContentInteractionNode":
          contentInteraction = get(properties, "contentInteraction");
          window._paq.push([
            "trackContentInteractionNode",
            document,
            contentInteraction,
          ]);
          break;

        case "trackContentImpression":
          contentName = get(properties, "contentName");
          contentPiece = get(properties, "contentPiece");
          contentTarget = get(properties, "contentTarget");
          window._paq.push([
            "trackContentImpression",
            contentName,
            contentPiece,
            contentTarget,
          ]);
          break;

        case "trackContentInteraction":
          contentInteraction = get(properties, "contentInteraction");
          contentName = get(properties, "contentName");
          contentPiece = get(properties, "contentPiece");
          contentTarget = get(properties, "contentTarget");
          window._paq.push([
            "trackContentInteraction",
            contentInteraction,
            contentName,
            contentPiece,
            contentTarget,
          ]);
          break;

        default:
          break;
      }
    }
  }, standardTo);
};

/** Mapping Ecommerce Events
 */
const ecommerceEventsMapping = (event, message) => {
  let productSKU;
  let productName;
  let categoryName;
  let price;
  let quantity;
  let orderId;
  let grandTotal;
  let subTotal;
  let tax;
  let shipping;
  let discount;
  let category;
  let action;
  let name;
  let value;
  const products = get(message, "properties.products"); // used for TRACK_ECOMMERCE_ORDER event

  switch (event) {
    case "SET_ECOMMERCE_VIEW":
      productSKU =
        get(message, "properties.sku") || get(message, "properties.product_id");
      if (!productSKU) {
        logger.error("User parameter (sku or product_id) is required");
        break;
      }

      productName = get(message, "properties.name");
      if (!productName) {
        logger.error("User parameter name is required");
        break;
      }

      categoryName = get(message, "properties.category");
      if (!categoryName) {
        logger.error("User parameter category is required");
        break;
      }

      price = get(message, "properties.price");
      if (!price) {
        logger.error("User parameter (sku or product_id) is required");
        break;
      }
      window._paq.push([
        "setEcommerceView",
        productSKU,
        productName,
        categoryName,
        price,
      ]);
      window._paq.push(["trackPageView"]);
      break;

    case "ADD_ECOMMERCE_ITEM":
      productSKU =
        get(message, "properties.sku") || get(message, "properties.product_id");
      if (!productSKU) {
        logger.error("User parameter (sku or product_id) is required");
        break;
      }

      productName = get(message, "properties.name");
      categoryName = get(message, "properties.category");
      price = get(message, "properties.price");
      quantity = get(message, "properties.quantity");
      window._paq.push([
        "addEcommerceItem",
        productSKU,
        productName,
        categoryName,
        price,
        quantity,
      ]);
      break;

    case "REMOVE_ECOMMERCE_ITEM":
      productSKU =
        get(message, "properties.sku") || get(message, "properties.product_id");
      if (!productSKU) {
        logger.error("User parameter (sku or product_id) is required");
        break;
      }
      window._paq.push(["removeEcommerceItem", productSKU]);
      break;

    case "TRACK_ECOMMERCE_ORDER":
      orderId = get(message, "properties.order_id");
      if (!orderId) {
        logger.error("User parameter order_id is required");
        break;
      }

      grandTotal =
        get(message, "properties.total") || get(message, "properties.revenue");
      /** grandTotal is a mandatory field
       * If grandTotal is not found inside the properties, we are calculating it manually
       */
      if (!grandTotal) {
        if (products && products.length > 0) {
          grandTotal = 0;
          // iterating through the products array and calculating grandTotal
          for (let product = 0; product < products.length; product++) {
            if (product.price && product.quantity) {
              grandTotal += product.price * product.quantity;
            }
          }
        }
      }

      /** subTotal is not a listed property in "Order Completed" event
       * if user doesn't provide this property, then we are calculating it from grandTotal
       * ref: https://matomo.org/faq/reports/analyse-ecommerce-reporting-to-improve-your-sales/#conversions-overview
       */
      subTotal = get(message, "properties.subTotal");
      if (!subTotal) {
        subTotal = grandTotal;
      }
      tax = get(message, "properties.tax");
      shipping = get(message, "properties.shipping");
      discount = get(message, "properties.discount");

      // ref: https://matomo.org/faq/reports/analyse-ecommerce-reporting-to-improve-your-sales/#conversions-overview
      grandTotal += shipping + tax;

      window._paq.push([
        "trackEcommerceOrder",
        orderId,
        grandTotal,
        subTotal,
        tax,
        shipping,
        discount,
      ]);
      window._paq.push(["clearEcommerceCart"]);

      break;

    default:
      // Generic track Event
      category = get(message, "properties.category");
      if (!category) {
        logger.error("User parameter category is required");
        break;
      }

      action = get(message, "properties.action");
      if (!action) {
        logger.error("User parameter action is required");
        break;
      }

      name = get(message, "event");
      value = get(message, "properties.value");
      window._paq.push(["trackEvent", category, action, name, value]);
      break;
  }
};

/**
 * Checks for custom dimensions in the payload
 * If present, we make setCustomDimension() function call
 */
const checkCustomDimensions = (message) => {
  if (
    message.integrations &&
    message.integrations.MATOMO &&
    message.integrations.MATOMO.customDimension
  ) {
    const customDimensions = message.integrations.MATOMO.customDimension;
    const customDimensionsTo = getHashFromArray(
      customDimensions,
      "dimensionId",
      "dimensionValue"
    );
    each((val, key) => {
      window._paq.push(["setCustomDimension", key, val]);
    }, customDimensionsTo);
  }
};

export {
  goalIdMapping,
  ecommerceEventsMapping,
  standardEventsMapping,
  checkCustomDimensions,
};
