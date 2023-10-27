import type { ResponseDetails } from '../types/HttpClient';

const isErrRetryable = (details?: ResponseDetails) => {
  let isRetryableNWFailure = false;
  if (details?.error && details?.xhr) {
    const xhrStatus = details.xhr.status;
    // same as in v1.1
    isRetryableNWFailure = xhrStatus === 429 || (xhrStatus >= 500 && xhrStatus < 600);
  }
  return isRetryableNWFailure;
};

export { isErrRetryable };
