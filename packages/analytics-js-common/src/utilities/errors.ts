import { isTypeOfError } from './checks';
import { stringifyData } from './json';

const MANUAL_ERROR_IDENTIFIER = '[MANUAL ERROR]';

/**
 * Get mutated error with issue prepended to error message
 * @param err Original error
 * @param issue Issue to prepend to error message
 * @returns Instance of Error with message prepended with issue
 */
const getMutatedError = (err: any, issue: string): Error => {
  let finalError = err;
  if (!isTypeOfError(err)) {
    finalError = new Error(`${issue}: ${stringifyData(err as Record<string, any>)}`);
  } else {
    (finalError as Error).message = `${issue}: ${err.message}`;
  }
  return finalError;
};

const dispatchErrorEvent = (error: any) => {
  if (isTypeOfError(error)) {
    error.stack += `\n${MANUAL_ERROR_IDENTIFIER}`;
  }
  (globalThis as typeof window).dispatchEvent(new ErrorEvent('error', { error }));
};

export { getMutatedError, dispatchErrorEvent, MANUAL_ERROR_IDENTIFIER };
