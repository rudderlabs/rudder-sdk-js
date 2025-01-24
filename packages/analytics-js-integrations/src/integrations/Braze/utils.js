import { del } from 'obj-case';

/** https://js.appboycdn.com/web-sdk/latest/doc/ab.User.html#toc4
 */
const formatGender = gender => {
  if (typeof gender !== 'string') return undefined;
  const femaleGenders = ['woman', 'female', 'w', 'f'];
  const maleGenders = ['man', 'male', 'm'];
  const otherGenders = ['other', 'o'];

  if (femaleGenders.indexOf(gender.toLowerCase()) > -1) return window.braze.User.Genders.FEMALE;
  if (maleGenders.includes(gender.toLowerCase()) > -1) return window.braze.User.Genders.MALE;
  if (otherGenders.includes(gender.toLowerCase()) > -1) return window.braze.User.Genders.OTHER;
  return undefined;
};

const handleReservedProperties = props => {
  // remove reserved keys from custom event properties
  // https://www.appboy.com/documentation/Platform_Wide/#reserved-keys
  const reserved = ['time', 'product_id', 'quantity', 'event_name', 'price', 'currency'];

  reserved.forEach(element => {
    // eslint-disable-next-line no-param-reassign
    delete props[element];
  });
  return props;
};

const handlePurchase = properties => {
  const { products, currency } = properties;
  const currencyCode = currency;

  // del used properties
  del(properties, 'products');
  del(properties, 'currency');

  // we have to make a separate call to appboy for each product
  if (products && Array.isArray(products) && products.length > 0) {
    products.forEach(product => {
      const productId = product.product_id;
      const { price } = product;
      const { quantity } = product;
      if (quantity && price && productId)
        window.braze.logPurchase(productId, price, currencyCode, quantity, properties);
    });
  }
};

export { formatGender, handleReservedProperties, handlePurchase };
