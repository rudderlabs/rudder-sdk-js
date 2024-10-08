import type { ResponseDetails } from '../types/HttpClient';

const isErrRetryable = (details: ResponseDetails) => {
  const status = details.error?.status ?? 0;
  return status === 429 || (status >= 500 && status < 600);
};

export { isErrRetryable };
