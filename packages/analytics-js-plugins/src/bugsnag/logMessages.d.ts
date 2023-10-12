declare const BUGSNAG_API_KEY_VALIDATION_ERROR: (apiKey: string) => string;
declare const BUGSNAG_SDK_LOAD_TIMEOUT_ERROR: (timeout: number) => string;
declare const BUGSNAG_SDK_LOAD_ERROR: (context: string) => string;
export { BUGSNAG_API_KEY_VALIDATION_ERROR, BUGSNAG_SDK_LOAD_TIMEOUT_ERROR, BUGSNAG_SDK_LOAD_ERROR };
