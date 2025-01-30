import { getMutatedError } from '@rudderstack/analytics-js-common/utilities/errors';

/**
 * Utility to parse XHR JSON response
 */
const responseTextToJson = <T = any>(
  responseText: string,
  onError: (message: unknown) => void,
): T | undefined => {
  try {
    return JSON.parse(responseText || '');
  } catch (err) {
    const error = getMutatedError(err, 'Failed to parse response data');
    onError(error);
  }

  return undefined;
};

export { responseTextToJson };
