/**
 * Gets the URL of the location that referred the user to the current page.
 * @returns string
 */
const getReferrer = () => document.referrer || '$direct';

export { getReferrer };
