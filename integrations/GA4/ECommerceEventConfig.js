const requiredEventParameters = {
  PromotionId: "promotion_id",
  PromotionName: "promotion_name",
  Search: "search_term",
  ProductId: "item_id",
  ProductName: "item_name",
};

const eventNamesConfigArray = [
  // Browsing Section
  {
    src: ["products searched", "product searched"],
    dest: "search",
    requiredParams: requiredEventParameters.Search,
    isSearch: true,
  },
  {
    src: ["product list viewed"],
    dest: "view_item_list",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
  },

  // Promotion Section
  {
    src: ["promotion viewed"],
    dest: "view_promotion",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
      requiredEventParameters.PromotionId,
      requiredEventParameters.PromotionName,
    ],
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
  },

  // Ordering Section
  {
    src: ["product clicked", "products clicked"],
    dest: "select_item",
    hasItem: true,
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
  },
  {
    src: ["product viewed"],
    dest: "view_item",
    hasItem: true,
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
  },
  {
    src: ["product added"],
    dest: "add_to_cart",
    hasItem: true,
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
  },
  {
    src: ["product removed"],
    dest: "remove_from_cart",
    hasItem: true,
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
  },
  {
    src: ["cart viewed"],
    dest: "view_cart",
    hasItem: true,
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
  },
  {
    src: ["checkout started"],
    dest: "begin_checkout",
    requiredParams: [
      requiredEventParameters.ProductId,
      requiredEventParameters.ProductName,
    ],
  },
  {
    src: ["payment info entered"],
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
  },
  // Check how to do
  { src: ["order refunded"], dest: "refund" }, // GA4 refund is different it supports two refund, partial and full refund  // order_id

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
  },
  //-------

  // Sharing Section
  { src: ["product shared", "cart shared"], dest: "share" },
  //---------
];

const eventParametersConfigArray = [
  { src: "query", dest: "search_term", required: true },
  { src: "list_id", dest: "item_list_id", inItems: true },
  { src: "category", dest: "item_list_name", inItems: true },
  { src: "promotion_id", dest: "items.promotion_id", required: true },
  { src: "creative", dest: "items.creative_slot" },
  { src: "name", dest: "items.promotion_name", required: true },
  { src: "position", dest: "location_id", inItems: true },
  { src: "price", dest: "value" },
  { src: "currency", dest: "currency", inItems: true },
  { src: "coupon", dest: "coupon", inItems: true },
  { src: "payment_method", dest: "payment_type" },
  { src: "affiliation", dest: "affiliation", inItems: true },
  { src: "shipping", dest: "shipping" },
  { src: "tax", dest: "tax" },
  { src: "total", dest: "value" },
  // { src: "checkout_id", dest: "transaction_id" }, // to be removed
  { src: "share_via", dest: "method" },
  { src: "share_message", dest: "content_type" },
  { src: "product_id", dest: "content_id" },
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
