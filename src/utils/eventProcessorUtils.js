import logger from './logUtil';
import { mergeDeepRight } from './ObjectUtils';

const defaultTopLevelElements = ['integrations', 'anonymousId', 'originalTimestamp'];

const mergeTopLevelElementsMutator = (rudderElementMessage, options = {}) => {
  if (typeof options !== 'object' || options === null) {
    return;
  }

  Object.keys(options).forEach((key) => {
    if (defaultTopLevelElements.includes(key)) {
      // eslint-disable-next-line no-param-reassign
      rudderElementMessage[key] = options[key];
    }
  });
};

const mergeContext = (rudderElementMessage, options = {}) => {
  let { context } = rudderElementMessage;

  if (typeof options !== 'object' || options === null) {
    return context;
  }

  Object.keys(options).forEach((key) => {
    if (!defaultTopLevelElements.includes(key)) {
      if (key !== 'context') {
        if (key !== "library") {
          context = mergeDeepRight(context, {
            [key]: options[key],
          });
        }
      } else if (typeof options[key] === 'object' && options[key] !== null) {
        let tempContext = {};
        Object.keys(options[key]).forEach((e) => {
            if (e !== "library") {
              tempContext[e] = options[key][e];
            }
        });
        context = mergeDeepRight(context, {
          ...tempContext,
        });
      } else {
        logger.error(
          `[Analytics: processOptionsParam] context passed in options ${key} is not object.`,
        );
      }
    }
  });
  return context;
};

export { mergeContext, mergeTopLevelElementsMutator };
