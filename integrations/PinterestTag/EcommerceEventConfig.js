const eventMapping = [
  {
    src: ["Checkout Step Completed", "Order Completed"],
    dest: "Checkout",
  },
  {
    src: ["Product Added"],
    dest: "AddToCart",
  },
  {
    src: ["Products Searched", "Product List Filtered"],
    dest: "Search",
  },
];

const propertyMapping = [
  { src: "query", dest: "search_query" },
  { src: "value", dest: "value" },
  { src: "order_id", dest: "order_id" },
  { src: "currency", dest: "currency" },
  { src: "coupon", dest: "coupon or promo_code" }, // here todo
];

const productPropertyMapping = [
  { src: "product_id", dest: "product_id" },
  { src: "sku", dest: "product_id" }, // here todo
  { src: "name", dest: "product_name" },
  { src: "price", dest: "product_price" },
  { src: "category", dest: "product_category" },
  { src: "variant", dest: "product_variant" },
  { src: "quantity", dest: "product_quantity" },
  { src: "brand", dest: "product_brand" },
];

export { eventMapping, propertyMapping, productPropertyMapping };
