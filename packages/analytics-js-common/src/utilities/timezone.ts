/**
 * To get the timezone of the user
 *
 * @returns string
 */
const getTimezone = (): string => {
  // Not susceptible to super-linear backtracking
  // eslint-disable-next-line sonarjs/slow-regex
  const timezone = /([A-Z]+[+-]\d+)/.exec(new Date().toString());
  return timezone?.[1] ? timezone[1] : 'NA';
};

export { getTimezone };
