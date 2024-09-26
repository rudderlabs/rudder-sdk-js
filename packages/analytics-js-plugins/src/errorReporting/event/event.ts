import type { ErrorState } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import ErrorStackParser from 'error-stack-parser';
import type { Exception, Stackframe } from '@rudderstack/analytics-js-common/types/Metrics';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import type { FrameType, IErrorFormat } from '../types';
import { hasStack, isError } from './utils';
import { ERROR_REPORTING_PLUGIN } from '../constants';

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

const normaliseError = (maybeError: any, component: string, logger?: ILogger) => {
  let error;

  if (isError(maybeError)) {
    error = maybeError;
  } else {
    logger?.warn(
      `${ERROR_REPORTING_PLUGIN}:: ${component} received a non-error: ${stringifyWithoutCircular(error)}`,
    );
    error = undefined;
  }

  if (error && !hasStack(error)) {
    error = undefined;
  }

  return [error, 0];
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
    const [error, internalFrames] = normaliseError(maybeError, component, logger);
    if (!error) {
      return undefined;
    }
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
