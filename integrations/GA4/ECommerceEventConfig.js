const eventName = [
  // Browsing Section
  {
    src: ["products searched", "product searched"],
    dest: "search",
  },
  { src: ["product list viewed"], dest: "view_item_list" },
  // { src: ["product list filtered"], dest: "" },

  // Promotion Section
  { src: ["promotion viewed"], dest: "view_promotion" },
  { src: ["promotion clicked"], dest: "select_promotion" },

  // Ordering Section
  {
    src: ["product clicked", "products clicked"],
    dest: "select_item",
    hasItem: true,
  },
  { src: ["product viewed"], dest: "view_item", hasItem: true },
  { src: ["product added"], dest: "add_to_cart", hasItem: true },
  { src: ["product removed"], dest: "remove_from_cart", hasItem: true },
  { src: ["cart viewed"], dest: "view_cart", hasItem: true },
  { src: ["checkout started"], dest: "begin_checkout" },
  { src: ["checkout step viewed"], dest: "" },
  { src: ["checkout step completed"], dest: "" },
  { src: ["payment info entered"], dest: "add_payment_info" },
  { src: ["order updated"], dest: "" },
  { src: ["order completed"], dest: "purchase" },
  // { src: ["order refunded"], dest: "refund" }, GA4 refund is different it supports two refund, partial and full refund
  { src: ["order cancelled"], dest: "" },

  // Coupon Section

  //----------
  // do I need the two below events
  // Wishlist Section
  // { src: ["product added to wishlist"], dest: "add_to_wishlist" },
  //-------

  // Sharing Section
  // { src: ["product shared", "cart shared"], dest: "share" },
  //---------

  // Reviewing Section

  // --------
];

const eventParameter = [
  { src: "query", dest: ["search_term"] },
  { src: "list_id", dest: ["item_list_id", "items.item_list_id"] },
  { src: "category", dest: ["item_list_name", "items.item_list_name"] },
  { src: "promotion_id", dest: ["items.promotion_id"] },
  { src: "creative", dest: ["items.creative_slot"] },
  { src: "name", dest: ["items.promotion_name"] },
  { src: "position", dest: ["location_id", "items.location_id"] },
  { src: "price", dest: ["value"] },
  { src: "currency", dest: ["currency"] },
  { src: "coupon", dest: ["coupon"] },
  { src: "payment_method", dest: ["payment_type"] },
  { src: "affiliation", dest: ["affiliation"] },
  { src: "shipping", dest: ["shipping"] },
  { src: "tax", dest: ["tax"] },
  { src: "affiliation", dest: ["affiliation"] },
  { src: "total", dest: ["value"] },
  { src: "checkout_id", dest: ["transaction_id"] },
];

const itemParameter = [
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

export { eventName, eventParameter, itemParameter };
