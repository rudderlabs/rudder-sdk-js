import type { IResponseDetails } from '../types/HttpClient';

const isErrRetryable = (details: IResponseDetails) => {
  const status = details.error?.status || 0;
  return status === 429 || (status >= 500 && status < 600);
};

export { isErrRetryable };
