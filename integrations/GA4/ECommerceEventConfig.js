const requiredEventParameters = {
  PromotionId: "promotion_id",
  PromotionName: "promotion_name",
  Search: "search_term",
  ProductId: "item_id",
  ProductName: "item_name",
};

const includeParams = {
  Share: {
    share_via: "method",
    share_message: "content_type",
    product_id: "content_id",
  },
  Search: {
    query: "search_term",
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

  // Promotion Section :: Discuss
  {
    src: ["promotion viewed"],
    dest: "view_promotion",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
      requiredEventParameters.PromotionId,
      requiredEventParameters.PromotionName,
    ],
    hasItem: true,
  },
  {
    src: ["promotion clicked"],
    dest: "select_promotion",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
      requiredEventParameters.PromotionId,
      requiredEventParameters.PromotionName,
    ],
    hasItem: true,
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
  {
    src: ["payment info entered"], // adding item_name as checkout_id. I know its not feasible but what is correct value to send.
    dest: "add_payment_info",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
    hasItem: true,
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
  // Check how to do
  {
    src: ["order refunded"],
    dest: "refund",
    hasItem: true,
  }, // GA4 refund is different it supports two refund, partial and full refund  // order_id

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

  // Sharing Section :: What will be content id ask
  {
    src: ["product shared", "cart shared"],
    dest: "share",
    hasItem: false,
    onlyIncludeParams: includeParams.Share,
  },
  //---------
];

const eventParametersConfigArray = [
  { src: "list_id", dest: "item_list_id", inItems: true },
  { src: "category", dest: "item_list_name", inItems: true },
  { src: "promotion_id", dest: "items.promotion_id", required: true },
  { src: "creative", dest: "items.creative_slot" },
  { src: "name", dest: "items.promotion_name", required: true }, // can be removed
  { src: "position", dest: "location_id", inItems: true }, // can be removed
  { src: "price", dest: "value" },
  { src: "currency", dest: "currency", inItems: true },
  { src: "coupon", dest: "coupon", inItems: true },
  { src: "payment_method", dest: "payment_type" },
  { src: "affiliation", dest: "affiliation", inItems: true },
  { src: "shipping", dest: "shipping" },
  { src: "tax", dest: "tax" },
  { src: "total", dest: "value" },
];

const itemParametersConfigArray = [
  { src: "product_id", dest: "item_id", required: true },
  { src: "order_id", dest: "item_id", required: true },
  { src: "checkout_id", dest: "item_name", required: true },
  { src: "name", dest: "item_name", required: true },
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
