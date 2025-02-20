/**
 * This function is used to determine if the input status code is retryable.
 * @param status - The status code.
 * @returns True if the status code is not 4xx (except 429), false otherwise.
 */
const isErrRetryable = (status: number) => {
  if (status === 429) {
    return true;
  }

  return !(status >= 400 && status < 500);
};

export { isErrRetryable };
