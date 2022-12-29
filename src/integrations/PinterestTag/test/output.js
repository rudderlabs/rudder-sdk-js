const pintrk = [];

pintrk('track', 'search', { search_query: 'HDMI cable' });

pintrk('track', 'search', {
  search_query: 'HDMI cable',
  'properties.date': '7 january',
});

pintrk('track', 'search', {
  line_items: [
    {
      product_id: '45360-32',
      product_name: 'Special Facial Soap',
      product_price: 12.6,
      product_category: 'Beauty',
    },
    {
      product_id: '46573-32',
      product_name: 'Fancy Hairbrush',
      product_price: 7.6,
      product_category: 'Beauty',
    },
  ],
});

pintrk('track', 'addtocart', {
  coupon: 'DISC21',
  line_items: [
    {
      product_id: 'F15',
      product_name: 'Game',
      product_price: 13.49,
      product_category: 'Games',
      product_variant: '111',
      product_quantity: 11,
      product_brand: 'Gamepro',
    },
  ],
});

pintrk('track', 'checkout', {
  order_id: '50314b8e9bcf000000000000',
  currency: 'USD',
  'coupon or promo_code': 'hasbros',
  line_items: [
    {
      product_id: '45790-32',
      product_name: 'Monopoly: 3rd Edition',
      product_price: 19,
      product_category: 'Games',
      product_quantity: 1,
    },
    {
      product_id: '46493-32',
      product_name: 'Uno Card Game',
      product_price: 3,
      product_category: 'Games',
      product_quantity: 2,
    },
  ],
});

pintrk('track', 'ViewCategory', {
  name: 'testing you',
  category: 'Alert! I am raising a bug',
});

pintrk('track', 'PageVisit', {
  name: 'I am no one',
});

pintrk('set', {
  np: 'rudderstack',
  em: 'user@email.com',
});

pintrk('track', 'Checkout', {
  coupon: 'ImagePro',
  currency: 'USD',
  order_id: '1234',
  line_items: [
    {
      product_quantity: '1',
      product_category: 'Games',
      product_price: '14',
      product_name: 'Monopoly',
      product_id: '123',
    },
    {
      product_quantity: '2',
      product_category: 'Games',
      product_price: '3.45',
      product_name: 'UNO',
      product_id: '345',
    },
  ],
  isUserAuthenticated: 'true',
  isDomainLocked: 'false',
});

pintrk(
  'track',
  'Signup',

  {
    order_id: '1234',
    coupon: 'ImagePro',
    currency: 'USD',
    line_items: [
      {
        product_quantity: '1',
        product_category: 'Games',
        product_price: '14',
        product_name: 'Monopoly',
        product_id: '123',
      },
      {
        product_quantity: '2',
        product_category: 'Games',
        product_price: '3.45',
        product_name: 'UNO',
        product_id: 'F-32-sku-value',
      },
    ],
    isUserAuthenticated: 'true',
    isDomainLocked: 'false',
  },
);
