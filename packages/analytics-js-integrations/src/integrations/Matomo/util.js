/* eslint-disable import/no-relative-packages */
import each from '@ndhoule/each';
import logger from '../../../../analytics-v1.1/src/utils/logUtil';
import { getHashFromArray } from '../../utils/commonUtils';
import { NAME } from './constants';

/** If any event name matches with the goals list provided by the dashboard
 * we will call the trackGoal with the id provided in the mapping.
 * @param  {} event
 * @param  {} goalListMap
 */
const goalIdMapping = (event, goalListMap, message) => {
  let revenue;
  revenue = message.properties?.revenue;
  each((val, key) => {
    if (key === event) {
      val.forEach(v => {
        if (revenue) window._paq.push(['trackGoal', v, revenue]);
        else window._paq.push(['trackGoal', v]);
      });
    }
  }, goalListMap);
};

/** Mapping Standard Events
 If any event name matches with the standard events list provided in the dashboard
 @param  {} event
 @param  {} standardEventsMap
 @param  {} message
 */
const standardEventsMapping = (event, standardEventsMap, message) => {
  each((val, key) => {
    if (key === event) {
      let url;
      let linkType;
      let keyword;
      let category;
      let resultsCount;
      let contentInteraction;
      let contentName;
      let contentPiece;
      let contentTarget;
      let domId;
      const { properties } = message;
      val.forEach(v => {
        switch (v) {
          case 'trackLink':
            if (properties) url = properties.url;
            if (!url) url = message.context ? message.context.page.url : undefined;

            if (properties) linkType = properties.linkType;
            if (linkType !== 'link' && linkType !== 'download') {
              logger.error("linkType can only be ('link' or 'download')");
              break;
            }
            window._paq.push(['trackLink', url, linkType]);
            break;

          case 'trackSiteSearch':
            if (properties) {
              category = properties.category;
              resultsCount = properties.resultsCount;
            }
            keyword = properties.keyword || properties.search || message.context?.page?.search;

            window._paq.push(['trackSiteSearch', keyword, category, resultsCount]);
            break;

          case 'ping':
            window._paq.push(['ping']);
            break;

          case 'trackContentImpressionsWithinNode':
            if (properties) domId = properties.domId || properties.dom_id;
            window._paq.push(['trackContentImpressionsWithinNode', document.getElementById(domId)]);
            break;

          case 'trackContentInteractionNode':
            if (properties) {
              domId = properties.domId || properties.dom_id;
              contentInteraction = properties.contentInteraction;
            }
            window._paq.push([
              'trackContentInteractionNode',
              document.getElementById(domId),
              contentInteraction,
            ]);
            break;

          case 'trackContentImpression':
            if (properties) {
              contentName = properties.contentName;
              contentPiece = properties.contentPiece;
              contentTarget = properties.contentTarget;
            }
            window._paq.push(['trackContentImpression', contentName, contentPiece, contentTarget]);
            break;

          case 'trackContentInteraction':
            if (properties) {
              contentInteraction = properties.contentInteraction;
              contentName = properties.contentName;
              contentPiece = properties.contentPiece;
              contentTarget = properties.contentTarget;
            }
            window._paq.push([
              'trackContentInteraction',
              contentInteraction,
              contentName,
              contentPiece,
              contentTarget,
            ]);
            break;

          default:
            break;
        }
      });
    }
  }, standardEventsMap);
};

/** Mapping Ecommerce Events
 * @param  {} event
 * @param  {} message
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
  let products; // used for TRACK_ECOMMERCE_ORDER event

  const { properties } = message;
  if (properties) {
    products = properties.products;
  }

  switch (event) {
    case 'SET_ECOMMERCE_VIEW':
      if (properties) {
        productSKU = properties.sku || properties.product_id;
        productName = properties.name;
        categoryName = properties.category;
        price = properties.price;
      }
      if (!productSKU) {
        logger.error('User parameter (sku or product_id) is required');
        break;
      }

      if (!productName) {
        logger.error('User parameter name is required');
        break;
      }

      if (!categoryName) {
        logger.error('User parameter category is required');
        break;
      }

      if (!price) {
        logger.error('User parameter price is required');
        break;
      }
      window._paq.push(['setEcommerceView', productSKU, productName, categoryName, price]);
      window._paq.push(['trackPageView']);
      break;

    case 'ADD_ECOMMERCE_ITEM':
      if (properties) {
        productSKU = properties.sku || properties.product_id;
        productName = properties.name;
        categoryName = properties.category;
        price = properties.price;
        quantity = properties.quantity;
      }
      if (!productSKU) {
        logger.error('User parameter (sku or product_id) is required');
        break;
      }

      window._paq.push([
        'addEcommerceItem',
        productSKU,
        productName,
        categoryName,
        price,
        quantity,
      ]);
      break;

    case 'REMOVE_ECOMMERCE_ITEM':
      if (properties) {
        productSKU = properties.sku || properties.product_id;
      }
      if (!productSKU) {
        logger.error('User parameter (sku or product_id) is required');
        break;
      }
      window._paq.push(['removeEcommerceItem', productSKU]);
      break;

    case 'TRACK_ECOMMERCE_ORDER':
      if (properties) {
        orderId = properties.order_id || properties.orderId;
        grandTotal = properties.total || properties.revenue;
        subTotal = properties.subTotal;
        tax = properties.tax;
        shipping = properties.shipping;
        discount = properties.discount;
      }
      if (!orderId) {
        logger.error('User parameter order_id is required');
        break;
      }

      /** grandTotal is a mandatory field
       * If grandTotal is not found inside the properties, we are calculating it manually
       */
      if (!grandTotal) {
        if (products && Array.isArray(products) && products.length > 0) {
          grandTotal = 0;
          // iterating through the products array and calculating grandTotal
          for (let product = 0; product < products.length; product++) {
            if (product.price && product.quantity) {
              if (typeof price === 'string') price = parseFloat(price);
              if (typeof quantity === 'string') quantity = parseFloat(quantity);
              grandTotal += product.price * product.quantity;
            }
          }
        }

        /** subTotal is not a listed property in "Order Completed" event
         * if user doesn't provide this property, then we are calculating it from grandTotal
         * ref: https://matomo.org/faq/reports/analyse-ecommerce-reporting-to-improve-your-sales/#conversions-overview
         */
        if (!subTotal) {
          subTotal = grandTotal;
        }

        // ref: https://matomo.org/faq/reports/analyse-ecommerce-reporting-to-improve-your-sales/#conversions-overview
        if (shipping) {
          if (typeof shipping === 'string') shipping = parseFloat(shipping);
          grandTotal += shipping;
        }
        if (tax) {
          if (typeof tax === 'string') tax = parseFloat(tax);
          grandTotal += tax;
        }
      }

      if (!grandTotal) {
        logger.error('User parameter (total or revenue) is required');
        break;
      }

      window._paq.push([
        'trackEcommerceOrder',
        orderId,
        grandTotal,
        subTotal,
        tax,
        shipping,
        discount,
      ]);
      break;

    case 'CLEAR_ECOMMERCE_CART':
      window._paq.push(['clearEcommerceCart']);
      break;

    case 'TRACK_ECOMMERCE_CART_UPDATE':
      if (properties) grandTotal = properties.total || properties.revenue;
      window._paq.push(['trackEcommerceCartUpdate', grandTotal]);
      break;

    default:
      // Generic track Event
      if (properties) {
        category = properties.category;
        action = properties.action;
        value = properties.value;
      }
      if (!category) {
        logger.error('User parameter category is required');
        break;
      }
      if (!action) {
        logger.error('User parameter action is required');
        break;
      }

      name = message.event;
      window._paq.push(['trackEvent', category, action, name, value]);
      break;
  }
};

/**
 * Checks for custom dimensions in the payload
 * If present, we make setCustomDimension() function call
 * @param  {} message
 */
const checkCustomDimensions = message => {
  const { integrations } = message;
  if (integrations) {
    const customDimension = integrations[NAME]?.customDimension;
    if (customDimension) {
      const customDimensionsMap = getHashFromArray(
        customDimension,
        'dimensionId',
        'dimensionValue',
      );
      each((val, key) => {
        window._paq.push(['setCustomDimension', key, val]);
      }, customDimensionsMap);
    }
  }
};

export { goalIdMapping, ecommerceEventsMapping, standardEventsMapping, checkCustomDimensions };
