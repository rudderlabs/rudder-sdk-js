// Reserved Keywords for properties/traits
const ReservedPropertyKeywords = [
  "anonymous_id",
  "id",
  "sent_at",
  "received_at",
  "timestamp",
  "original_timestamp",
  "event_text",
  "event",
];

// ECommerce Parameter Names Enumeration
const ECommerceParamNames = {
  QUERY: "query",
  PRICE: "price",
  PRODUCT_ID: "product_id",
  CATEGORY: "category",
  CURRENCY: "currency",
  LIST_ID: "list_id",
  PRODUCTS: "products",
  WISHLIST_ID: "wishlist_id",
  WISHLIST_NAME: "wishlist_name",
  QUANTITY: "quantity",
  CART_ID: "cart_id",
  CHECKOUT_ID: "checkout_id",
  TOTAL: "total",
  REVENUE: "revenue",
  ORDER_ID: "order_id",
  FILTERS: "filters",
  SORTS: "sorts",
  SHARE_VIA: "share_via",
  SHARE_MESSAGE: "share_message",
  RECIPIENT: "recipient",
};
// ECommerce Events Enumeration
const ECommerceEvents = {
  PRODUCTS_SEARCHED: "Products Searched",
  PRODUCT_LIST_VIEWED: "Product List Viewed",
  PRODUCT_LIST_FILTERED: "Product List Filtered",
  PROMOTION_VIEWED: "Promotion Viewed",
  PROMOTION_CLICKED: "Promotion Clicked",
  PRODUCT_CLICKED: "Product Clicked",
  PRODUCT_VIEWED: "Product Viewed",
  PRODUCT_ADDED: "Product Added",
  PRODUCT_REMOVED: "Product Removed",
  CART_VIEWED: "Cart Viewed",
  CHECKOUT_STARTED: "Checkout Started",
  CHECKOUT_STEP_VIEWED: "Checkout Step Viewed",
  CHECKOUT_STEP_COMPLETED: "Checkout Step Completed",
  PAYMENT_INFO_ENTERED: "Payment Info Entered",
  ORDER_UPDATED: "Order Updated",
  ORDER_COMPLETED: "Order Completed",
  ORDER_REFUNDED: "Order Refunded",
  ORDER_CANCELLED: "Order Cancelled",
  COUPON_ENTERED: "Coupon Entered",
  COUPON_APPLIED: "Coupon Applied",
  COUPON_DENIED: "Coupon Denied",
  COUPON_REMOVED: "Coupon Removed",
  PRODUCT_ADDED_TO_WISHLIST: "Product Added to Wishlist",
  PRODUCT_REMOVED_FROM_WISHLIST: "Product Removed from Wishlist",
  WISH_LIST_PRODUCT_ADDED_TO_CART: "Wishlist Product Added to Cart",
  PRODUCT_SHARED: "Product Shared",
  CART_SHARED: "Cart Shared",
  PRODUCT_REVIEWED: "Product Reviewed",
};

const CONFIG_URL =
  "https://api.rudderlabs.com/sourceConfig/?p=process.module_type&v=process.package_version";
const CDN_INT_DIR = "js-integrations";
const DEST_SDK_BASE_URL = `https://cdn.rudderlabs.com/v1.1/${CDN_INT_DIR}`;

const MAX_WAIT_FOR_INTEGRATION_LOAD = 10000;
const INTEGRATION_LOAD_CHECK_INTERVAL = 1000;
const INTG_SUFFIX = "_RS";
export {
  ReservedPropertyKeywords,
  ECommerceParamNames,
  ECommerceEvents,
  CONFIG_URL,
  CDN_INT_DIR,
  DEST_SDK_BASE_URL,
  MAX_WAIT_FOR_INTEGRATION_LOAD,
  INTEGRATION_LOAD_CHECK_INTERVAL,
  INTG_SUFFIX,
};
/* module.exports = {
  MessageType: MessageType,
  ECommerceParamNames: ECommerceParamNames,
  ECommerceEvents: ECommerceEvents,
  RudderIntegrationPlatform: RudderIntegrationPlatform,
  BASE_URL: BASE_URL,
  CONFIG_URL: CONFIG_URL,
  FLUSH_QUEUE_SIZE: FLUSH_QUEUE_SIZE
}; */
