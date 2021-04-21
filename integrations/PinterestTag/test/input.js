const rudderanalytics = [];

rudderanalytics.track("Products Searched", {
  query: "HDMI cable",
});

rudderanalytics.track("Products Searched", {
  query: "HDMI cable",
  properties: {
    date: "7 january",
  },
});

rudderanalytics.track("Product List Filtered", {
  list_id: "todays_deals_may_11_2019",
  filters: [
    {
      type: "department",
      value: "beauty",
    },
    {
      type: "price",
      value: "under-$25",
    },
  ],
  sorts: [
    {
      type: "price",
      value: "desc",
    },
  ],
  products: [
    {
      product_id: "507f1f77bcf86cd798439011",
      sku: "45360-32",
      name: "Special Facial Soap",
      price: 12.6,
      position: 1,
      category: "Beauty",
      url: "https://www.example.com/product/path",
      image_url: "https://www.example.com/product/path.jpg",
    },
    {
      product_id: "505bd76785ebb509fc283733",
      sku: "46573-32",
      name: "Fancy Hairbrush",
      price: 7.6,
      position: 2,
      category: "Beauty",
    },
  ],
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

rudderanalytics.track("Order Completed", {
  checkout_id: "fksdjfsdjfisjf9sdfjsd9f",
  order_id: "50314b8e9bcf000000000000",
  affiliation: "Google Store",
  total: 27.5,
  subtotal: 22.5,
  revenue: 25.0,
  shipping: 3,
  tax: 2,
  discount: 2.5,
  coupon: "hasbros",
  currency: "USD",
  products: [
    {
      product_id: "507f1f77bcf86cd799439011",
      sku: "45790-32",
      name: "Monopoly: 3rd Edition",
      price: 19,
      quantity: 1,
      category: "Games",
      url: "https://www.example.com/product/path",
      image_url: "https:///www.example.com/product/path.jpg",
    },
    {
      product_id: "505bd76785ebb509fc183733",
      sku: "46493-32",
      name: "Uno Card Game",
      price: 3,
      quantity: 2,
      category: "Games",
    },
  ],
});

rudderanalytics.page("Alert! I am raising a bug", "testing you", {
  path: "path",
  url: "url",
  title: "title",
  search: "search",
  referrer: "referrer",
  testDimension: "true",
});
window.rudderanalytics.page("I am no one", {
  score: 21,
  author: "Author",
  postType: "blog",
  section: "News",
});

rudderanalytics.identify("user123456", { email: "user@email.com", age: 22 });

// Tests With Custom Properties added
rudderanalytics.track("Order Completed", {
  checkout_id: "12345",
  order_id: "1234",
  affiliation: "Apple Store",
  total: 20,
  revenue: 15.0,
  shipping: 22,
  tax: 1,
  discount: 1.5,
  isUserAuthenticated: true, // custom properties
  isDomainLocked: false, // custom properties
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
