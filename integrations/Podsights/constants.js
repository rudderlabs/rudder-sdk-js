const NAME = 'PODSIGHTS';
const CNameMapping = {
  [NAME]: NAME,
  Podsights: NAME,
  PodSights: NAME,
  'pod Sights': NAME,
  'Pod Sights': NAME,
  'pod sights': NAME,
  'POD SIGHTS': NAME,
  'Pod sights': NAME,
};

// default mapping for the events
const standardEventsListMapping = [
  { to: 'lead', from: 'Signed Up' },
  { to: 'product', from: 'Product Viewed' },
  { to: 'addtocart', from: 'Product Added' },
  { to: 'checkout', from: 'Checkout Started' },
  { to: 'purchase', from: 'Order Completed' },
];

const LEAD_EVENT = [
  {
    destKey: 'value',
    sourceKeys: 'value',
  },
  {
    destKey: 'currency',
    sourceKeys: 'currency',
  },
  {
    destKey: 'type',
    sourceKeys: 'type',
  },
  {
    destKey: 'category',
    sourceKeys: 'category',
  },
];

const PRODUCT_EVENT = [
  {
    destKey: 'value',
    sourceKeys: 'value',
  },
  {
    destKey: 'currency',
    sourceKeys: 'currency',
  },
  {
    destKey: 'product_id',
    sourceKeys: 'productId',
  },
  {
    destKey: 'product_name',
    sourceKeys: 'productName',
  },
  {
    destKey: 'product_type',
    sourceKeys: 'productType',
  },
  {
    destKey: 'product_vendor',
    sourceKeys: 'productVendor',
  },
];

const ADD_TO_CART_EVENT = [
  {
    destKey: 'value',
    sourceKeys: 'value',
  },
  {
    destKey: 'currency',
    sourceKeys: 'currency',
  },
  {
    destKey: 'product_id',
    sourceKeys: 'productId',
  },
  {
    destKey: 'product_name',
    sourceKeys: 'productName',
  },
  {
    destKey: 'product_type',
    sourceKeys: 'productType',
  },
  {
    destKey: 'product_vendor',
    sourceKeys: 'productVendor',
  },
  {
    destKey: 'quantity',
    sourceKeys: 'quantity',
  },
  {
    destKey: 'variant_id',
    sourceKeys: 'variantId',
  },
  {
    destKey: 'variant_name',
    sourceKeys: 'variantName',
  },
];

const CHECK_OUT_EVENT = [
  {
    destKey: 'value',
    sourceKeys: 'value',
  },
  {
    destKey: 'currency',
    sourceKeys: 'currency',
  },
  {
    destKey: 'discount_code',
    sourceKeys: 'discountCode',
  },
  {
    destKey: 'quantity',
    sourceKeys: 'quantity',
  },
  {
    destKey: 'line_items',
    sourceKeys: 'lineItems',
  },
];

const PURCHASE_EVENT = [
  {
    destKey: 'value',
    sourceKeys: 'value',
  },
  {
    destKey: 'currency',
    sourceKeys: 'currency',
  },
  {
    destKey: 'discount_code',
    sourceKeys: 'discountCode',
  },
  {
    destKey: 'line_items',
    sourceKeys: 'lineItems',
  },
  {
    destKey: 'order_id',
    sourceKeys: 'orderId',
  },
  {
    destKey: 'is_new_customer',
    sourceKeys: 'isNewCustomer',
  },
  {
    destKey: 'quantity',
    sourceKeys: 'quantity',
  },
];

const LINE_ITEMS_CONFIG = [
  {
    destKey: 'product_id',
    sourceKeys: 'productId',
  },
  {
    destKey: 'product_name',
    sourceKeys: 'productName',
  },
  {
    destKey: 'product_type',
    sourceKeys: 'productType',
  },
  {
    destKey: 'product_vendor',
    sourceKeys: 'productVendor',
  },
  {
    destKey: 'variant_id',
    sourceKeys: 'variantId',
  },
  {
    destKey: 'variant_name',
    sourceKeys: 'variantName',
  },
  {
    destKey: 'value',
    sourceKeys: 'value',
  },
  {
    destKey: 'quantity',
    sourceKeys: 'quantity',
  },
];

export {
  NAME,
  CNameMapping,
  standardEventsListMapping,
  LEAD_EVENT,
  PRODUCT_EVENT,
  ADD_TO_CART_EVENT,
  CHECK_OUT_EVENT,
  PURCHASE_EVENT,
  LINE_ITEMS_CONFIG,
};
