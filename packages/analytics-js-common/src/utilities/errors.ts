import { isTypeOfError } from './checks';
import { stringifyWithoutCircular } from './json';

const MANUAL_ERROR_IDENTIFIER = '[SDK DISPATCHED ERROR]';

const getStacktrace = (err: any): string | undefined => {
  const { stack, stacktrace } = err;
  const operaSourceloc = err['opera#sourceloc'];

  const stackString = stack ?? stacktrace ?? operaSourceloc;

  if (!!stackString && typeof stackString === 'string') {
    return stackString;
  }
  return undefined;
};

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
    const errStack = getStacktrace(error);
    if (errStack) {
      const { stack, stacktrace } = error;
      const operaSourceloc = error['opera#sourceloc'];

      switch (errStack) {
        case stack:
          // eslint-disable-next-line no-param-reassign
          error.stack = `${stack}\n${MANUAL_ERROR_IDENTIFIER}`;
          break;
        case stacktrace:
          // eslint-disable-next-line no-param-reassign
          error.stacktrace = `${stacktrace}\n${MANUAL_ERROR_IDENTIFIER}`;
          break;
        case operaSourceloc:
        default:
          // eslint-disable-next-line no-param-reassign
          error['opera#sourceloc'] = `${operaSourceloc}\n${MANUAL_ERROR_IDENTIFIER}`;
          break;
      }
    }
  }

  (globalThis as typeof window).dispatchEvent(
    new ErrorEvent('error', { error, bubbles: true, cancelable: true, composed: true }),
  );
};

export { getMutatedError, dispatchErrorEvent, MANUAL_ERROR_IDENTIFIER, getStacktrace };
