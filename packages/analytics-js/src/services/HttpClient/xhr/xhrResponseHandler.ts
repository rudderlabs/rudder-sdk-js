import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import { getMutatedError } from '@rudderstack/analytics-js/components/utilities/errors';

/**
 * Utility to parse XHR JSON response
 */
const responseTextToJson = <T = any>(
  responseText?: string,
  onError?: (message: Error | unknown) => void,
): T | undefined => {
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
