import type { IResponseDetails } from '../types/HttpClient';

const isErrRetryable = (details: IResponseDetails) => {
  let isRetryableNWFailure = false;
  if (details.error?.status) {
    const { status } = details.error;
    // same as in v1.1
    isRetryableNWFailure = status === 429 || (status >= 500 && status < 600);
  }
  return isRetryableNWFailure;
};

export { isErrRetryable };
