import { isFunction } from '@rudderstack/analytics-js-common/utilities/checks';
import { getMutatedError } from '@rudderstack/analytics-js-common/utilities/errors';
/**
 * Utility to parse XHR JSON response
 */
const responseTextToJson = (responseText, onError) => {
  try {
    return JSON.parse(responseText || '');
  } catch (err) {
    const error = getMutatedError(err, 'Failed to parse response data');
    if (onError && isFunction(onError)) {
      onError(error);
    } else {
      throw error;
    }
  }
  return undefined;
};
export { responseTextToJson };
