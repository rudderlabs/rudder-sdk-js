const gtag = [];

gtag("event", "search", { search_term: "HDMI cable" });

gtag("event", "view_item_list", {
  item_list_id: "list1",
  items: [
    {
      item_id: "223344ffdds3ff3",
      item_name: "Just Another Game",
      price: 22,
      index: 2,
      item_category: "Games and Entertainment",
      item_list_id: "list1",
      item_list_name: "What's New",
    },
    {
      item_id: "343344ff5567ff3",
      item_name: "Wrestling Trump Cards",
      price: 4,
      index: 21,
      item_category: "Card Games",
      item_list_id: "list1",
      item_list_name: "What's New",
    },
  ],
  item_list_name: "What's New",
});

gtag("event", "Product List Filtered", {
  list_id: "dealoftheday",
  filters: [
    {
      type: "department",
      value: "health",
    },
    {
      type: "price",
      value: "under-$75",
    },
  ],
  sorts: [
    {
      type: "price",
      value: "asc",
    },
  ],
  products: [
    {
      product_id: "5034221345ffcd672315011",
      sku: "12345",
      name: "Whey Protein",
      price: 55.45,
      position: 1,
      category: "health",
      url: "https://www.myecommercewebsite.com/product/product1123",
      image_url: "https://www.example.com/product/1123.jpg",
    },
    {
      product_id: "121244455323232326677232",
      sku: "345667",
      name: "Boost",
      price: 47.85,
      position: 12,
      category: "health",
    },
  ],
});

gtag("event", "view_promotion", { location_id: "home_top" });

gtag("event", "select_promotion", { location_id: "home_top" });

gtag("event", "select_item", {
  items: [
    {
      item_id: "123",
      item_category: "Games",
      item_name: "Game",
      item_brand: "Gamepro",
      item_variant: "111",
      price: 13.49,
      quantity: 11,
      coupon: "DISC21",
      index: 1,
      item_list_name: "Games",
    },
  ],
  item_list_name: "Games",
  value: 13.49, // extra
  coupon: "DISC21", // extra
});

gtag("event", "view_item", {
  items: [
    {
      item_id: "123",
      item_category: "Games",
      item_name: "Game",
      item_brand: "Gamepro",
      item_variant: "111",
      price: 13.49,
      quantity: 11,
      coupon: "DISC21",
      index: 1,
      item_list_name: "Games", // extra
      promotion_name: "Game",
      currency: "USD",
      location_id: 1,
    },
  ],
  item_list_name: "Games", // extra
  value: 13.49,
  coupon: "DISC21", // extra
  currency: "USD",
});

window.gtag("event", "add_to_cart", {
  content_id: "123",
  items: [
    {
      item_id: "123",
      item_category: "Games",
      item_name: "Game",
      item_brand: "Gamepro",
      item_variant: "111",
      price: 13.49,
      quantity: 11,
      coupon: "DISC21",
      index: 1,
      item_list_name: "Games",
      promotion_name: "Game",
      location_id: 1,
    },
  ],
  item_list_name: "Games",
  value: 13.49,
  coupon: "DISC21",
  location_id: 1,
});

window.gtag("event", "remove_from_cart", {
  content_id: "123",
  items: [
    {
      item_id: "123",
      item_category: "Games",
      item_name: "Game",
      item_brand: "Gamepro",
      item_variant: "111",
      price: 13.49,
      quantity: 11,
      coupon: "DISC21",
      index: 1,
      item_list_name: "Games",
      promotion_name: "Game",
      location_id: 1,
    },
  ],
  item_list_name: "Games",
  value: 13.49,
  coupon: "DISC21",
  location_id: 1,
});

window.gtag("event", "view_cart", {
  items: [
    {
      item_id: "123",
      item_name: "Cards",
      price: 14.99,
      index: 1,
      item_category: "Games",
    },
    {
      item_id: "345",
      item_name: "UNO",
      price: 3.99,
      index: 2,
      item_category: "Games",
    },
  ],
});

window.gtag("event", "begin_checkout", {
  items: [
    {
      item_id: "123",
      item_name: "Monopoly",
      price: 14,
      quantity: 1,
      item_category: "Games",
      affiliation: "Apple Store",
      coupon: "ImagePro",
      currency: "USD",
    },
    {
      item_id: "345",
      item_name: "UNO",
      price: 3.45,
      quantity: 2,
      item_category: "Games",
      affiliation: "Apple Store",
      coupon: "ImagePro",
      currency: "USD",
    },
  ],
  affiliation: "Apple Store",
  shipping: 22,
  tax: 1,
  coupon: "ImagePro",
  currency: "USD",
});

// eslint-disable-next-line no-unused-vars
const multiplePayloadExample = [
  window.gtag("event", "add_payment_info", {
    payment_type: "card",
  }),

  window.gtag("event", "add_shipping_info", {
    shipping_tier: "ekart",
  }),
];

window.gtag("event", "purchase", {
  items: [
    {
      item_id: "123",
      item_name: "Monopoly",
      price: 14,
      quantity: 1,
      item_category: "Games",
      affiliation: "Apple Store",
      coupon: "ImagePro",
      currency: "USD",
    },
    {
      item_id: "345",
      item_name: "UNO",
      price: 3.45,
      quantity: 2,
      item_category: "Games",
      affiliation: "Apple Store",
      coupon: "ImagePro",
      currency: "USD",
    },
  ],
  affiliation: "Apple Store",
  value: 20,
  shipping: 22,
  tax: 1,
  coupon: "ImagePro",
  currency: "USD",
});

window.gtag("event", "refund", {
  value: 20,
  items: [
    {
      item_id: "123",
      item_name: "Monopoly",
      price: 17,
      quantity: 1,
      item_category: "Games",
      currency: "USD",
    },
    {
      item_id: "345",
      item_name: "UNO",
      price: 3,
      quantity: 1,
      item_category: "Games",
      currency: "USD",
    },
  ],
  currency: "USD",
});

window.gtag("event", "add_to_wishlist", {
  content_id: "235564423234",
  items: [
    {
      item_id: "235564423234",
      item_category: "Games",
      item_name: "Cards",
      item_brand: "Imagepro",
      item_variant: "123",
      price: 8.99,
      quantity: 1,
      coupon: "COUPON",
      index: 1,
      item_list_name: "Games",
      promotion_name: "Cards",
      location_id: 1,
    },
  ],
  item_list_name: "Games",
  value: 8.99,
  coupon: "COUPON",
  location_id: 1,
});

window.gtag("event", "share", {
  method: "SMS",
  content_type: "Check this",
  content_id: "12345872254426",
});
