/* eslint-disable no-underscore-dangle */
import each from '@ndhoule/each';
import logger from '../../utils/logUtil';
import { getHashFromArray } from '../../utils/commonUtils';
import { NAME } from './constants';

const userParameterRequiredErrorMessage = 'User parameter (sku or product_id) is required';

/** If any event name matches with the goals list provided by the dashboard
 * we will call the trackGoal with the id provided in the mapping.
 * @param  {} event
 * @param  {} goalListMap
 */
const goalIdMapping = (event, goalListMap, message) => {
  const revenue = message.properties?.revenue;
  each((val, key) => {
    if (key === event) {
      val.forEach((v) => {
        if (revenue) window._paq.push(['trackGoal', v, revenue]);
        else window._paq.push(['trackGoal', v]);
      });
    }
  }, goalListMap);
};

/**
 * Matomo trackLink call
 * @param {*} properties
 * @param {*} context
 * @returns
 */
const trackLink = (properties, context) => {
  const { url: linkUrl, linkType } = properties;
  const url = linkUrl || context?.page?.url || undefined;

  if (!url) {
    logger.error('URL is missing');
    return;
  }

  if (linkType !== 'link' && linkType !== 'download') {
    logger.error("linkType can only be ('link' or 'download')");
    return;
  }

  window._paq.push(['trackLink', url, linkType]);
};

/**
 * Matomo trackSiteSearch call
 * @param {*} properties
 * @param {*} context
 */
const trackSiteSearch = (properties, context) => {
  let { keyword } = properties;
  const { category, resultsCount, search } = properties;
  keyword = keyword || search || context?.page?.search;
  window._paq.push(['trackSiteSearch', keyword, category, resultsCount]);
};

/**
 * Matomo trackContentImpressionsWithinNode call
 * @param {*} properties
 * @returns
 */
const trackContentImpressionsWithinNode = (properties) => {
  const domId = properties.domId || properties.dom_id;

  if (!domId) {
    logger.error('domId is missing');
    return;
  }

  window._paq.push(['trackContentImpressionsWithinNode', document.getElementById(domId)]);
};

/**
 * Matomo trackContentInteractionNode call
 * @param {*} properties
 */
const trackContentInteractionNode = (properties) => {
  const { contentInteraction, dom_id: dId } = properties;
  const domId = properties.domId || dId;
  window._paq.push([
    'trackContentInteractionNode',
    document.getElementById(domId),
    contentInteraction,
  ]);
};

/**
 * Matomo trackContentImpression call
 * @param {*} properties
 */
const trackContentImpression = (properties) => {
  const { contentName, contentPiece, contentTarget } = properties;
  window._paq.push(['trackContentImpression', contentName, contentPiece, contentTarget]);
};

/**
 * Matomo trackContentInteraction call
 * @param {*} properties
 */
const trackContentInteraction = (properties) => {
  const { contentInteraction, contentName, contentPiece, contentTarget } = properties;
  window._paq.push([
    'trackContentInteraction',
    contentInteraction,
    contentName,
    contentPiece,
    contentTarget,
  ]);
};

/**
 * Making a call for each standard events
 * @param {*} value
 * @param {*} message
 */
const makeACall = (value, message) => {
  const { context } = message;
  const properties = message?.properties || {};

  value.forEach((v) => {
    switch (v) {
      case 'trackLink':
        trackLink(properties, context);
        break;

      case 'trackSiteSearch':
        trackSiteSearch(properties, context);
        break;

      case 'ping':
        window._paq.push(['ping']);
        break;

      case 'trackContentImpressionsWithinNode':
        trackContentImpressionsWithinNode(properties);
        break;

      case 'trackContentInteractionNode':
        trackContentInteractionNode(properties);
        break;

      case 'trackContentImpression':
        trackContentImpression(properties);
        break;

      case 'trackContentInteraction':
        trackContentInteraction(properties);
        break;

      default:
        break;
    }
  });
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
      makeACall(val, message);
    }
  }, standardEventsMap);
};

/**
 * setEcommerceView matomo event
 * @param {*} properties
 * @returns
 */
const handleSetEcommerceView = (properties) => {
  const {
    sku,
    product_id: productId,
    name: productName,
    category: categoryName,
    price,
  } = properties;
  const productSKU = sku || productId;

  if (!productSKU) {
    logger.error(userParameterRequiredErrorMessage);
    return;
  }

  if (!productName) {
    logger.error('User parameter name is required');
    return;
  }

  if (!categoryName) {
    logger.error('User parameter category is required');
    return;
  }

  if (!price) {
    logger.error('User parameter price is required');
    return;
  }

  window._paq.push(['setEcommerceView', productSKU, productName, categoryName, price]);
  window._paq.push(['trackPageView']);
};

/**
 * addEcommerceItem matomo event
 * @param {*} properties
 * @returns
 */
const handleAddEcommerceItem = (properties) => {
  const { sku, product_id: productId, name, category, price, quantity } = properties;
  if (!sku && !productId) {
    logger.error(userParameterRequiredErrorMessage);
    return;
  }

  window._paq.push(['addEcommerceItem', sku || productId, name, category, price, quantity]);
};

/**
 * removeEcommerceItem matomo event
 * @param {*} properties
 * @returns
 */
const handleRemoveEcommerceItem = (properties) => {
  const { sku, product_id: productId } = properties;
  const productSKU = sku || productId;
  if (!productSKU) {
    logger.error(userParameterRequiredErrorMessage);
    return;
  }

  window._paq.push(['removeEcommerceItem', productSKU]);
};

/**
 * Returns grand and sub total values
 * @param {*} total
 * @param {*} products
 * @param {*} shipping
 * @param {*} tax
 * @param {*} subT
 * @returns
 */
const calculateGrandAndSubTotal = (total, products, shipping, tax, subT) => {
  if (total) {
    return { grandTotal: parseFloat(total), subT };
  }

  /** grandTotal is a mandatory field
   * If grandTotal is not found inside the properties, we are calculating it manually
   */
  let grandTotal = 0;
  let subTotal = subT;

  if (Array.isArray(products) && products.length > 0) {
    products.forEach((product) => {
      if (product.price && product.quantity) {
        grandTotal += parseFloat(product.price) * parseFloat(product.quantity);
      }
    });
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
    grandTotal += parseFloat(shipping);
  }
  if (tax) {
    grandTotal += parseFloat(tax);
  }

  return { grandTotal, subTotal };
};

/**
 * trackEcommerceOrder matomo event
 * @param {*} properties
 * @param {*} products
 * @returns
 */
const handleTrackEcommerceOrder = (properties, products) => {
  const { order_id: oId, total, revenue, tax, shipping, discount, subTotal: subT } = properties;
  let { orderId } = properties;
  orderId = orderId || oId;
  const { grandTotal, subTotal } = calculateGrandAndSubTotal(
    total || revenue,
    products,
    shipping,
    tax,
    subT,
  );

  if (!oId && !orderId) {
    logger.error('User parameter order_id is required');
    return;
  }

  if (!grandTotal) {
    logger.error('User parameter (total or revenue) is required');
    return;
  }

  window._paq.push(['trackEcommerceOrder', orderId, grandTotal, subTotal, tax, shipping, discount]);
};

/**
 * trackEcommerceCartUpdate matomo event
 * @param {*} properties
 */
const handleTrackEcommerceCartUpdate = (properties) => {
  const grandTotal = properties.total || properties.revenue;
  window._paq.push(['trackEcommerceCartUpdate', grandTotal]);
};

/**
 * trackEvent matomo event
 * @param {*} event
 * @param {*} properties
 * @returns
 */
const handleGenericTrackEvent = (event, properties) => {
  const { category, action, value } = properties;
  if (!category) {
    logger.error('User parameter category is required');
    return;
  }
  if (!action) {
    logger.error('User parameter action is required');
    return;
  }

  window._paq.push(['trackEvent', category, action, event, value]);
};

/** Mapping Ecommerce Events
 * @param  {} event
 * @param  {} message
 */
const ecommerceEventsMapping = (event, message) => {
  let products;

  const properties = message?.properties || {};
  if (properties) {
    products = properties.products;
  }

  switch (event) {
    case 'SET_ECOMMERCE_VIEW':
      handleSetEcommerceView(properties);
      break;

    case 'ADD_ECOMMERCE_ITEM':
      handleAddEcommerceItem(properties);
      break;

    case 'REMOVE_ECOMMERCE_ITEM':
      handleRemoveEcommerceItem(properties);
      break;

    case 'TRACK_ECOMMERCE_ORDER':
      handleTrackEcommerceOrder(properties, products);
      break;

    case 'CLEAR_ECOMMERCE_CART':
      window._paq.push(['clearEcommerceCart']);
      break;

    case 'TRACK_ECOMMERCE_CART_UPDATE':
      handleTrackEcommerceCartUpdate(properties);
      break;

    default:
      // Generic track Event
      handleGenericTrackEvent(message.event, properties);
      break;
  }
};

/**
 * Checks for custom dimensions in the payload
 * If present, we make setCustomDimension() function call
 * @param  {} message
 */
const checkCustomDimensions = (message) => {
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
