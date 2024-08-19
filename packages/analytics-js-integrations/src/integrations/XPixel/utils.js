import {
  trackPropertyMapping,
  DISPLAY_NAME,
} from '@rudderstack/analytics-js-common/constants/integrations/XPixel/constants';
import { removeUndefinedAndNullValues } from '../../utils/commonUtils';
import { constructPayload } from '../../utils/utils';
import Logger from '../../utils/logger';

const logger = new Logger(DISPLAY_NAME);

const getContents = message => {
  let contents = [];
  const { properties } = message;
  const { products } = properties;
  if (Array.isArray(products)) {
    contents = products.map(product => {
      const singleProduct = {
        content_type: product.contentType || product.content_type || 'product',
        content_id: product.product_id,
        content_name: product.name,
        price: product.price,
        num_items: product.quantity,
        group_id: product.groupId || product.group_id,
      };
      return removeUndefinedAndNullValues(singleProduct);
    });
  } else {
    return [];
  }
  return contents;
};

const getTrackResponse = message => {
  let properties = constructPayload(message, trackPropertyMapping); // constructing properties

  // if contents is not an array
  if (properties?.contents && !Array.isArray(properties.contents)) {
    properties.contents = [properties.contents];
  }

  if (message.properties?.products && (!properties || (properties && !properties?.contents))) {
    // retreiving data from products only when contents is not present

    properties = {
      ...properties,
      contents: getContents(message),
    };
  }

  return removeUndefinedAndNullValues(properties);
};

const sendEvent = (event, properties, standardEventsMap) => {
  const eventIds = standardEventsMap[event?.toLowerCase()];
  if (Array.isArray(eventIds)) {
    eventIds.forEach(eventId => {
      window.twq('event', eventId, properties);
    });
  } else {
    logger.error(`Event name (${event}) is not valid, must be mapped to atleast one Event ID`);
  }
};

export { getTrackResponse, sendEvent };
