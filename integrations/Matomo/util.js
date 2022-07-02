import get from "get-value";
import each from "@ndhoule/each";
import logger from "../../utils/logUtil";

/** If any event name matches with the goals list provided by the dashboard
 * we will call the trackGoal with the id provided in the mapping.
 */
const goalIdMapping = (event, goalListTo) => {
  try {
    each((val, key) => {
      if (key === event.toLowerCase()) {
        // val is the goalId provided in the dashboard
        window._paq.push(["trackGoal", val]);
      }
    }, goalListTo);
  } catch (err) {
    logger.error("[Matomo] track failed with following error", err);
  }
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
      try {
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
      } catch (err) {
        logger.error("[Matomo] track failed with following error", err);
      }
    }
  }, standardTo);
};

/** Mapping Ecommerce Events
 */
const ecommerceEventsMapping = (event, message) => {
  try {
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
    switch (event) {
      case "SET_ECOMMERCE_VIEW":
        productSKU =
          get(message, "properties.sku") ||
          get(message, "properties.product_id");
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
          get(message, "properties.sku") ||
          get(message, "properties.product_id");
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
          get(message, "properties.sku") ||
          get(message, "properties.product_id");
        if (!productSKU) {
          logger.error("User parameter (sku or product_id) is required");
          break;
        }

        window._paq.push(["removeEcommerceItem", productSKU]);
        break;
      case "TRACK_ECOMMERCE_ORDER":
        orderId =
          get(message, "properties.sku") ||
          get(message, "properties.product_id");
        if (!orderId) {
          logger.error("User parameter (sku or product_id) is required");
          break;
        }

        grandTotal =
          get(message, "properties.total") ||
          get(message, "properties.revenue");
        if (!grandTotal) {
          logger.error("User parameter (total or revenue) is required");
          break;
        }

        subTotal = get(message, "properties.subTotal");
        tax = get(message, "properties.tax");
        shipping = get(message, "properties.shipping");
        discount = get(message, "properties.discount");

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
  } catch (err) {
    logger.error("[Matomo] track failed with following error", err);
  }
};

export { goalIdMapping, ecommerceEventsMapping, standardEventsMapping };
