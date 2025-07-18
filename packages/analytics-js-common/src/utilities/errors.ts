import { isTypeOfError } from './checks';
import { stringifyWithoutCircular } from './json';

const MANUAL_ERROR_IDENTIFIER = '[SDK DISPATCHED ERROR]';

const getStacktrace = (err: any): string | undefined => {
  const { stack, stacktrace, 'opera#sourceloc': operaSourceloc } = err;
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
  if (!isTypeOfError(err)) {
    return new Error(`${issue}: ${stringifyWithoutCircular(err as Record<string, any>)}`);
  }

  try {
    // Preserve the specific error type (TypeError, ReferenceError, etc.)
    const ErrorConstructor = err.constructor as ErrorConstructor;
    const newError = new ErrorConstructor(`${issue}: ${err.message}`);

    // Preserve stack trace
    const stack = getStacktrace(err);
    if (stack) {
      newError.stack = stack;
    }

    // Preserve any other enumerable properties
    Object.getOwnPropertyNames(err).forEach(key => {
      if (key !== 'message' && key !== 'stack' && key !== 'name') {
        try {
          (newError as any)[key] = err[key];
        } catch {
          // Ignore if property is not writable
        }
      }
    });

    return newError;
  } catch {
    return new Error(`${issue}: ${stringifyWithoutCircular(err as Record<string, any>)}`);
  }
};

const dispatchErrorEvent = (error: any) => {
  if (isTypeOfError(error)) {
    const errStack = getStacktrace(error);
    if (errStack) {
      const { stack, stacktrace, 'opera#sourceloc': operaSourceloc } = error;

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
