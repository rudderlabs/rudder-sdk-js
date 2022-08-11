/* eslint-disable camelcase */

import * as utils from './util';

const productViewHandle = (rudderElement, pageName) => {
  utils.clearWindowSKeys(utils.getDynamicKeys());
  utils.processEvent(rudderElement, 'prodView', pageName);
};

const productAddedHandle = (rudderElement, pageName) => {
  utils.clearWindowSKeys(utils.getDynamicKeys());
  utils.processEvent(rudderElement, 'scAdd', pageName);
};

const productRemovedHandle = (rudderElement, pageName) => {
  utils.clearWindowSKeys(utils.getDynamicKeys());
  utils.processEvent(rudderElement, 'scRemove', pageName);
};

const orderCompletedHandle = (rudderElement, pageName) => {
  utils.clearWindowSKeys(utils.getDynamicKeys());
  const { properties } = rudderElement.message;
  const { purchaseId, transactionId, order_id } = properties;
  utils.updateWindowSKeys(purchaseId || order_id, 'purchaseID');
  utils.updateWindowSKeys(transactionId || order_id, 'transactionID');

  utils.processEvent(rudderElement, 'purchase', pageName);
};

const checkoutStartedHandle = (rudderElement, pageName) => {
  utils.clearWindowSKeys(utils.getDynamicKeys());
  const { properties } = rudderElement.message;
  const { purchaseId, transactionId, order_id } = properties;
  utils.updateWindowSKeys(purchaseId || order_id, 'purchaseID');
  utils.updateWindowSKeys(transactionId || order_id, 'transactionID');

  utils.processEvent(rudderElement, 'scCheckout', pageName);
};

const cartViewedHandle = (rudderElement, pageName) => {
  utils.clearWindowSKeys(utils.getDynamicKeys());
  utils.processEvent(rudderElement, 'scView', pageName);
};

const cartOpenedHandle = (rudderElement, pageName) => {
  utils.clearWindowSKeys(utils.getDynamicKeys());
  utils.processEvent(rudderElement, 'scOpen', pageName);
};

export {
  productViewHandle,
  productAddedHandle,
  productRemovedHandle,
  orderCompletedHandle,
  checkoutStartedHandle,
  cartViewedHandle,
  cartOpenedHandle,
};
