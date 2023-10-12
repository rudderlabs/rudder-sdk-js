/**
 * Utility to parse XHR JSON response
 */
declare const responseTextToJson: <T = any>(
  responseText?: string,
  onError?: ((message: Error | unknown) => void) | undefined,
) => T | undefined;
export { responseTextToJson };
