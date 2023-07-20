import { isTypeOfError } from './checks';
import { stringifyWithoutCircular } from './json';
/**
 * Get mutated error with issue prepended to error message
 * @param err Original error
 * @param issue Issue to prepend to error message
 * @returns Instance of Error with message prepended with issue
 */
const getMutatedError = (err, issue) => {
  let finalError = err;
  if (!isTypeOfError(err)) {
    finalError = new Error(`${issue}: ${stringifyWithoutCircular(err)}`);
  } else {
    finalError.message = `${issue}: ${err.message}`;
  }
  return finalError;
};
export { getMutatedError };
