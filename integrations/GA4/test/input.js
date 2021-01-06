const rudderanalytics = [];

rudderanalytics.track("Products Searched", {
  query: "HDMI cable",
});

rudderanalytics.track("Product List Viewed", {
  list_id: "list1",
  category: "What's New",
  products: [
    {
      product_id: "223344ffdds3ff3",
      sku: "12345",
      name: "Just Another Game",
      price: 22,
      position: 2,
      category: "Games and Entertainment",
      url: "https://www.myecommercewebsite.com/product",
      image_url: "https://www.myecommercewebsite.com/product/path.jpg",
    },
    {
      product_id: "343344ff5567ff3",
      sku: "12346",
      name: "Wrestling Trump Cards",
      price: 4,
      position: 21,
      category: "Card Games",
    },
  ],
});

rudderanalytics.track("Product List Filtered", {
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

rudderanalytics.track("Promotion Viewed", {
  promotion_id: "promo1",
  creative: "banner1",
  name: "sale",
  position: "home_top",
});

rudderanalytics.track("Promotion Clicked", {
  promotion_id: "promo1",
  creative: "banner1",
  name: "sale",
  position: "home_top",
});

rudderanalytics.track("Product Clicked", {
  product_id: "123",
  sku: "F15",
  category: "Games",
  name: "Game",
  brand: "Gamepro",
  variant: "111",
  price: 13.49,
  quantity: 11,
  coupon: "DISC21",
  position: 1,
  url: "https://www.website.com/product/path",
  image_url: "https://www.website.com/product/path.png",
});

rudderanalytics.track("Product Viewed", {
  product_id: "123",
  sku: "F15",
  category: "Games",
  name: "Game",
  brand: "Gamepro",
  variant: "111",
  price: 13.49,
  quantity: 11,
  coupon: "DISC21",
  currency: "USD",
  position: 1,
  url: "https://www.website.com/product/path",
  image_url: "https://www.website.com/product/path.png",
});

rudderanalytics.track("Product Added", {
  product_id: "123",
  sku: "F15",
  category: "Games",
  name: "Game",
  brand: "Gamepro",
  variant: "111",
  price: 13.49,
  quantity: 11,
  coupon: "DISC21",
  position: 1,
  url: "https://www.website.com/product/path",
  image_url: "https://www.website.com/product/path.png",
});

rudderanalytics.track("Product Removed", {
  product_id: "123",
  sku: "F15",
  category: "Games",
  name: "Game",
  brand: "Gamepro",
  variant: "111",
  price: 13.49,
  quantity: 11,
  coupon: "DISC21",
  position: 1,
  url: "https://www.website.com/product/path",
  image_url: "https://www.website.com/product/path.png",
});

rudderanalytics.track("Cart Viewed", {
  cart_id: "12345",
  products: [
    {
      product_id: "123",
      sku: "G-14",
      name: "Cards",
      price: 14.99,
      position: 1,
      category: "Games",
      url: "https://www.website.com/product/path",
      image_url: "https://www.website.com/product/path.jpg",
    },
    {
      product_id: "345",
      sku: "G-32",
      name: "UNO",
      price: 3.99,
      position: 2,
      category: "Games",
    },
  ],
});

rudderanalytics.track("Checkout Started", {
  order_id: "1234",
  affiliation: "Apple Store",
  value: 20,
  revenue: 15.0,
  shipping: 22,
  tax: 1,
  discount: 1.5,
  coupon: "ImagePro",
  currency: "USD",
  products: [
    {
      product_id: "123",
      sku: "G-32",
      name: "Monopoly",
      price: 14,
      quantity: 1,
      category: "Games",
      url: "https://www.website.com/product/path",
      image_url: "https://www.website.com/product/path.jpg",
    },
    {
      product_id: "345",
      sku: "F-32",
      name: "UNO",
      price: 3.45,
      quantity: 2,
      category: "Games",
    },
  ],
});

rudderanalytics.track("Payment Info Entered", {
  checkout_id: "12344",
  order_id: "123",
  step: "3",
  shipping_method: "ekart",
  payment_method: "card",
});

rudderanalytics.track("Order Completed", {
  checkout_id: "12345",
  order_id: "1234",
  affiliation: "Apple Store",
  total: 20,
  revenue: 15.0,
  shipping: 22,
  tax: 1,
  discount: 1.5,
  coupon: "ImagePro",
  currency: "USD",
  products: [
    {
      product_id: "123",
      sku: "G-32",
      name: "Monopoly",
      price: 14,
      quantity: 1,
      category: "Games",
      url: "https://www.website.com/product/path",
      image_url: "https://www.website.com/product/path.jpg",
    },
    {
      product_id: "345",
      sku: "F-32",
      name: "UNO",
      price: 3.45,
      quantity: 2,
      category: "Games",
    },
  ],
});

rudderanalytics.track("Order Refunded", {
  order_id: "1234",
  total: 20,
  currency: "USD",
  products: [
    {
      product_id: "123",
      sku: "G-32",
      name: "Monopoly",
      price: 17,
      quantity: 1,
      category: "Games",
      url: "https://www.website.com/product/path",
      image_url: "https://www.website.com/product/path.jpg",
    },
    {
      product_id: "345",
      sku: "F-32",
      name: "UNO",
      price: 3,
      quantity: 1,
      category: "Games",
    },
  ],
});

rudderanalytics.track("Product Added to Wishlist", {
  wishlist_id: "12345",
  wishlist_name: "Games",
  product_id: "235564423234",
  sku: "F-17",
  category: "Games",
  name: "Cards",
  brand: "Imagepro",
  variant: "123",
  price: 8.99,
  quantity: 1,
  coupon: "COUPON",
  position: 1,
  url: "https://www.site.com/product/path",
  image_url: "https://www.site.com/product/path.jpg",
});

rudderanalytics.track("Product Shared", {
  share_via: "SMS",
  share_message: "Check this",
  recipient: "name@friendsemail.com",
  product_id: "12345872254426",
  sku: "F-13",
  category: "Games",
  name: "Cards",
  brand: "Maples",
  variant: "150s",
  price: 15.99,
  url: "https://www.myecommercewebsite.com/product/prod",
  image_url: "https://www.myecommercewebsite.com/product/prod.jpg",
});
