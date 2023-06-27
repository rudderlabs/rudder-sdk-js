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

const productsArrayInput = [
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
    currency: 'INR',
    product_id: '345',
    sku: 'G-32',
    name: 'UNO',
    price: 3.99,
    position: 2,
    category: 'Games',
  },
];

const productsArrayOutput = [
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

export { mapping, expectedItemsArray, productsArrayInput, productsArrayOutput };
