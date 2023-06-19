import { del } from 'obj-case';
import { LOAD_ORIGIN } from '../../utils/ScriptLoader';
import { BrazeOperationString } from './constants';

/** https://js.appboycdn.com/web-sdk/latest/doc/ab.User.html#toc4
 */
const formatGender = (gender) => {
  if (typeof gender !== 'string') return undefined;
  const femaleGenders = ['woman', 'female', 'w', 'f'];
  const maleGenders = ['man', 'male', 'm'];
  const otherGenders = ['other', 'o'];

  if (femaleGenders.indexOf(gender.toLowerCase()) > -1) return window.braze.User.Genders.FEMALE;
  if (maleGenders.includes(gender.toLowerCase()) > -1) return window.braze.User.Genders.MALE;
  if (otherGenders.includes(gender.toLowerCase()) > -1) return window.braze.User.Genders.OTHER;
  return undefined;
};

const handleReservedProperties = (props) => {
  // remove reserved keys from custom event properties
  // https://www.appboy.com/documentation/Platform_Wide/#reserved-keys
  const reserved = ['time', 'product_id', 'quantity', 'event_name', 'price', 'currency'];

  reserved.forEach((element) => {
    // eslint-disable-next-line no-param-reassign
    delete props[element];
  });
  return props;
};

const handlePurchase = (properties, userId) => {
  const { products, currency } = properties;
  const currencyCode = currency;

  window.braze.changeUser(userId);

  // del used properties
  del(properties, 'products');
  del(properties, 'currency');

  // we have to make a separate call to appboy for each product
  if (products && Array.isArray(products) && products.length > 0) {
    products.forEach((product) => {
      const productId = product.product_id;
      const { price } = product;
      const { quantity } = product;
      if (quantity && price && productId)
        window.braze.logPurchase(productId, price, currencyCode, quantity, properties);
    });
  }
};

const loadBraze = () => {
  // START-NO-SONAR-SCAN
  // load braze
  /* eslint-disable */
  +(function (a, p, P, b, y) {
    a.braze = {};
    a.brazeQueue = [];
    for (let s = BrazeOperationString.split(' '), i = 0; i < s.length; i++) {
      for (var m = s[i], k = a.braze, l = m.split('.'), j = 0; j < l.length - 1; j++) k = k[l[j]];
      k[l[j]] = new Function(
        `return function ${m.replace(
          /\./g,
          '_',
        )}(){window.brazeQueue.push(arguments); return true}`,
      )();
    }
    window.braze.getCachedContentCards = function () {
      return new window.braze.ContentCards();
    };
    window.braze.getCachedFeed = function () {
      return new window.braze.Feed();
    };
    window.braze.getUser = function () {
      return new window.braze.User();
    };
    (y = p.createElement(P)).type = 'text/javascript';
    y.src = 'https://js.appboycdn.com/web-sdk/4.2/braze.min.js';
    y.async = 1;
    y.setAttribute('data-loader', LOAD_ORIGIN);
    (b = p.getElementsByTagName(P)[0]).parentNode.insertBefore(y, b);
  })(window, document, 'script');
  /* eslint-enable */
  // END-NO-SONAR-SCAN
};

export { formatGender, handleReservedProperties, handlePurchase, loadBraze };
