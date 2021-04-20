const eventMapping = [
  {
    src: ["checkout step completed", "order completed"],
    dest: "Checkout",
  },
  {
    src: ["product added"],
    dest: "AddToCart",
    hasEmptyProducts: true,
  },
  {
    src: ["products searched", "product list filtered"],
    dest: "Search",
  },
];

const searchPropertyMapping = { src: "query", dest: "search_query" };

const productPropertyMapping = [
  { src: ["product_id", "sku"], dest: "product_id" },
  { src: "name", dest: "product_name" },
  { src: "price", dest: "product_price" },
  { src: "category", dest: "product_category" },
  { src: "variant", dest: "product_variant" },
  { src: "quantity", dest: "product_quantity" },
  { src: "brand", dest: "product_brand" },
];

const pinterestPropertySupport = [
  "value",
  "order_quantity",
  "currency",
  "order_id",
  "product_name",
  "product_id",
  "product_category",
  "product_variant",
  "product_variant_id",
  "product_price",
  "product_quantity",
  "product_brand",
  "promo_code",
  "property",
  "video_title",
  "lead_type",
  "coupon",
];

export {
  eventMapping,
  searchPropertyMapping,
  productPropertyMapping,
  pinterestPropertySupport,
};
