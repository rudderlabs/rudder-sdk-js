import md5 from 'md5';
import sha256 from 'crypto-js/sha256';
import { getHashFromArray, isDefinedAndNotNull } from '../../utils/commonUtils';
import logger from '../../utils/logUtil';

const handleCommonFields = (rudderElement, hashMethod) => {
  const { message } = rudderElement;
  const { properties, userId, anonymousId } = message;

  const setEmail = {};
  const setZipcode = {};

  const finalRequest = [
    { event: 'setCustomerId', id: sha256(userId).toString() },
    { event: 'setRetailerVisitorId', id: sha256(anonymousId).toString() },
  ];

  if (properties?.email) {
    const email = properties.email.trim().toLowerCase();
    setEmail.event = 'setEmail';
    setEmail.hash_method = hashMethod;
    setEmail.email = hashMethod === 'md5' ? md5(email) : email;
    finalRequest.push(setEmail);
  }

  if (properties?.zipCode) {
    setZipcode.event = 'setZipcode';
    setZipcode.zipCode = properties.zipCode || properties.zip;
    finalRequest.push(setZipcode);
  }

  return finalRequest;
};
const generateExtraData = (rudderElement, fieldMapping) => {
  const { message } = rudderElement;
  const extraData = {};
  const fieldMapHashmap = getHashFromArray(fieldMapping, 'from', 'to', false);

  Object.keys(fieldMapHashmap).forEach((field) => {
    if (isDefinedAndNotNull(message.properties[field])) {
      extraData[fieldMapHashmap[field]] = message.properties[field];
    }
  });
  return extraData;
};

const handleProductView = (message, finalPayload) => {
  const { properties } = message;
  if (properties.product_id) {
    const viewItemObject = {
      event: 'viewItem',
      item: String(properties.product_id),
    };

    if (properties.price && !Number.isNaN(parseFloat(properties.price))) {
      viewItemObject.price = parseFloat(properties.price);
    }

    if (
      properties.availability &&
      (properties.availability === 1 || properties.availability === 0)
    ) {
      viewItemObject.availability = properties.availability;
    }
    finalPayload.push(viewItemObject);
  } else {
    logger.debug('[Criteo] product_id is a mandatory field to use Product Tag in criteo');
  }

  // Final example payload supported by destination
  // window.criteo_q.push(
  //   { event: "setAccount", account: YOUR_PARTNER_ID},
  //   {
  //     event: "setEmail",
  //     email: "##Email Address##",
  //     hash_method: "##Hash Method##",
  //   },
  //   { event: "setSiteType", type: deviceType},
  //   { event: "setCustomerId", id: "##Customer Id##" },
  //   { event: "setRetailerVisitorId", id: "##Visitor Id##"},
  //   { event: "setZipcode", zipcode: "##Zip Code##" },
  //   {
  //     event: "viewItem",
  //     item: "##Product ID##",
  //     price: "##price##",
  //     availability: "##Availability##",
  //   }
  // );
};

/**
 * Validates product properties
 * @param {*} product
 * @param {*} index
 * @returns
 */
const validateProduct = (product, index) => {
  if (product.product_id && product.price && product.quantity) {
    const elementaryProduct = {
      id: String(product.product_id),
      price: parseFloat(product.price),
      quantity: parseInt(product.quantity, 10),
    };
    return !Number.isNaN(elementaryProduct.price) && !Number.isNaN(elementaryProduct.quantity);
  }
  logger.debug(`[Criteo] product at index ${index} is skipped for insufficient information`);
  return false;
};

/**
 * Returns transformed products array
 * @param {*} properties
 * @returns
 */
const getProductInfo = (properties) => {
  const productInfo = [];

  if (properties?.products && properties.products.length > 0) {
    properties.products.forEach((product, index) => {
      if (validateProduct(product, index)) {
        productInfo.push({
          id: String(product.product_id),
          price: parseFloat(product.price),
          quantity: parseInt(product.quantity, 10),
        });
      }
    });
  } else {
    logger.debug('[Criteo] Payload should consist of at least one product information');
  }

  return productInfo;
};

/**
 * Adds order completed event to finalPayload
 * @param {*} properties
 * @param {*} finalPayload
 * @param {*} productInfo
 * @returns
 */
const processCompletedOrderEvent = (properties, finalPayload, productInfo) => {
  const trackTransactionObject = {
    event: 'trackTransaction',
    id: String(properties.order_id),
    item: productInfo,
  };

  if (!trackTransactionObject.id) {
    logger.debug('[Criteo] order_id (Transaction Id) is a mandatory field');
    return;
  }

  if (properties.new_customer === 1 || properties.new_customer === 0) {
    trackTransactionObject.new_customer = properties.new_customer;
  }

  if (properties.deduplication === 1 || properties.deduplication === 0) {
    trackTransactionObject.deduplication = properties.deduplication;
  }

  finalPayload.push(trackTransactionObject);
};

/**
 * Adds view cart event to finalPayload
 * @param {*} properties
 * @param {*} finalPayload
 * @param {*} productInfo
 */
const processViewedCartEvent = (finalPayload, productInfo) => {
  const viewBasketObject = {
    event: 'viewBasket',
    item: productInfo,
  };
  finalPayload.push(viewBasketObject);
};

/**
 * Handles events
 * @param {*} message
 * @param {*} finalPayload
 * @returns
 */
const handlingEventDuo = (message, finalPayload) => {
  const { event, properties } = message;
  const eventType = event.toLowerCase().trim();
  const productInfo = getProductInfo(properties);

  if (productInfo.length === 0) {
    logger.debug(
      '[Criteo] None of the products had sufficient information or information is wrongly formatted',
    );
    return;
  }

  if (eventType === 'cart viewed') {
    processViewedCartEvent(finalPayload, productInfo);
    // final example payload supported by the destination
    // window.criteo_q.push(
    //   { event: "setAccount", account: YOUR_PARTNER_ID},
    //   {
    //     event: "setEmail",
    //     email: "##Email Address##",
    //     hash_method: "##Hash Method##",
    //   },
    //   { event: "setSiteType", type: deviceType},
    //   { event: "setCustomerId", id: "##Customer Id##" },
    //   { event: "setRetailerVisitorId", id: "##Visitor Id##"},
    //   { event: "setZipcode", zipcode: "##Zip Code##" },
    //   {
    //     event: "viewBasket",
    //     item: [
    //       {
    //         id: "##Product Id##",
    //         price: "##Price##",
    //         quantity: "##Quantity##",
    //       },
    //       // add a line for each additional line in the basket
    //     ],
    //   }
    // );
  }

  if (eventType === 'order completed') {
    processCompletedOrderEvent(properties, finalPayload, productInfo);
    // final example payload supported by destination
    //   window.criteo_q.push(
    //     { event: "setAccount", account: YOUR_PARTNER_ID},
    //     { event: "setEmail", email: "##Email Address##", hash_method: "##Hash Method##" },
    //     { event: "setSiteType", type: deviceType},
    //     { event: "setCustomerId", id: "##Customer Id##" },
    //     { event: "setRetailerVisitorId", id: "##Visitor Id##"},
    //     { event: "setZipcode", zipcode: "##Zip Code##" },
    //     { event: "trackTransaction",
    //       id: "##Transaction ID##",
    //       new_customer: ##New Customer##,
    //       deduplication: ##Deduplication##,
    //       item: [
    //        {id: "##Product Id##", price: "##Price##", quantity: "##Quantity##" }
    //        //add a line for each additional line in the basket
    //      ]}
    //   );

    // }
  }
};

/**
 * Returns filterArray
 * @param {*} properties
 * @param {*} OPERATOR_LIST
 * @returns
 */
const getFilterArray = (properties, OPERATOR_LIST) => {
  const filterArray = [];
  const FILTER_FIELDS = ['name', 'value'];
  if (properties.filters) {
    properties.filters.forEach((filter) => {
      const filterObject = {};
      Object.keys(filter).forEach((key) => {
        if (
          FILTER_FIELDS.includes(key) ||
          (key === 'operator' && OPERATOR_LIST.includes(filter.operator))
        ) {
          filterObject[key] = filter[key];
        }
      });
      filterArray.push(filterObject);
    });
  }

  return filterArray;
};

const handleListView = (message, finalPayload, OPERATOR_LIST) => {
  const { properties } = message;
  const productIdList = [];
  const viewListObj = {};

  if (properties.products && properties.products.length > 0) {
    properties.products.forEach((product) => {
      if (product.product_id) {
        productIdList.push(String(product.product_id));
      }
    });
    if (productIdList.length === 0) {
      logger.debug('[Criteo] None of the product information had product_id');
      return;
    }
  } else {
    logger.debug('[Criteo] The payload should consist of atleast one product information');
    return;
  }

  viewListObj.event = 'viewList';
  viewListObj.item = productIdList;
  viewListObj.category = String(properties.category);
  viewListObj.keywords = String(properties.keywords);
  if (properties.page_number && !Number.isNaN(parseInt(properties.page_number, 10))) {
    viewListObj.page_number = parseInt(properties.page_number, 10);
  }

  const filterArray = getFilterArray(properties, OPERATOR_LIST);
  if (filterArray.length > 0) {
    viewListObj.filters = filterArray;
  }
  finalPayload.push(viewListObj);
};

/**
 * Returns device type
 * @param {*} userAgent
 * @returns
 */
const getDeviceType = (userAgent) => {
  let deviceType;

  if (/iPad/.test(userAgent)) {
    deviceType = 't';
  } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(navigator.userAgent)) {
    deviceType = 'm';
  } else {
    deviceType = 'd';
  }

  return deviceType;
};

export {
  getDeviceType,
  handleListView,
  handlingEventDuo,
  handleProductView,
  generateExtraData,
  handleCommonFields,
};
