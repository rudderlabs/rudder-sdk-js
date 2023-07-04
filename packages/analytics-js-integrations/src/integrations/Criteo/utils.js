import md5 from 'md5';
import { getHashFromArray, isDefinedAndNotNull } from '../../utils/commonUtils';
import logger from '@rudderstack/common/v1.1/utils/logUtil';

const handleCommonFields = (rudderElement, hashMethod) => {
  const { message } = rudderElement;
  const { properties } = message;

  const setEmail = {};
  const setZipcode = {};

  const finalRequest = [
    { event: 'setCustomerId', id: md5(message.userId) },
    { event: 'setRetailerVisitorId', id: md5(message.anonymousId) },
  ];

  if (properties && properties.email) {
    const email = properties.email.trim().toLowerCase();
    setEmail.event = 'setEmail';
    setEmail.hash_method = hashMethod;
    setEmail.email = hashMethod === 'md5' ? md5(email) : email;
    finalRequest.push(setEmail);
  }

  if (properties && properties.zipCode) {
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

  Object.keys(fieldMapHashmap).forEach(field => {
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

const handlingEventDuo = (message, finalPayload) => {
  const { event, properties } = message;
  const eventType = event.toLowerCase().trim();
  const productInfo = [];
  let elementaryProduct;
  if (properties && properties.products && properties.products.length > 0) {
    properties.products.forEach((product, index) => {
      if (product.product_id && product.price && product.quantity) {
        elementaryProduct = {
          id: String(product.product_id),
          price: parseFloat(product.price),
          quantity: parseInt(product.quantity, 10),
        };
        if (
          !Number.isNaN(parseFloat(elementaryProduct.price)) &&
          !Number.isNaN(parseInt(elementaryProduct.quantity, 10))
        ) {
          // all the above fields are mandatory
          productInfo.push(elementaryProduct);
        }
      } else {
        logger.debug(`[Criteo] product at index ${index} is skipped for insufficient information`);
      }
    });
    if (productInfo.length === 0) {
      logger.debug(
        '[Criteo] None of the products had sufficient information or information is wrongly formatted',
      );
      return;
    }
  } else {
    logger.debug('[Criteo] Payload should consist of at least one product information');
    return;
  }
  if (eventType === 'cart viewed') {
    const viewBasketObject = {
      event: 'viewBasket',
      item: productInfo,
    };
    finalPayload.push(viewBasketObject);
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

const handleListView = (message, finalPayload, OPERATOR_LIST) => {
  const { properties } = message;
  const productIdList = [];
  const filterArray = [];
  const viewListObj = {};
  const FILTER_FIELDS = ['name', 'value'];

  if (properties.products && properties.products.length > 0) {
    properties.products.forEach(product => {
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

  if (properties.filters) {
    properties.filters.forEach(filter => {
      const filterObject = {};
      Object.keys(filter).forEach(key => {
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
  if (filterArray.length > 0) {
    viewListObj.filters = filterArray;
  }
  finalPayload.push(viewListObj);
};

export {
  handleCommonFields,
  generateExtraData,
  handleProductView,
  handlingEventDuo,
  handleListView,
};
