import logger from './logUtil';
import { mergeDeepRight } from './ObjectUtils';

const defaultTopLevelElements = ['integrations', 'anonymousId', 'originalTimestamp'];

const mergeTopLevelElementsMutator = (rudderElementMessage, options) => {
  Object.keys(options).forEach((key) => {
    if (defaultTopLevelElements.includes(key)) {
      rudderElementMessage[key] = options[key];
    }
  });
};

const mergeContext = (rudderElementMessage, options) => {
  let { context } = rudderElementMessage;

  Object.keys(options).forEach((key) => {
    if (!defaultTopLevelElements.includes(key)) {
      if (key !== 'context') {
        context = mergeDeepRight(context, {
          [key]: options[key],
        });
      } else if (typeof options[key] === 'object' && options[key] !== null) {
        context = mergeDeepRight(context, {
          ...options[key],
        });
      } else {
        logger.error('[Analytics: processOptionsParam] context passed in options is not object');
      }
    }
  });
  return context;
};

export { mergeContext, mergeTopLevelElementsMutator };
