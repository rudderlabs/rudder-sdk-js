const requiredEventParameters = {
  PromotionId: "promotion_id",
  PromotionName: "promotion_name",
  Search: "search_term",
  ProductId: "item_id",
  ProductName: "item_name",
};

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
  PaymentInfo: {
    mappings: {
      payment_method: "payment_type",
    },
  },
  ShippingInfo: {
    mappings: {
      shipping_method: "shipping_tier",
    },
  },
  Promotion: {
    mappings: {
      position: "location_id",
    },
  },
};

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
  },
  {
    src: ["product viewed"],
    dest: "view_item",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
  },
  {
    src: ["product added"],
    dest: "add_to_cart",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
  },
  {
    src: ["product removed"],
    dest: "remove_from_cart",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
  },
  {
    src: ["cart viewed"],
    dest: "view_cart",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
  },
  {
    src: ["checkout started"],
    dest: "begin_checkout",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
  },
  // To handle sending multiple payload for single event use approach as below
  {
    src: ["payment info entered"],
    dest: [
      {
        dest: "add_payment_info",
        hasItem: false,
        onlyIncludeParams: includeParams.PaymentInfo,
      },
      {
        dest: "add_shipping_info",
        hasItem: false,
        onlyIncludeParams: includeParams.ShippingInfo,
      },
    ],
    hasMultiplePayload: true,
  },
  {
    src: ["order completed"],
    dest: "purchase",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
  },
  {
    src: ["order refunded"],
    dest: "refund",
    hasItem: true,
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

const eventParametersConfigArray = [
  { src: "list_id", dest: "item_list_id", inItems: true },
  { src: "category", dest: "item_list_name", inItems: true },
  { src: "price", dest: "value" },
  { src: "currency", dest: "currency", inItems: true },
  { src: "coupon", dest: "coupon", inItems: true },
  { src: "affiliation", dest: "affiliation", inItems: true },
  { src: "shipping", dest: "shipping" },
  { src: "tax", dest: "tax" },
  { src: "total", dest: "value" },
];

const itemParametersConfigArray = [
  { src: "product_id", dest: "item_id" },
  { src: "order_id", dest: "item_id" },
  { src: "checkout_id", dest: "item_name" },
  { src: "name", dest: "item_name" },
  { src: "coupon", dest: "coupon" },
  { src: "category", dest: "item_category" },
  { src: "brand", dest: "item_brand" },
  { src: "variant", dest: "item_variant" },
  { src: "price", dest: "price" },
  { src: "quantity", dest: "quantity" },
  { src: "position", dest: "index" },
];

export {
  eventNamesConfigArray,
  eventParametersConfigArray,
  itemParametersConfigArray,
};
