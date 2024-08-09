const customParametersExclusion = [
  'item_id',
  'itemId',
  'product_id',
  'item_name',
  'itemName',
  'name',
  'coupon',
  'item_brand',
  'itemBrand',
  'brand',
  'item_variant',
  'itemVariant',
  'variant',
  'price',
  'quantity',
  'index',
  'position',
  'affiliation',
  'discount',
  'item_category',
  'itemCategory',
  'category',
  'item_category2',
  'item_category3',
  'item_category4',
  'item_category5',
  'item_list_id',
  'item_list_name',
  'location_id',
];

const itemsArrayParams = [
  { sourceKeys: ['product_id', 'itemId'], destKey: 'item_id' },
  { sourceKeys: ['name', 'itemName'], destKey: 'item_name' },
  { sourceKeys: 'coupon', destKey: 'coupon' },
  { sourceKeys: ['brand', 'itemBrand'], destKey: 'item_brand' },
  { sourceKeys: ['variant', 'itemVariant'], destKey: 'item_variant' },
  { sourceKeys: 'price', destKey: 'price', metadata: { type: 'toNumber' } },
  { sourceKeys: 'quantity', destKey: 'quantity', metadata: { type: 'toNumber' } },
  { sourceKeys: 'position', destKey: 'index', metadata: { type: 'toNumber' } },
  { sourceKeys: 'affiliation', destKey: 'affiliation' },
  { sourceKeys: 'discount', destKey: 'discount' },
  { sourceKeys: ['category', 'itemCategory'], destKey: 'item_category' },
  { sourceKeys: 'item_category2', destKey: 'item_category2' },
  { sourceKeys: 'item_category3', destKey: 'item_category3' },
  { sourceKeys: 'item_category4', destKey: 'item_category4' },
  { sourceKeys: 'item_category5', destKey: 'item_category5' },
  { sourceKeys: 'item_list_id', destKey: 'item_list_id' },
  { sourceKeys: 'item_list_name', destKey: 'item_list_name' },
  { sourceKeys: 'location_id', destKey: 'location_id' },
];

const eventParams = {
  method: { sourceKeys: 'properties.method', destKey: 'method' },
  product_cart_shared_method: { sourceKeys: 'properties.share_via', destKey: 'method' },
  currency: {
    sourceKeys: 'properties.currency',
    destKey: 'currency',
    metadata: { defaultValue: 'USD' },
  },
  value: {
    sourceKeys: ['properties.total', 'properties.value', 'properties.revenue', 'properties.price'],
    destKey: 'value',
    metadata: { type: 'toNumber' },
  },
  product_add_or_remove_value: {
    sourceKeys: [
      'properties.total',
      'properties.value',
      'properties.revenue',
      {
        operation: 'multiplication',
        args: [
          {
            sourceKeys: 'properties.price',
          },
          {
            sourceKeys: 'properties.quantity',
            defaultVal: 1,
          },
        ],
      },
    ],
    destKey: 'value',
    metadata: { type: 'toNumber' },
  },
  search: { sourceKeys: 'properties.query', destKey: 'search_term' },
  list_id: { sourceKeys: 'properties.list_id', destKey: 'item_list_id' },
  list_name: { sourceKeys: 'properties.category', destKey: 'item_list_name' },
  creative_name: {
    sourceKeys: ['properties.creative_name', 'properties.creative'],
    destKey: 'creative_name',
  },
  creative_slot: {
    sourceKeys: ['properties.creative_slot', 'properties.position'],
    destKey: 'creative_slot',
  },
  promotion_id: { sourceKeys: 'properties.promotion_id', destKey: 'promotion_id' },
  promotion_name: {
    sourceKeys: ['properties.promotion_name', 'properties.name'],
    destKey: 'promotion_name',
  },
  coupon: { sourceKeys: 'properties.coupon', destKey: 'coupon' },
  payment_method: { sourceKeys: 'properties.payment_method', destKey: 'payment_type' },
  shipping_method: { sourceKeys: 'properties.shipping_method', destKey: 'shipping_tier' },
  order_id: { sourceKeys: 'properties.order_id', destKey: 'transaction_id' },
  shipping: {
    sourceKeys: 'properties.shipping',
    destKey: 'shipping',
    metadata: { type: 'toNumber' },
  },
  tax: { sourceKeys: 'properties.tax', destKey: 'tax', metadata: { type: 'toNumber' } },
  content_type: { sourceKeys: 'properties.content_type', destKey: 'content_type' },
  item_id: {
    sourceKeys: ['properties.item_id', 'properties.product_id', 'properties.sku'],
    destKey: 'item_id',
  },
  cart_shared_item_id: {
    sourceKeys: ['properties.item_id', 'properties.cart_id'],
    destKey: 'item_id',
  },
  url: { sourceKeys: ['properties.url', 'context.page.url'], destKey: 'page_location' },
  referrer: {
    sourceKeys: ['properties.referrer', 'context.page.referrer'],
    destKey: 'page_referrer',
  },
  title: { sourceKeys: ['properties.title', 'context.page.title'], destKey: 'page_title' },
};

const eventsConfig = {
  LOGIN: {
    event: 'login',
    mapping: [eventParams.method],
  },
  SIGN_UP: {
    event: 'sign_up',
    mapping: [eventParams.method],
  },
  GENERATE_LEAD: {
    event: 'generate_lead',
    mapping: [eventParams.currency, { ...eventParams.value, required: true }],
  },
  PRODUCTS_SEARCHED: {
    event: 'search',
    mapping: [eventParams.search],
  },
  PRODUCT_SEARCHED: {
    event: 'search',
    mapping: [eventParams.search],
  },
  PRODUCT_LIST_VIEWED: {
    event: 'view_item_list',
    itemList: 'YES',
    mapping: [eventParams.list_id, eventParams.list_name],
  },
  PROMOTION_VIEWED: {
    event: 'view_promotion',
    itemList: 'YES',
    mapping: [
      eventParams.promotion_id,
      eventParams.creative_slot,
      eventParams.creative_name,
      eventParams.promotion_name,
    ],
  },
  PROMOTION_CLICKED: {
    event: 'select_promotion',
    itemList: 'NO',
    mapping: [
      eventParams.promotion_id,
      eventParams.creative_slot,
      eventParams.creative_name,
      eventParams.promotion_name,
    ],
  },
  PRODUCT_CLICKED: {
    event: 'select_item',
    item: 'YES',
    mapping: [eventParams.list_id, eventParams.list_name],
  },
  PRODUCTS_CLICKED: {
    event: 'select_item',
    item: 'YES',
    mapping: [eventParams.list_id, eventParams.list_name],
  },
  PRODUCT_VIEWED: {
    event: 'view_item',
    item: 'YES',
    mapping: [eventParams.currency, { ...eventParams.value, required: true }],
  },
  PRODUCT_ADDED: {
    event: 'add_to_cart',
    itemList: 'NO',
    item: 'YES',
    mapping: [eventParams.currency, { ...eventParams.product_add_or_remove_value, required: true }],
  },
  PRODUCT_REMOVED: {
    event: 'remove_from_cart',
    itemList: 'NO',
    item: 'YES',
    mapping: [eventParams.currency, { ...eventParams.product_add_or_remove_value, required: true }],
  },
  CART_VIEWED: {
    event: 'view_cart',
    itemList: 'YES',
    mapping: [eventParams.currency, { ...eventParams.value, required: true }],
  },
  CHECKOUT_STARTED: {
    event: 'begin_checkout',
    itemList: 'YES',
    mapping: [eventParams.currency, eventParams.coupon, { ...eventParams.value, required: true }],
  },
  PAYMENT_INFO_ENTERED: {
    event: 'add_payment_info',
    itemList: 'YES',
    mapping: [
      eventParams.currency,
      eventParams.coupon,
      eventParams.payment_method,
      { ...eventParams.value, required: true },
    ],
  },
  CHECKOUT_STEP_COMPLETED: {
    event: 'add_shipping_info',
    itemList: 'YES',
    mapping: [
      eventParams.currency,
      eventParams.coupon,
      eventParams.shipping_method,
      { ...eventParams.value, required: true },
    ],
  },
  ORDER_COMPLETED: {
    event: 'purchase',
    itemList: 'YES',
    mapping: [
      eventParams.tax,
      eventParams.coupon,
      eventParams.shipping,
      eventParams.currency,
      { ...eventParams.value, required: true },
      { ...eventParams.order_id, required: true },
    ],
  },
  ORDER_REFUNDED: {
    event: 'refund',
    itemList: 'NO',
    mapping: [
      eventParams.tax,
      eventParams.coupon,
      eventParams.shipping,
      eventParams.currency,
      { ...eventParams.value, required: true },
      { ...eventParams.order_id, required: true },
    ],
  },
  PRODUCT_ADDED_TO_WISHLIST: {
    event: 'add_to_wishlist',
    itemList: 'NO',
    item: 'YES',
    mapping: [eventParams.currency, { ...eventParams.value, required: true }],
  },
  PRODUCT_SHARED: {
    event: 'share',
    mapping: [
      eventParams.item_id,
      eventParams.content_type,
      eventParams.product_cart_shared_method,
    ],
  },
  CART_SHARED: {
    event: 'share',
    mapping: [
      eventParams.content_type,
      eventParams.cart_shared_item_id,
      eventParams.product_cart_shared_method,
    ],
  },
  PAGE: {
    event: 'page_view',
    mapping: [eventParams.url, eventParams.title, eventParams.referrer],
  },
};

const rootLevelProductsSupportedEventsList = [
  eventsConfig.PRODUCT_CLICKED.event,
  eventsConfig.PRODUCT_VIEWED.event,
  eventsConfig.PRODUCT_ADDED.event,
  eventsConfig.PRODUCT_REMOVED.event,
  eventsConfig.PRODUCT_ADDED_TO_WISHLIST.event,
];

export {
  eventsConfig,
  itemsArrayParams,
  customParametersExclusion,
  rootLevelProductsSupportedEventsList,
};
