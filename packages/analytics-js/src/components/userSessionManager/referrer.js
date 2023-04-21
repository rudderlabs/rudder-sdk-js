/**
 * Gets the URL of the location that referred the user to the current page.
 * @returns string
 */
const getReferrer = () => document.referrer || '$direct';

const getReferringDomain = referrer => {
  const split = referrer.split('/');
  if (split.length >= 3) {
    return split[2];
  }
  return '';
};

export { getReferrer, getReferringDomain };
