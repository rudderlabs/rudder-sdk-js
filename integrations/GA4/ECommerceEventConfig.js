const requiredEventParameters = {
  PromotionId: "promotion_id",
  PromotionName: "promotion_name",
  Search: "search_term",
  ProductId: "item_id",
  ProductName: "item_name",
};

// To Do : Future Scope :: We can remove this one and add everything in include list.
// This will also simplify our existing code and complex logics related to that
const includeParams = {
  CartShare: {
    defaults: {
      content_type: "Cart",
    },
    mappings: {
      share_via: "method",
      cart_id: "content_id",
    },
  },
  ProductShare: {
    defaults: {
      content_type: "Product",
    },
    mappings: {
      share_via: "method",
      product_id: "content_id",
    },
  },
  Search: {
    mappings: {
      query: "search_term",
    },
  },
  Promotion: {
    mappings: {
      position: "location_id",
    },
  },
};

const eventParametersConfigArray = {
  ListId: { src: "list_id", dest: "item_list_id", inItems: true },
  Category: { src: "category", dest: "item_list_name", inItems: true },
  Price: { src: "price", dest: "value" },
  Currency: { src: "currency", dest: "currency", inItems: true },
  Coupon: { src: "coupon", dest: "coupon", inItems: true },
  Affiliation: { src: "affiliation", dest: "affiliation", inItems: true },
  Shipping: { src: "shipping", dest: "shipping" },
  Tax: { src: "tax", dest: "tax" },
  Total: { src: "total", dest: "value" },
  CheckoutId: { src: "checkout_id", dest: "transaction_id" },
  ShippingMethod: { src: "shipping_method", dest: "shipping_tier" },
  PaymentMethod: { src: "payment_method", dest: "payment_type" },
};

const itemParametersConfigArray = [
  { src: "product_id", dest: "item_id" },
  { src: "order_id", dest: "item_id" },
  { src: "name", dest: "item_name" },
  { src: "coupon", dest: "coupon" },
  { src: "category", dest: "item_category" },
  { src: "brand", dest: "item_brand" },
  { src: "variant", dest: "item_variant" },
  { src: "price", dest: "price" },
  { src: "quantity", dest: "quantity" },
  { src: "position", dest: "index" },
];

const eventNamesConfigArray = [
  // Browsing Section
  {
    src: ["products searched", "product searched"],
    dest: "search",
    requiredParams: requiredEventParameters.Search,
    onlyIncludeParams: includeParams.Search,
  },
  {
    src: ["product list viewed"],
    dest: "view_item_list",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
    includeList: [
      eventParametersConfigArray.ListId,
      eventParametersConfigArray.Category,
    ],
  },

  // Promotion Section
  {
    src: ["promotion viewed"],
    dest: "view_promotion",
    onlyIncludeParams: includeParams.Promotion,
  },
  {
    src: ["promotion clicked"],
    dest: "select_promotion",
    onlyIncludeParams: includeParams.Promotion,
  },

  // Ordering Section
  {
    src: ["product clicked", "products clicked"],
    dest: "select_item",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
    includeList: [
      eventParametersConfigArray.ListId,
      eventParametersConfigArray.Category,
    ],
  },
  {
    src: ["product viewed"],
    dest: "view_item",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
    includeList: [
      eventParametersConfigArray.Currency,
      eventParametersConfigArray.Total,
    ],
  },
  {
    src: ["product added"],
    dest: "add_to_cart",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
    includeList: [
      eventParametersConfigArray.Currency,
      eventParametersConfigArray.Total,
    ],
  },
  {
    src: ["product removed"],
    dest: "remove_from_cart",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
    includeList: [
      eventParametersConfigArray.Currency,
      eventParametersConfigArray.Total,
    ],
  },
  {
    src: ["cart viewed"],
    dest: "view_cart",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
    includeList: [
      eventParametersConfigArray.Currency,
      eventParametersConfigArray.Total,
    ],
  },
  {
    src: ["checkout started"],
    dest: "begin_checkout",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
    includeList: [
      eventParametersConfigArray.Coupon,
      eventParametersConfigArray.Currency,
      eventParametersConfigArray.Total,
    ],
  },
  {
    src: ["payment info entered"],
    dest: "add_payment_info",
    hasItem: false,
    includeList: [eventParametersConfigArray.PaymentMethod],
  },
  {
    src: ["payment info entered"],
    dest: "add_shipping_info",
    hasItem: false,
    includeList: [eventParametersConfigArray.ShippingMethod],
  },
  {
    src: ["order completed"],
    dest: "purchase",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
    includeList: [
      eventParametersConfigArray.Affiliation,
      eventParametersConfigArray.Coupon,
      eventParametersConfigArray.Currency,
      eventParametersConfigArray.CheckoutId,
      eventParametersConfigArray.Shipping,
      eventParametersConfigArray.Tax,
      eventParametersConfigArray.Total,
    ],
  },
  {
    src: ["order refunded"],
    dest: "refund",
    hasItem: true,
    includeList: [
      eventParametersConfigArray.Affiliation,
      eventParametersConfigArray.Coupon,
      eventParametersConfigArray.Currency,
      eventParametersConfigArray.CheckoutId,
      eventParametersConfigArray.Shipping,
      eventParametersConfigArray.Tax,
      eventParametersConfigArray.Total,
    ],
  },

  /* Coupon Section
    No Coupon Events present in GA4
  /----------  */

  // Wishlist Section
  {
    src: ["product added to wishlist"],
    dest: "add_to_wishlist",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
    includeList: [
      eventParametersConfigArray.Currency,
      eventParametersConfigArray.Total,
    ],
  },
  //-------

  // Sharing Section
  {
    src: ["product shared"],
    dest: "share",
    hasItem: false,
    onlyIncludeParams: includeParams.ProductShare,
  },

  {
    src: ["cart shared"],
    dest: "share",
    hasItem: false,
    onlyIncludeParams: includeParams.CartShare,
  },
  //---------
];

export {
  eventNamesConfigArray,
  eventParametersConfigArray,
  itemParametersConfigArray,
};
