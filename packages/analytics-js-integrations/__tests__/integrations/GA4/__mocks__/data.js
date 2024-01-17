const mapping = [
  {
    sourceKeys: 'properties.product_id',
    destinationKey: 'item_id',
  },
  {
    sourceKeys: 'properties.price',
    destinationKey: 'price',
  },
];

const productInfo1 = {
  product_id: '123',
  sku: 'G-14',
  name: 'Cards',
  price: 14.99,
  position: 1,
  category: 'Games',
  url: 'https://www.website.com/product/path',
  image_url: 'https://www.website.com/product/path.jpg',
};

const productInfo2 = {
  currency: 'INR',
  product_id: '345',
  sku: 'G-32',
  name: 'UNO',
  price: 3.99,
  position: 2,
  category: 'Games',
};

const inputProductsArray = [productInfo1, productInfo2];

const outputProductsArray = [
  {
    image_url: 'https://www.website.com/product/path.jpg',
    index: 1,
    item_category: 'Games',
    item_id: '123',
    item_name: 'Cards',
    price: 14.99,
    sku: 'G-14',
    url: 'https://www.website.com/product/path',
  },
  {
    currency: 'INR',
    index: 2,
    item_category: 'Games',
    item_id: '345',
    item_name: 'UNO',
    price: 3.99,
    sku: 'G-32',
  },
];

const expectedItemsArray = [
  {
    index: 1,
    item_category: 'Games',
    item_id: '123',
    item_name: 'Cards',
    price: 14.99,
  },
  {
    index: 2,
    item_category: 'Games',
    item_id: '345',
    item_name: 'UNO',
    price: 3.99,
  },
];

const identifyEvents = [
  {
    description: 'Event with userId and traits',
    input: {
      message: {
        userId: 'user@1',
        context: {
          traits: {
            age: 40,
            email: 'sdk@gmail.com',
            phone: '123456',
            userInterest: 'high',
            source: 'RudderStack',
            card_number: '4312 4312 4312 4312'
          },
        },
        integrations: {},
      },
    },
    output: {
      userId: {
        user_id: 'user@1',
      },
      traits: {
        age: 40,
        card_number: '4312 4312 4312 4312',
        userInterest: 'high',
        source: 'RudderStack',
        email: 'sdk@gmail.com',
        phone: '123456',
      },
    },
  },
];

const trackEvents = [
  {
    description: 'Product Search event',
    input: {
      message: {
        event: 'Products Searched',
        properties: {
          query: 't-shirts',
          brand: 'H&M',
        },
        integrations: {},
      },
    },
    output: {
      event: 'search',
      params: { brand: 'H&M', search_term: 't-shirts', send_to: 'G-123456' },
    },
  },
  {
    description: 'Product List Viewed event',
    input: {
      message: {
        event: 'Product List Viewed',
        properties: {
          list_id: 'list1',
          category: "What's New",
          users: {},
          products: [
            {
              product_id: '223344ffdds3ff3',
              sku: '12345',
              name: 'Just Another Game',
              price: 22,
              rating: '',
              categories: [],
              position: 2,
              category: 'Games and Entertainment',
              url: 'https://www.myecommercewebsite.com/product',
              image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
            },
            {
              product_id: '343344ff5567ff3',
              sku: '12346',
              name: 'Wrestling Trump Cards',
              price: 4,
              rating: '',
              categories: [],
              position: 21,
              category: 'Card Games',
            },
          ],
        },
        integrations: {},
      },
    },
    output: {
      event: 'view_item_list',
      params: {
        item_list_id: 'list1',
        item_list_name: "What's New",
        items: [
          {
            image_url: 'https://www.myecommercewebsite.com/product/path.jpg',
            index: 2,
            item_category: 'Games and Entertainment',
            item_id: '223344ffdds3ff3',
            item_name: 'Just Another Game',
            price: 22,
            sku: '12345',
            url: 'https://www.myecommercewebsite.com/product',
          },
          {
            index: 21,
            item_category: 'Card Games',
            item_id: '343344ff5567ff3',
            item_name: 'Wrestling Trump Cards',
            price: 4,
            sku: '12346',
          },
        ],
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Product List Filtered',
    input: {
      message: {
        event: 'Product List Filtered',
        properties: {
          list_id: 'list1',
          category: "What's New",
          products: {
            list_id: 'dealoftheday',
            filters: [
              {
                type: 'department',
                value: 'health',
              },
              {
                type: 'price',
                value: 'under-$75',
              },
            ],
            sorts: [
              {
                type: 'price',
                value: 'asc',
              },
            ],
            products: [
              {
                product_id: '5034221345ffcd672315011',
                sku: '12345',
                name: 'Whey Protein',
                price: 55.45,
                position: 1,
                category: 'health',
                url: 'https://www.myecommercewebsite.com/product/product1123',
                image_url: 'https://www.example.com/product/1123.jpg',
              },
              {
                product_id: '121244455323232326677232',
                sku: '345667',
                name: 'Boost',
                price: 47.85,
                position: 12,
                category: 'health',
              },
            ],
          },
        },
        integrations: {},
      },
    },
    output: {
      event: 'Product_List_Filtered',
      params: {
        category: "What's New",
        list_id: 'list1',
        products_filters_0_type: 'department',
        products_filters_0_value: 'health',
        products_filters_1_type: 'price',
        products_filters_1_value: 'under-$75',
        products_list_id: 'dealoftheday',
        products_products_0_category: 'health',
        products_products_0_image_url: 'https://www.example.com/product/1123.jpg',
        products_products_0_name: 'Whey Protein',
        products_products_0_position: 1,
        products_products_0_price: 55.45,
        products_products_0_product_id: '5034221345ffcd672315011',
        products_products_0_sku: '12345',
        products_products_0_url: 'https://www.myecommercewebsite.com/product/product1123',
        products_products_1_category: 'health',
        products_products_1_name: 'Boost',
        products_products_1_position: 12,
        products_products_1_price: 47.85,
        products_products_1_product_id: '121244455323232326677232',
        products_products_1_sku: '345667',
        products_sorts_0_type: 'price',
        products_sorts_0_value: 'asc',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Promotion Viewed event',
    input: {
      message: {
        event: 'Promotion Viewed',
        properties: {
          promotion_id: 'promo1',
          creative: 'banner1',
          name: 'sale',
          position: 'home_top',
        },
        integrations: {},
      },
    },
    output: {
      event: 'view_promotion',
      params: {
        creative_name: 'banner1',
        creative_slot: 'home_top',
        promotion_id: 'promo1',
        promotion_name: 'sale',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Promotion Clicked event',
    input: {
      message: {
        event: 'Promotion Clicked',
        properties: {
          promotion_id: 'promo1',
          creative: 'banner1',
          name: 'sale',
          position: 'home_top',
        },
        integrations: {},
      },
    },
    output: {
      event: 'select_promotion',
      params: {
        creative_name: 'banner1',
        creative_slot: 'home_top',
        promotion_id: 'promo1',
        promotion_name: 'sale',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Product Clicked event',
    input: {
      message: {
        event: 'Product Clicked',
        properties: {
          product_id: '123',
          sku: 'F15',
          category: 'Games',
          name: 'Game',
          brand: 'Gamepro',
          variant: '111',
          price: 13.49,
          quantity: 11,
          coupon: 'DISC21',
          position: 1,
          url: 'https://www.website.com/product/path',
          image_url: 'https://www.website.com/product/path.webp',
        },
        integrations: {},
      },
    },
    output: {
      event: 'select_item',
      params: {
        image_url: 'https://www.website.com/product/path.webp',
        item_list_name: 'Games',
        items: [
          {
            coupon: 'DISC21',
            index: 1,
            item_brand: 'Gamepro',
            item_category: 'Games',
            item_id: '123',
            item_name: 'Game',
            item_variant: '111',
            price: 13.49,
            quantity: 11,
          },
        ],
        sku: 'F15',
        url: 'https://www.website.com/product/path',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Product Viewed event',
    input: {
      message: {
        userId: '1234',
        event: 'Product Viewed',
        properties: {
          product_id: '123',
          sku: 'F15',
          category: 'Games',
          name: 'Game',
          brand: 'Gamepro',
          variant: '111',
          price: 13.49,
          quantity: 11,
          coupon: 'DISC21',
          currency: 'USD',
          position: 1,
          url: 'https://www.website.com/product/path',
          image_url: 'https://www.website.com/product/path.webp',
        },
      },
    },
    output: {
      event: 'view_item',
      params: {
        image_url: 'https://www.website.com/product/path.webp',
        currency: 'USD',
        value: 13.49,
        items: [
          {
            coupon: 'DISC21',
            index: 1,
            item_brand: 'Gamepro',
            item_category: 'Games',
            item_id: '123',
            item_name: 'Game',
            item_variant: '111',
            price: 13.49,
            quantity: 11,
          },
        ],
        sku: 'F15',
        url: 'https://www.website.com/product/path',
        user_id: '1234',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Product Added event',
    input: {
      message: {
        event: 'Product Added',
        properties: {
          product_id: '123',
          sku: 'F15',
          category: 'Games',
          name: 'Game',
          brand: 'Gamepro',
          variant: '111',
          price: 13.49,
          quantity: 11,
          coupon: 'DISC21',
          position: 1,
          url: 'https://www.website.com/product/path',
          image_url: 'https://www.website.com/product/path.webp',
        },
      },
    },
    output: {
      event: 'add_to_cart',
      params: {
        image_url: 'https://www.website.com/product/path.webp',
        currency: 'USD',
        value: 148.39,
        items: [
          {
            coupon: 'DISC21',
            index: 1,
            item_brand: 'Gamepro',
            item_category: 'Games',
            item_id: '123',
            item_name: 'Game',
            item_variant: '111',
            price: 13.49,
            quantity: 11,
          },
        ],
        sku: 'F15',
        url: 'https://www.website.com/product/path',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Product Removed event',
    input: {
      message: {
        event: 'Product Removed',
        properties: {
          product_id: '123',
          sku: 'F15',
          category: 'Games',
          name: 'Game',
          brand: 'Gamepro',
          variant: '111',
          price: 13.49,
          quantity: 11,
          coupon: 'DISC21',
          position: 1,
          url: 'https://www.website.com/product/path',
          image_url: 'https://www.website.com/product/path.webp',
        },
      },
    },
    output: {
      event: 'remove_from_cart',
      params: {
        image_url: 'https://www.website.com/product/path.webp',
        currency: 'USD',
        value: 148.39,
        items: [
          {
            coupon: 'DISC21',
            index: 1,
            item_brand: 'Gamepro',
            item_category: 'Games',
            item_id: '123',
            item_name: 'Game',
            item_variant: '111',
            price: 13.49,
            quantity: 11,
          },
        ],
        sku: 'F15',
        url: 'https://www.website.com/product/path',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Cart Viewed event',
    input: {
      message: {
        event: 'Cart Viewed',
        properties: {
          cart_id: '12345',
          total: 21,
          products: [
            {
              product_id: '123',
              sku: 'G-14',
              name: 'Cards',
              price: 14.99,
              position: 1,
              category: 'Games',
              url: 'https://www.website.com/product/path',
              image_url: 'https://www.website.com/product/path.jpg',
            },
            {
              product_id: '345',
              sku: 'G-32',
              name: 'UNO',
              price: 3.99,
              position: 2,
              category: 'Games',
            },
          ],
        },
      },
    },
    output: {
      event: 'view_cart',
      params: {
        cart_id: '12345',
        currency: 'USD',
        value: 21,
        items: [
          {
            index: 1,
            image_url: 'https://www.website.com/product/path.jpg',
            item_category: 'Games',
            item_id: '123',
            item_name: 'Cards',
            price: 14.99,
            sku: 'G-14',
            url: 'https://www.website.com/product/path',
          },
          {
            index: 2,
            item_category: 'Games',
            item_id: '345',
            item_name: 'UNO',
            price: 3.99,
            sku: 'G-32',
          },
        ],
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Checkout Started event',
    input: {
      message: {
        event: 'Checkout Started',
        properties: {
          order_id: '1234',
          affiliation: 'Apple Store',
          value: 20,
          revenue: 15.0,
          shipping: 4,
          tax: 1,
          discount: 1.5,
          coupon: 'ImagePro',
          currency: 'USD',
          products: [
            {
              product_id: '123',
              sku: 'G-32',
              name: 'Monopoly',
              price: 14,
              quantity: 1,
              category: 'Games',
              url: 'https://www.website.com/product/path',
              image_url: 'https://www.website.com/product/path.jpg',
            },
            {
              product_id: '345',
              sku: 'F-32',
              name: 'UNO',
              price: 3.45,
              quantity: 2,
              category: 'Games',
            },
          ],
        },
      },
    },
    output: {
      event: 'begin_checkout',
      params: {
        currency: 'USD',
        affiliation: 'Apple Store',
        coupon: 'ImagePro',
        value: 20,
        order_id: '1234',
        shipping: 4,
        tax: 1,
        discount: 1.5,
        items: [
          {
            image_url: 'https://www.website.com/product/path.jpg',
            item_category: 'Games',
            item_id: '123',
            item_name: 'Monopoly',
            price: 14,
            sku: 'G-32',
            quantity: 1,
            url: 'https://www.website.com/product/path',
          },
          {
            item_category: 'Games',
            item_id: '345',
            item_name: 'UNO',
            price: 3.45,
            quantity: 2,
            sku: 'F-32',
          },
        ],
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Checkout Step Viewed event',
    input: {
      message: {
        event: 'Checkout Step Viewed',
        properties: {
          checkout_id: '123',
          step: 1,
          shipping_method: 'DHL',
          payment_method: 'Mastercard',
        },
      },
    },
    output: {
      event: 'Checkout_Step_Viewed',
      params: {
        checkout_id: '123',
        step: 1,
        shipping_method: 'DHL',
        payment_method: 'Mastercard',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Checkout Step Completed event',
    input: {
      message: {
        event: 'Checkout Step Completed',
        properties: {
          total: 13,
          checkout_id: '123',
          step: 1,
          shipping_method: 'DHL',
          payment_method: 'Mastercard',
        },
      },
    },
    output: {
      event: 'add_shipping_info',
      params: {
        currency: 'USD',
        checkout_id: '123',
        step: 1,
        shipping_tier: 'DHL',
        payment_method: 'Mastercard',
        value: 13,
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Payment Info Entered event',
    input: {
      message: {
        event: 'Payment Info Entered',
        properties: {
          total: 10,
          checkout_id: '12344',
          order_id: '123',
        },
      },
    },
    output: {
      event: 'add_payment_info',
      params: {
        currency: 'USD',
        checkout_id: '12344',
        order_id: '123',
        value: 10,
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Order Updated event',
    input: {
      message: {
        event: 'Order Updated',
        properties: {
          order_id: '1234',
          affiliation: 'Apple Store',
          value: 20,
          revenue: 15.0,
          shipping: 22,
          tax: 1,
          discount: 1.5,
          coupon: 'ImagePro',
          currency: 'USD',
          products: [
            {
              product_id: '123',
              sku: 'G-32',
              name: 'Monopoly',
              price: 14,
              quantity: 1,
              category: 'Games',
              url: 'https://www.website.com/product/path',
              image_url: 'https://www.website.com/product/path.jpg',
            },
            {
              product_id: '345',
              sku: 'F-32',
              name: 'UNO',
              price: 3.45,
              quantity: 2,
              category: 'Games',
            },
          ],
        },
      },
    },
    output: {
      event: 'Order_Updated',
      params: {
        affiliation: 'Apple Store',
        coupon: 'ImagePro',
        currency: 'USD',
        discount: 1.5,
        order_id: '1234',
        products_0_category: 'Games',
        products_0_image_url: 'https://www.website.com/product/path.jpg',
        products_0_name: 'Monopoly',
        products_0_price: 14,
        products_0_product_id: '123',
        products_0_quantity: 1,
        products_0_sku: 'G-32',
        products_0_url: 'https://www.website.com/product/path',
        products_1_category: 'Games',
        products_1_name: 'UNO',
        products_1_price: 3.45,
        products_1_product_id: '345',
        products_1_quantity: 2,
        products_1_sku: 'F-32',
        revenue: 15,
        send_to: 'G-123456',
        shipping: 22,
        tax: 1,
        value: 20,
      },
    },
  },
  {
    description: 'Order Completed event',
    input: {
      message: {
        event: 'Order Completed',
        properties: {
          checkout_id: '12345',
          order_id: '1234',
          affiliation: 'Apple Store',
          total: 20,
          revenue: 15.0,
          shipping: 4,
          tax: 1,
          discount: 1.5,
          coupon: 'ImagePro',
          currency: 'USD',
          products: [
            {
              product_id: '123',
              sku: 'G-32',
              name: 'Monopoly',
              price: 14,
              quantity: 1,
              category: 'Games',
              url: 'https://www.website.com/product/path',
              image_url: 'https://www.website.com/product/path.jpg',
            },
            {
              product_id: '345',
              sku: 'F-32',
              name: 'UNO',
              price: 3.45,
              quantity: 2,
              category: 'Games',
            },
          ],
        },
      },
    },
    output: {
      event: 'purchase',
      params: {
        affiliation: 'Apple Store',
        checkout_id: '12345',
        coupon: 'ImagePro',
        currency: 'USD',
        discount: 1.5,
        items: [
          {
            image_url: 'https://www.website.com/product/path.jpg',
            item_category: 'Games',
            item_id: '123',
            item_name: 'Monopoly',
            price: 14,
            quantity: 1,
            sku: 'G-32',
            url: 'https://www.website.com/product/path',
          },
          {
            item_category: 'Games',
            item_id: '345',
            item_name: 'UNO',
            price: 3.45,
            quantity: 2,
            sku: 'F-32',
          },
        ],
        send_to: 'G-123456',
        shipping: 4,
        tax: 1,
        transaction_id: '1234',
        value: 20,
      },
    },
  },
  {
    description: 'Order Refunded event',
    input: {
      message: {
        event: 'Order Refunded',
        properties: {
          order_id: '1234',
          total: 20,
          currency: 'USD',
          products: [
            {
              product_id: '123',
              sku: 'G-32',
              name: 'Monopoly',
              price: 17,
              quantity: 1,
              category: 'Games',
              url: 'https://www.website.com/product/path',
              image_url: 'https://www.website.com/product/path.jpg',
            },
            {
              product_id: '345',
              sku: 'F-32',
              name: 'UNO',
              price: 3,
              quantity: 1,
              category: 'Games',
            },
          ],
        },
      },
    },
    output: {
      event: 'refund',
      params: {
        currency: 'USD',
        items: [
          {
            image_url: 'https://www.website.com/product/path.jpg',
            item_category: 'Games',
            item_id: '123',
            item_name: 'Monopoly',
            price: 17,
            quantity: 1,
            sku: 'G-32',
            url: 'https://www.website.com/product/path',
          },
          {
            item_category: 'Games',
            item_id: '345',
            item_name: 'UNO',
            price: 3,
            quantity: 1,
            sku: 'F-32',
          },
        ],
        send_to: 'G-123456',
        transaction_id: '1234',
        value: 20,
      },
    },
  },
  {
    description: 'Order Cancelled event',
    input: {
      message: {
        event: 'Order Cancelled',
        properties: {
          order_id: '1234',
          affiliation: 'Apple Store',
          total: 20,
          revenue: 15.0,
          shipping: 4,
          tax: 1,
          discount: 1.5,
          coupon: 'ImagePro',
          currency: 'USD',
          products: [
            {
              product_id: '123',
              sku: 'G-32',
              name: 'Monopoly',
              price: 14,
              quantity: 1,
              category: 'Games',
              url: 'https://www.website.com/product/path',
              image_url: 'https://www.website.com/product/path.jpg',
            },
            {
              product_id: '345',
              sku: 'F-32',
              name: 'UNO',
              price: 3.45,
              quantity: 2,
              category: 'Games',
            },
          ],
        },
      },
    },
    output: {
      event: 'Order_Cancelled',
      params: {
        discount: 1.5,
        order_id: '1234',
        products_0_category: 'Games',
        products_0_image_url: 'https://www.website.com/product/path.jpg',
        products_0_name: 'Monopoly',
        products_0_price: 14,
        products_0_product_id: '123',
        products_0_quantity: 1,
        products_0_sku: 'G-32',
        products_0_url: 'https://www.website.com/product/path',
        products_1_category: 'Games',
        products_1_name: 'UNO',
        products_1_price: 3.45,
        products_1_product_id: '345',
        products_1_quantity: 2,
        products_1_sku: 'F-32',
        revenue: 15,
        send_to: 'G-123456',
        shipping: 4,
        tax: 1,
        total: 20,
        affiliation: 'Apple Store',
        coupon: 'ImagePro',
        currency: 'USD',
      },
    },
  },
  {
    description: 'Coupon Entered event',
    input: {
      message: {
        event: 'Coupon Entered',
        properties: {
          order_id: '12345',
          cart_id: '1222111',
          coupon_id: 'disc20',
        },
      },
    },
    output: {
      event: 'Coupon_Entered',
      params: {
        cart_id: '1222111',
        coupon_id: 'disc20',
        order_id: '12345',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Coupon Applied event',
    input: {
      message: {
        event: 'Coupon Applied',
        properties: {
          order_id: '1223455',
          cart_id: '123566',
          coupon_id: '23321',
          coupon_name: 'Disc21',
          discount: 21.0,
        },
      },
    },
    output: {
      event: 'Coupon_Applied',
      params: {
        cart_id: '123566',
        coupon_id: '23321',
        coupon_name: 'Disc21',
        discount: 21,
        order_id: '1223455',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Coupon Denied event',
    input: {
      message: {
        event: 'Coupon Denied',
        properties: {
          order_id: '123',
          cart_id: '1211',
          coupon: 'Disc21',
          reason: 'Coupon expired',
        },
      },
    },
    output: {
      event: 'Coupon_Denied',
      params: {
        cart_id: '1211',
        coupon: 'Disc21',
        order_id: '123',
        reason: 'Coupon expired',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Coupon Removed event',
    input: {
      message: {
        event: 'Coupon Removed',
        properties: {
          order_id: '1211',
          cart_id: '124',
          coupon_id: 'Dis123',
          coupon_name: 'Disc20',
          discount: 20.0,
        },
      },
    },
    output: {
      event: 'Coupon_Removed',
      params: {
        cart_id: '124',
        coupon_id: 'Dis123',
        coupon_name: 'Disc20',
        discount: 20,
        order_id: '1211',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Product Added to Wishlist event',
    input: {
      message: {
        event: 'Product Added to Wishlist',
        properties: {
          wishlist_id: '12345',
          wishlist_name: 'Games',
          product_id: '235564423234',
          sku: 'F-17',
          category: 'Games',
          name: 'Cards',
          brand: 'Imagepro',
          variant: '123',
          price: 8.99,
          quantity: 1,
          coupon: 'COUPON',
          position: 1,
          url: 'https://www.site.com/product/path',
          image_url: 'https://www.site.com/product/path.jpg',
        },
      },
    },
    output: {
      event: 'add_to_wishlist',
      params: {
        currency: 'USD',
        image_url: 'https://www.site.com/product/path.jpg',
        items: [
          {
            coupon: 'COUPON',
            index: 1,
            item_brand: 'Imagepro',
            item_category: 'Games',
            item_id: '235564423234',
            item_name: 'Cards',
            item_variant: '123',
            price: 8.99,
            quantity: 1,
          },
        ],
        send_to: 'G-123456',
        sku: 'F-17',
        url: 'https://www.site.com/product/path',
        value: 8.99,
        wishlist_id: '12345',
        wishlist_name: 'Games',
      },
    },
  },
  {
    description: 'Product Removed from Wishlist event',
    input: {
      message: {
        event: 'Product Removed from Wishlist',
        properties: {
          wishlist_id: '12345',
          wishlist_name: 'Games',
          product_id: '235564423234',
          sku: 'F-17',
          category: 'Games',
          name: 'Cards',
          brand: 'Imagepro',
          variant: '123',
          price: 8.99,
          quantity: 1,
          coupon: 'COUPON',
          position: 1,
          url: 'https://www.site.com/product/path',
          image_url: 'https://www.site.com/product/path.jpg',
        },
      },
    },
    output: {
      event: 'Product_Removed_from_Wishlist',
      params: {
        brand: 'Imagepro',
        category: 'Games',
        coupon: 'COUPON',
        image_url: 'https://www.site.com/product/path.jpg',
        name: 'Cards',
        position: 1,
        product_id: '235564423234',
        price: 8.99,
        quantity: 1,
        send_to: 'G-123456',
        sku: 'F-17',
        url: 'https://www.site.com/product/path',
        variant: '123',
        wishlist_id: '12345',
        wishlist_name: 'Games',
      },
    },
  },
  {
    description: 'Wishlist Product Added to Cart event',
    input: {
      message: {
        event: 'Wishlist Product Added to Cart',
        properties: {
          wishlist_id: '12345',
          wishlist_name: 'Games',
          product_id: '235564423234',
          sku: 'F-17',
          category: 'Games',
          name: 'Cards',
          brand: 'Imagepro',
          variant: '123',
          price: 8.99,
          quantity: 1,
          coupon: 'COUPON',
          position: 1,
          url: 'https://www.site.com/product/path',
          image_url: 'https://www.site.com/product/path.jpg',
        },
      },
    },
    output: {
      event: 'Wishlist_Product_Added_to_Cart',
      params: {
        brand: 'Imagepro',
        category: 'Games',
        coupon: 'COUPON',
        image_url: 'https://www.site.com/product/path.jpg',
        name: 'Cards',
        position: 1,
        product_id: '235564423234',
        price: 8.99,
        quantity: 1,
        send_to: 'G-123456',
        sku: 'F-17',
        url: 'https://www.site.com/product/path',
        variant: '123',
        wishlist_id: '12345',
        wishlist_name: 'Games',
      },
    },
  },
  {
    description: 'Product Shared event',
    input: {
      message: {
        event: 'Product Shared',
        properties: {
          share_via: 'SMS',
          share_message: 'Check this',
          recipient: 'name@friendsemail.com',
          product_id: '12345872254426',
          sku: 'F-13',
          category: 'Games',
          name: 'Cards',
          brand: 'Maples',
          variant: '150s',
          price: 15.99,
          url: 'https://www.myecommercewebsite.com/product/prod',
          image_url: 'https://www.myecommercewebsite.com/product/prod.jpg',
        },
      },
    },
    output: {
      event: 'share',
      params: {
        brand: 'Maples',
        category: 'Games',
        image_url: 'https://www.myecommercewebsite.com/product/prod.jpg',
        item_id: '12345872254426',
        method: 'SMS',
        name: 'Cards',
        price: 15.99,
        recipient: 'name@friendsemail.com',
        send_to: 'G-123456',
        share_message: 'Check this',
        url: 'https://www.myecommercewebsite.com/product/prod',
        variant: '150s',
      },
    },
  },
  {
    description: 'Cart Shared event',
    input: {
      message: {
        event: 'Cart Shared',
        properties: {
          share_via: 'SMS',
          share_message: 'Check this',
          recipient: 'friend@friendsemail.com',
          cart_id: '1234df2ddss',
          products: [{ product_id: '125' }, { product_id: '297' }],
        },
      },
    },
    output: {
      event: 'share',
      params: {
        item_id: '1234df2ddss',
        method: 'SMS',
        recipient: 'friend@friendsemail.com',
        send_to: 'G-123456',
        share_message: 'Check this',
      },
    },
  },
  {
    description: 'Product Reviewed event',
    input: {
      message: {
        event: 'Product Reviewed',
        properties: {
          product_id: '12345',
          review_id: 'review12',
          review_body: 'Good product, delivered in excellent condition',
          rating: '5',
          categories: {},
        },
      },
    },
    output: {
      event: 'Product_Reviewed',
      params: {
        product_id: '12345',
        rating: '5',
        review_body: 'Good product, delivered in excellent condition',
        review_id: 'review12',
        send_to: 'G-123456',
      },
    },
  },
  {
    description: 'Order Completed event with products as an object',
    input: {
      message: {
        event: 'Order Completed',
        properties: {
          checkout_id: '12345',
          order_id: '1234',
          affiliation: 'Apple Store',
          total: 20,
          revenue: 15.0,
          shipping: 4,
          tax: 1,
          discount: 1.5,
          coupon: 'ImagePro',
          currency: 'USD',
          users: [],
          products: {
            product_id: '123',
            sku: 'G-32',
            name: 'Monopoly',
            price: 14,
            rating: '',
            quantity: 1,
            category: 'Games',
            url: 'https://www.website.com/product/path',
            image_url: 'https://www.website.com/product/path.jpg',
          },
        },
      },
    },
    output: {
      event: 'purchase',
      params: {
        affiliation: 'Apple Store',
        checkout_id: '12345',
        coupon: 'ImagePro',
        currency: 'USD',
        discount: 1.5,
        items: [
          {
            image_url: 'https://www.website.com/product/path.jpg',
            item_category: 'Games',
            item_id: '123',
            item_name: 'Monopoly',
            price: 14,
            quantity: 1,
            sku: 'G-32',
            url: 'https://www.website.com/product/path',
          },
        ],
        send_to: 'G-123456',
        shipping: 4,
        tax: 1,
        transaction_id: '1234',
        value: 20,
      },
    },
  },
];

const pageEvents = [
  {
    description: 'page_view event with extendPageViewParams toggle disabled',
    input: {
      message: {
        channel: 'web',
        name: 'Contact Us',
        context: {
          app: {
            build: '1.0.0',
            name: 'RudderLabs JavaScript SDK',
            namespace: 'com.rudderlabs.javascript',
            version: '1.0.5',
          },
          ip: '0.0.0.0',
          library: {
            name: 'RudderLabs JavaScript SDK',
            version: '1.0.5',
          },
          locale: 'en-GB',
          screen: {
            density: 2,
          },
          traits: {
            email: 'abc@gmail.com',
          },
          page: {
            path: '/destinations/mixpanel',
            url: 'https://docs.rudderstack.com/destinations/mixpanel',
            category: 'destination',
            initial_referrer: 'https://docs.rudderstack.com',
            initial_referring_domain: 'docs.rudderstack.com',
          },
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
        },
        integrations: {
          All: true,
        },
        properties: {
          path: '/destinations/mixpanel',
          referrer: '$direct',
          title: 'Document',
          category: 'destination',
          initial_referrer: 'https://docs.rudderstack.com',
          initial_referring_domain: 'docs.rudderstack.com',
        },
        type: 'page',
        userId: 'user@10',
      },
      config: {
        measurementId: 'G-123456',
        extendPageViewParams: false,
        capturePageView: 'rs',
        piiPropertiesToIgnore: [{ piiProperty: '' }],
      }
    },
    output: {
      event: 'page_view',
      params: {
        page_location: 'https://docs.rudderstack.com/destinations/mixpanel',
        page_referrer: '$direct',
        page_title: 'Document',
        send_to: 'G-123456',
        user_id: 'user@10',
      },
    },
  },
  {
    description: 'page_view event with extendPageViewParams toggle enabled',
    input: {
      config: {
        measurementId: 'G-123456',
        extendPageViewParams: true,
        capturePageView: 'rs',
        piiPropertiesToIgnore: [{ piiProperty: '' }],
      },
      message: {
        channel: 'web',
        name: 'Contact Us',
        context: {
          app: {
            build: '1.0.0',
            name: 'RudderLabs JavaScript SDK',
            namespace: 'com.rudderlabs.javascript',
            version: '1.0.5',
          },
          ip: '0.0.0.0',
          library: {
            name: 'RudderLabs JavaScript SDK',
            version: '1.0.5',
          },
          locale: 'en-GB',
          screen: {
            density: 2,
          },
          traits: {
            email: 'abc@gmail.com',
          },
          page: {
            path: '/destinations/mixpanel',
            url: 'https://docs.rudderstack.com/destinations/mixpanel',
            category: 'destination',
            title: 'Document',
            initial_referrer: 'https://docs.rudderstack.com',
            initial_referring_domain: 'docs.rudderstack.com',
          },
          userAgent:
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36',
        },
        integrations: {
          All: true,
        },
        properties: {
          path: '/destinations/mixpanel',
          referrer: '$direct',
          category: 'destination',
          initial_referrer: 'https://docs.rudderstack.com',
          initial_referring_domain: 'docs.rudderstack.com',
        },
        type: 'page',
        userId: 'user@10',
      },
    },
    output: {
      event: 'page_view',
      params: {
        category: 'destination',
        initial_referrer: 'https://docs.rudderstack.com',
        initial_referring_domain: 'docs.rudderstack.com',
        page_location: 'https://docs.rudderstack.com/destinations/mixpanel',
        path: '/destinations/mixpanel',
        referrer: '$direct',
        page_referrer: '$direct',
        page_title: 'Document',
        send_to: 'G-123456',
        user_id: 'user@10',
      },
    },
  },
];

const groupEvents = [
  {
    description: 'Call with traits',
    input: {
      message: {
        userId: 'user@1',
        context: {
          library: {
            name: 'rudder-analytics-php',
            version: '2.0.1',
            consumer: 'LibCurl',
          },
        },
        traits: {
          companySize: 100,
          companyName: 'RudderStack',
        },
        type: 'group',
        groupId: 'group@1',
      },
    },
    output: {
      event: 'join_group',
      params: {
        companySize: 100,
        group_id: 'group@1',
        send_to: 'G-123456',
        companyName: 'RudderStack',
        user_id: 'user@1',
      },
    },
  },
];

export {
  mapping,
  pageEvents,
  groupEvents,
  trackEvents,
  identifyEvents,
  expectedItemsArray,
  inputProductsArray,
  outputProductsArray,
};
