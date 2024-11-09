/**
 * Asynchronously wait for the given time
 * @param delay The time to wait in milliseconds
 * @returns A promise that resolves after the given time
 */
const wait = (delay: number): Promise<void> =>
  new Promise(resolve => {
    (globalThis as typeof window).setTimeout(resolve, delay);
  });

const getFormattedTimestamp = (date: Date): string => date.toISOString();

/**
 * To get the current timestamp in ISO string format
 * @returns ISO formatted timestamp string
 */
const getCurrentTimeFormatted = (): string => getFormattedTimestamp(new Date());

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

export { wait, getCurrentTimeFormatted, getTimezone, getFormattedTimestamp };
