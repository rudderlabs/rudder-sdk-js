import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';

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
    const error = new Error(`Response data parsing failed, ${(err as Error).message}`);
    if (onError && isFunction(onError)) {
      onError(error);
    } else {
      throw error;
    }
  }

  return undefined;
};

export { responseTextToJson };
