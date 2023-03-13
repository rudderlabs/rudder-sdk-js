import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';

const responseTextToJson = <T = any>(
  responseText?: string,
  onError?: (message: Error | unknown) => void,
): T | undefined => {
  if (!responseText) {
    const err = new Error(`Response data parsing failed, no responseText`);
    if (onError && isFunction(onError)) {
      onError(err);
    } else {
      throw err;
    }
  }

  try {
    return JSON.parse(responseText as string);
  } catch (err) {
    if (onError && isFunction(onError)) {
      onError(err);
    } else {
      throw err;
    }
  }

  return undefined;
};

export { responseTextToJson };
