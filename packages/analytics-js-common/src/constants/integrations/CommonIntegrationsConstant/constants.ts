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
      sourceKeys: 'price',
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
      sourceKeys: 'price',
    },
    {
      destKey: 'currency',
      sourceKeys: 'currency',
    },
    {
      destKey: 'product_id',
      sourceKeys: 'product_id',
    },
    {
      destKey: 'product_name',
      sourceKeys: 'name',
    },
    {
      destKey: 'product_type',
      sourceKeys: 'product_type',
    },
    {
      destKey: 'product_vendor',
      sourceKeys: 'brand',
    },
  ];
  
  const ADD_TO_CART_EVENT = [
    {
      destKey: 'value',
      sourceKeys: 'price',
    },
    {
      destKey: 'currency',
      sourceKeys: 'currency',
    },
    {
      destKey: 'product_id',
      sourceKeys: 'product_id',
    },
    {
      destKey: 'product_name',
      sourceKeys: 'name',
    },
    {
      destKey: 'product_type',
      sourceKeys: 'product_type',
    },
    {
      destKey: 'product_vendor',
      sourceKeys: 'brand',
    },
    {
      destKey: 'quantity',
      sourceKeys: 'quantity',
    },
    {
      destKey: 'variant_id',
      sourceKeys: 'variant_id',
    },
    {
      destKey: 'variant_name',
      sourceKeys: 'variant_name',
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
      sourceKeys: 'discount_code',
    },
    {
      destKey: 'quantity',
      sourceKeys: 'quantity',
    },
    {
      destKey: 'line_items',
      sourceKeys: 'line_items',
    },
  ];
  
  const PURCHASE_EVENT = [
    {
      destKey: 'value',
      sourceKeys: ['total', 'revenue'],
    },
    {
      destKey: 'currency',
      sourceKeys: 'currency',
    },
    {
      destKey: 'discount_code',
      sourceKeys: 'discount_code',
    },
    {
      destKey: 'line_items',
      sourceKeys: 'line_items',
    },
    {
      destKey: 'order_id',
      sourceKeys: 'order_id',
    },
    {
      destKey: 'is_new_customer',
      sourceKeys: 'is_new_customer',
    },
    {
      destKey: 'quantity',
      sourceKeys: 'quantity',
    },
  ];
  
  const LINE_ITEMS_CONFIG = [
    {
      destKey: 'product_id',
      sourceKeys: 'product_id',
    },
    {
      destKey: 'product_name',
      sourceKeys: 'name',
    },
    {
      destKey: 'product_type',
      sourceKeys: 'product_type',
    },
    {
      destKey: 'product_vendor',
      sourceKeys: 'brand',
    },
    {
      destKey: 'variant_id',
      sourceKeys: 'variant_id',
    },
    {
      destKey: 'variant_name',
      sourceKeys: 'variant_name',
    },
    {
      destKey: 'value',
      sourceKeys: 'price',
    },
    {
      destKey: 'quantity',
      sourceKeys: 'quantity',
    },
  ];
  
  export {
    standardEventsListMapping,
    LEAD_EVENT,
    PRODUCT_EVENT,
    ADD_TO_CART_EVENT,
    CHECK_OUT_EVENT,
    PURCHASE_EVENT,
    LINE_ITEMS_CONFIG,
  };
  
  