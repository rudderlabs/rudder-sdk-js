import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import ErrorStackParser from 'error-stack-parser';
import type { Exception } from '@rudderstack/analytics-js-common/types/Metrics';
import { ERROR_HANDLER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import {
  isDefined,
  isString,
  isTypeOfError,
} from '@rudderstack/analytics-js-common/utilities/checks';
import { getStacktrace } from '@rudderstack/analytics-js-common/utilities/errors';
import type { Stackframe } from '@bugsnag/js';
import { NON_ERROR_WARNING } from '../../../constants/logMessages';

const GLOBAL_CODE = 'global code';

const normalizeFunctionName = (name: string | undefined) => {
  if (isDefined(name)) {
    return /^global code$/i.test(name as string) ? GLOBAL_CODE : name;
  }

  return name;
};

/**
 * Takes a stacktrace.js style stackframe (https://github.com/stacktracejs/stackframe)
 * and returns a Bugsnag compatible stackframe (https://docs.bugsnag.com/api/error-reporting/#json-payload)
 * @param frame
 * @returns
 */
const formatStackframe = (frame: ErrorStackParser.StackFrame): Stackframe => {
  const f = {
    file: frame.fileName as string,
    method: normalizeFunctionName(frame.functionName),
    lineNumber: frame.lineNumber,
    columnNumber: frame.columnNumber,
  };
  // Some instances result in no file:
  // - non-error exception thrown from global code in FF
  // This adds one.
  if (f.lineNumber && f.lineNumber > -1 && !f.file && !f.method) {
    f.file = GLOBAL_CODE;
  }
  return f;
};

const ensureString = (str: any) => (isString(str) ? str : '');

function createException(
  errorClass: string,
  errorMessage: string,
  msgPrefix: string,
  stacktrace: ErrorStackParser.StackFrame[],
): Exception {
  return {
    errorClass: ensureString(errorClass),
    message: `${msgPrefix}${ensureString(errorMessage)}`,
    type: 'browserjs',
    stacktrace: stacktrace.reduce((accum: Stackframe[], frame: ErrorStackParser.StackFrame) => {
      const f = formatStackframe(frame);
      // don't include a stackframe if none of its properties are defined
      try {
        if (JSON.stringify(f) === '{}') return accum;
        return accum.concat(f);
      } catch {
        return accum;
      }
    }, []),
  };
}

const normalizeError = (maybeError: any, logger: ILogger): any => {
  let error;

  if (isTypeOfError(maybeError) && isString(getStacktrace(maybeError))) {
    error = maybeError;
  } else {
    logger.warn(NON_ERROR_WARNING(ERROR_HANDLER, stringifyWithoutCircular(maybeError)));
    error = undefined;
  }

  return error;
};

const createBugsnagException = (error: any, msgPrefix: string): Exception => {
  try {
    const stacktrace = ErrorStackParser.parse(error);
    return createException(error.name, error.message, msgPrefix, stacktrace);
  } catch {
    return createException(error.name, error.message, msgPrefix, []);
  }
};

export {
  normalizeError,
  createBugsnagException,
  formatStackframe, // for testing
  ensureString, // for testing
  createException, // for testing
  normalizeFunctionName, // for testing
};
