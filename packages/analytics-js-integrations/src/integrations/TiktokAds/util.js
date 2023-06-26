import { constructPayload } from '../../utils/utils';
import { PARTNER_NAME, trackMapping } from './constants';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';

const getContents = message => {
  let contents = [];
  const { properties } = message;
  // eslint-disable-next-line camelcase
  const { products, content_type, contentType } = properties;
  if (Array.isArray(products)) {
    contents = products.map(product => {
      const singleProduct = {
        content_type:
          // eslint-disable-next-line camelcase
          product.contentType || contentType || product.content_type || content_type || 'product',
        content_id: product.product_id,
        content_category: product.category,
        content_name: product.name,
        price: product.price,
        quantity: product.quantity,
        description: product.description,
      };
      return removeUndefinedAndNullValues(singleProduct);
    });
  }
  return contents;
};

const checkContentType = (contents, contentType) => {
  let transformedContents = contents;
  if (Array.isArray(contents)) {
    transformedContents = contents.map(content => {
      const transformedContent = { ...content };
      if (!content.content_type) {
        transformedContent.content_type = contentType || 'product_group';
      }
      return transformedContent;
    });
  }
  return transformedContents;
};
const getTrackResponse = message => {
  let properties = constructPayload(message, trackMapping); // constructing properties

  // if contents is not an array
  if (properties?.contents && !Array.isArray(properties.contents)) {
    properties.contents = [properties.contents];
  }

  if (properties && !properties?.contents && message.properties?.products) {
    // retreiving data from products only when contents is not present
    properties = {
      ...properties,
      contents: getContents(message),
    };
  }

  if (properties?.contents) {
    properties.contents = checkContentType(properties?.contents, message.properties?.contentType);
  }
  // add partner name
  return removeUndefinedAndNullValues({
    ...properties,
    partner_name: PARTNER_NAME,
  });
};
export { getTrackResponse };
