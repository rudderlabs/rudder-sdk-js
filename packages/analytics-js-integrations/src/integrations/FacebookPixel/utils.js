import get from 'get-value';
import logger from '@rudderstack/common/v1.1/utils/logUtil';

function getEventId(message) {
  return (
    get(message, 'traits.event_id') ||
    get(message, 'context.traits.event_id') ||
    get(message, 'properties.event_id') ||
    message.messageId
  );
}

/**
 * This method gets content category
 *
 * @param {*} category
 * @returns The content category as a string
 */
const getContentCategory = category => {
  let contentCategory = category;
  if (Array.isArray(contentCategory)) {
    contentCategory = contentCategory.map(String).join(',');
  }
  if (
    contentCategory &&
    typeof contentCategory !== 'string' &&
    typeof contentCategory !== 'object'
  ) {
    contentCategory = String(contentCategory);
  }
  if (
    contentCategory &&
    typeof contentCategory !== 'string' &&
    !Array.isArray(contentCategory) &&
    typeof contentCategory === 'object'
  ) {
    logger.error("'properties.category' must be either be a string or an array");
    return;
  }
  // eslint-disable-next-line consistent-return
  return contentCategory;
};

export { getEventId, getContentCategory };
