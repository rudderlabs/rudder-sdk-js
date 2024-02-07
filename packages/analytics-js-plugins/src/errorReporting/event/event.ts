import type { ErrorState } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import ErrorStackParser from 'error-stack-parser';
import type { Exception, Stackframe } from '@rudderstack/analytics-js-common/types/Metrics';
import type { FrameType, IErrorFormat } from '../types';
import { hasStack, isError } from '../utils';

const normaliseFunctionName = (name: string) =>
  /^global code$/i.test(name) ? 'global code' : name;

// takes a stacktrace.js style stackframe (https://github.com/stacktracejs/stackframe)
// and returns a Bugsnag compatible stackframe (https://docs.bugsnag.com/api/error-reporting/#json-payload)
const formatStackframe = (frame: FrameType): Stackframe => {
  const f = {
    file: frame.fileName,
    method: normaliseFunctionName(frame.functionName),
    lineNumber: frame.lineNumber,
    columnNumber: frame.columnNumber,
    code: undefined,
    inProject: undefined,
  };
  // Some instances result in no file:
  // - calling notify() from chrome's terminal results in no file/method.
  // - non-error exception thrown from global code in FF
  // This adds one.
  if (f.lineNumber > -1 && !f.file && !f.method) {
    f.file = 'global code';
  }
  return f;
};

const ensureString = (str: any) => (typeof str === 'string' ? str : '');

function createBugsnagError(
  errorClass: string,
  errorMessage: string,
  stacktrace: any[],
): Exception {
  return {
    errorClass: ensureString(errorClass),
    message: ensureString(errorMessage),
    type: 'browserjs',
    stacktrace: stacktrace.reduce((accum: Stackframe[], frame: FrameType) => {
      const f = formatStackframe(frame);
      // don't include a stackframe if none of its properties are defined
      try {
        if (JSON.stringify(f) === '{}') return accum;
        return accum.concat(f);
      } catch (e) {
        return accum;
      }
    }, []),
  };
}

// Helpers

const getStacktrace = (error: any, errorFramesToSkip: number) => {
  if (hasStack(error)) return ErrorStackParser.parse(error).slice(errorFramesToSkip);
  return [];
};

const hasNecessaryFields = (error: any) =>
  (typeof error.name === 'string' || typeof error.errorClass === 'string') &&
  (typeof error.message === 'string' || typeof error.errorMessage === 'string');

const normaliseError = (
  maybeError: any,
  tolerateNonErrors: boolean,
  component: string,
  logger?: ILogger,
) => {
  let error;
  let internalFrames = 0;

  const createAndLogInputError = (reason: string) => {
    const verb = component === 'error cause' ? 'was' : 'received';
    if (logger) logger.warn(`${component} ${verb} a non-error: "${reason}"`);
    const err = new Error(
      `${component} ${verb} a non-error. See "${component}" tab for more detail.`,
    );
    err.name = 'InvalidError';
    return err;
  };

  // In some cases:
  //
  //  - the promise rejection handler (both in the browser and node)
  //  - the node uncaughtException handler
  //
  // We are really limited in what we can do to get a stacktrace. So we use the
  // tolerateNonErrors option to ensure that the resulting error communicates as
  // such.
  if (!tolerateNonErrors) {
    if (isError(maybeError)) {
      error = maybeError;
    } else {
      error = createAndLogInputError(typeof maybeError);
      internalFrames += 2;
    }
  } else {
    switch (typeof maybeError) {
      case 'string':
      case 'number':
      case 'boolean':
        error = new Error(String(maybeError));
        internalFrames += 1;
        break;
      case 'function':
        error = createAndLogInputError('function');
        internalFrames += 2;
        break;
      case 'object':
        if (maybeError !== null && isError(maybeError)) {
          error = maybeError;
        } else if (maybeError !== null && hasNecessaryFields(maybeError)) {
          error = new Error(maybeError.message || maybeError.errorMessage);
          error.name = maybeError.name || maybeError.errorClass;
          internalFrames += 1;
        } else {
          error = createAndLogInputError(maybeError === null ? 'null' : 'unsupported object');
          internalFrames += 2;
        }
        break;
      default:
        error = createAndLogInputError('nothing');
        internalFrames += 2;
    }
  }

  if (!hasStack(error)) {
    // in IE10/11 a new Error() doesn't have a stacktrace until you throw it, so try that here
    try {
      throw error;
    } catch (e) {
      if (hasStack(e)) {
        error = e;
        // if the error only got a stacktrace after we threw it here, we know it
        // will only have one extra internal frame from this function, regardless
        // of whether it went through createAndLogInputError() or not
        internalFrames = 1;
      }
    }
  }

  return [error, internalFrames];
};

class ErrorFormat implements IErrorFormat {
  errors: Exception[];

  constructor(errorClass: string, errorMessage: string, stacktrace: any[]) {
    this.errors = [createBugsnagError(errorClass, errorMessage, stacktrace)];
  }
  static create(
    maybeError: any,
    tolerateNonErrors: boolean,
    handledState: ErrorState,
    component: string,
    errorFramesToSkip = 0,
    logger?: ILogger,
  ) {
    const [error, internalFrames] = normaliseError(
      maybeError,
      tolerateNonErrors,
      component,
      logger,
    );
    let event;
    try {
      const stacktrace = getStacktrace(
        error,
        // if an error was created/throw in the normaliseError() function, we need to
        // tell the getStacktrace() function to skip the number of frames we know will
        // be from our own functions. This is added to the number of frames deep we
        // were told about
        internalFrames > 0 ? 1 + internalFrames + errorFramesToSkip : 0,
      );
      event = new ErrorFormat(error.name, error.message, stacktrace);
    } catch (e) {
      event = new ErrorFormat(error.name, error.message, []);
    }

    return event;
  }
}

export { ErrorFormat };
