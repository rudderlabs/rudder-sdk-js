import { constructPayload } from '../../utils/utils';
import { PARTNER_NAME, trackMapping } from './constants';
import { removeUndefinedAndNullValues } from '../utils/commonUtils';

const getContents = (message) => {
    const contents = [];
    const { properties } = message;
    // eslint-disable-next-line camelcase
    const { products, content_type, contentType } = properties;
    if (products && Array.isArray(products) && products.length > 0) {
        products.forEach((product) => {
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
            contents.push(removeUndefinedAndNullValues(singleProduct));
        });
    }
    return contents;
};

const checkContentType = (contents, contentType) => {
    if (Array.isArray(contents)) {
        contents.forEach((content) => {
            if (!content.content_type) {
                // eslint-disable-next-line no-param-reassign
                content.content_type = contentType || 'product_group';
            }
        });
    }
    return contents;
};
const getTrackResponse = (message) => {
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
        properties.contents = checkContentType(
            properties?.contents,
            message.properties?.contentType,
        );
    }
    // add partner name
    return removeUndefinedAndNullValues({
        ...properties,
        partner_name: PARTNER_NAME,
    });
};
export { getTrackResponse }