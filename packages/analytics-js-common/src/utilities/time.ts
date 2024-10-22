/**
 * Asynchronously wait for the given time
 * @param delay The time to wait in milliseconds
 * @returns A promise that resolves after the given time
 */
const wait = (delay: number) =>
  new Promise(resolve => {
    (globalThis as typeof window).setTimeout(resolve, delay);
  });

/**
 * To get the current timestamp in ISO string format
 * @returns ISO formatted timestamp string
 */
const getCurrentTimeFormatted = (): string => new Date().toISOString();

/**
 * To get the timezone of the user
 *
 * @returns string
 */
const getTimezone = (): string => {
  // Not susceptible to super-linear backtracking
  // eslint-disable-next-line sonarjs/slow-regex
  const regexMatchValues = /([A-Z]+[+-]\d+)/.exec(new Date().toString());
  return regexMatchValues?.[1] ? regexMatchValues[1] : 'NA';
};

export { wait, getCurrentTimeFormatted, getTimezone };
