import { isTypeOfError } from './checks';
import { stringifyWithoutCircular } from './json';

/**
 * Get mutated error with issue prepended to error message
 * @param err Original error
 * @param issue Issue to prepend to error message
 * @returns Instance of Error with message prepended with issue
 */
const getMutatedError = (err: any, issue: string): Error => {
  let finalError = err;
  if (isTypeOfError(err)) {
    (finalError as Error).message = `${issue}: ${err.message}`;
  } else {
    finalError = new Error(`${issue}: ${stringifyWithoutCircular(err as Record<string, any>)}`);
  }
  return finalError;
};

export { getMutatedError };
