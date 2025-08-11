import { NAME, DISPLAY_NAME } from './constants';
import { getDataFromSource } from '../../utils/utils';
import { isDefinedAndNotNull } from '../../utils/commonUtils';

const ITEMS_MAPPING = [
  { src: 'product_id', dest: 'id' },
  { src: 'sku', dest: 'sku' },
  { src: 'name', dest: 'name' },
  { src: 'price', dest: 'price' },
  { src: 'quantity', dest: 'quantity' },
  { src: 'image_url', dest: 'imageUrl' },
  { src: 'url', dest: 'url' },
];

/**
 * Get destination specific options from integrations options
 * By default, it will return options for the destination using its display name
 * If display name is not present, it will return options for the destination using its name
 * The fallback is only for backward compatibility with SDK versions < v1.1
 * @param {object} integrationsOptions Integrations options object
 * @returns destination specific options
 */
const getDestinationOptions = integrationsOptions =>
  integrationsOptions && (integrationsOptions[DISPLAY_NAME] || integrationsOptions[NAME]);

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
  const purchaseEventPayload = {};
  const { products, order_id: orderId, checkout_id: checkoutId, total } = message.properties;
  purchaseEventPayload.id = orderId || checkoutId;
  purchaseEventPayload.total = total;
  purchaseEventPayload.items = [];
  const lineItems = [];
  if (products) {
    products.forEach(p => {
      const product = getMappingObject(p, ITEMS_MAPPING);
      lineItems.push(product);
    });
  } else {
    const {
      product_id: productId,
      sku,
      price,
      quantity,
      image_url: imageUrl,
      url,
      name,
    } = message.properties;
    // if product related info is on properties root
    const product = {
      url,
      sku,
      name,
      price,
      quantity,
      imageUrl,
      id: productId,
    };
    lineItems.push(product);
  }
  purchaseEventPayload.items = lineItems;
  return purchaseEventPayload;
}

function existsInMapping(mappedEvents, event) {
  let mapped = false;
  mappedEvents.forEach(e => {
    if (e.eventName.toLowerCase() === event.toLowerCase()) mapped = true;
  });
  return mapped;
}

/**
 * Returns jwt token
 * @param {*} integrations
 * @returns
 */
const extractJWT = integrations => {
  const iterableIntgConfig = getDestinationOptions(integrations);
  if (iterableIntgConfig) {
    const { jwt_token: jwtToken } = iterableIntgConfig;
    return isDefinedAndNotNull(jwtToken) ? jwtToken : undefined;
  }
  return undefined;
};

/**
 * Returns inappmessages payload
 * @param {*} config
 * @returns
 */
const prepareInAppMessagesPayload = config => ({
  count: 20,
  animationDuration: Number(config.animationDuration) || 400,
  displayInterval: Number(config.displayInterval) || 30000,
  onOpenScreenReaderMessage: config.onOpenScreenReaderMessage,
  onOpenNodeToTakeFocus: config.onOpenNodeToTakeFocus,
  packageName: config.packageName,
  rightOffset: config.rightOffset,
  topOffset: config.topOffset,
  bottomOffset: config.bottomOffset,
  handleLinks: config.handleLinks,
  closeButton: {
    color: config.closeButtonColor || 'red',
    size: config.closeButtonSize || '16px',
    topOffset: config.closeButtonColorTopOffset || '4%',
    sideOffset: config.closeButtonColorSideOffset || '4%',
    iconPath: config.iconPath,
    isRequiredToDismissMessage: config.isRequiredToDismissMessage,
    position: config.closeButtonPosition || 'top-right',
  },
});

export { formPurchaseEventPayload, existsInMapping, extractJWT, prepareInAppMessagesPayload };
