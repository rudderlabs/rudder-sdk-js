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

export { getTimezone };
