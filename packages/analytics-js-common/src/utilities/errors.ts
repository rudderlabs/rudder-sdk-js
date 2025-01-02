import { isTypeOfError } from './checks';
import { stringifyWithoutCircular } from './json';

const MANUAL_ERROR_IDENTIFIER = '[MANUALLY DISPATCHED ERROR]';

const hasStack = (err: any) =>
  !!err &&
  (!!err.stack || !!err.stacktrace || !!err['opera#sourceloc']) &&
  typeof (err.stack || err.stacktrace || err['opera#sourceloc']) === 'string' &&
  err.stack !== `${err.name}: ${err.message}`;

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
  if (isTypeOfError(error) && hasStack(error)) {
    let stack = error.stack ?? error.stacktrace ?? error['opera#sourceloc'] ?? '';
    stack = `${stack}\n${MANUAL_ERROR_IDENTIFIER}`;
    // eslint-disable-next-line no-param-reassign
    error.stack = stack;
  }
  (globalThis as typeof window).dispatchEvent(new ErrorEvent('error', { error }));
};

export { getMutatedError, dispatchErrorEvent, MANUAL_ERROR_IDENTIFIER, hasStack };
