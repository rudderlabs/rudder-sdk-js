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
    },
  ],
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
    },
  ],
});

window.gtag("event", "add_to_cart", {
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
    },
  ],
});

window.gtag("event", "remove_from_cart", {
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
    },
  ],
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
  affiliation: "Apple Store",
  shipping: 22,
  tax: 1,
  coupon: "ImagePro",
  currency: "USD",
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
});
