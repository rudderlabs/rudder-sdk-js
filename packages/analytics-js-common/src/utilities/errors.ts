import { isTypeOfError } from './checks';
import { stringifyWithoutCircular } from './json';

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
    finalError = new Error(`${issue}: ${stringifyWithoutCircular(err as Record<string, any>)}`);
  } else {
    (finalError as Error).message = `${issue}: ${err.message}`;
  }
  return finalError;
};

const dispatchErrorEvent = (error: any) => {
  if (isTypeOfError(error)) {
    error.stack = `${error.stack ?? ''}\n${MANUAL_ERROR_IDENTIFIER}`;
  }
  (globalThis as typeof window).dispatchEvent(new ErrorEvent('error', { error }));
};

const getStacktrace = (err: any): string | undefined => {
  const { stack, stacktrace } = err;
  const operaSourceloc = err['opera#sourceloc'];

  const stackString = stack ?? stacktrace ?? operaSourceloc;

  if (!!stackString && typeof stackString === 'string') {
    return stackString;
  }
  return undefined;
};

export { getMutatedError, dispatchErrorEvent, MANUAL_ERROR_IDENTIFIER, getStacktrace };
