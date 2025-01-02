import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import ErrorStackParser from 'error-stack-parser';
import type { Exception, Stackframe } from '@rudderstack/analytics-js-common/types/Metrics';
import { ERROR_HANDLER } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { stringifyWithoutCircular } from '@rudderstack/analytics-js-common/utilities/json';
import { isString, isTypeOfError } from '@rudderstack/analytics-js-common/utilities/checks';
import { hasStack } from '@rudderstack/analytics-js-common/utilities/errors';
import { NON_ERROR_WARNING } from '../../../constants/logMessages';
import type { FrameType } from './types';

const GLOBAL_CODE = 'global code';

const normalizeFunctionName = (name: string) => (/^global code$/i.test(name) ? GLOBAL_CODE : name);

/**
 * Takes a stacktrace.js style stackframe (https://github.com/stacktracejs/stackframe)
 * and returns a Bugsnag compatible stackframe (https://docs.bugsnag.com/api/error-reporting/#json-payload)
 * @param frame
 * @returns
 */
const formatStackframe = (frame: FrameType): Stackframe => {
  const f = {
    file: frame.fileName,
    method: normalizeFunctionName(frame.functionName),
    lineNumber: frame.lineNumber,
    columnNumber: frame.columnNumber,
  };
  // Some instances result in no file:
  // - calling notify() from chrome's terminal results in no file/method.
  // - non-error exception thrown from global code in FF
  // This adds one.
  if (f.lineNumber > -1 && !f.file && !f.method) {
    f.file = GLOBAL_CODE;
  }
  return f;
};

const ensureString = (str: any) => (isString(str) ? str : '');

function createException(
  errorClass: string,
  errorMessage: string,
  msgPrefix: string,
  stacktrace: any[],
): Exception {
  return {
    errorClass: ensureString(errorClass),
    message: `${msgPrefix}${ensureString(errorMessage)}`,
    type: 'browserjs',
    stacktrace: stacktrace.reduce((accum: Stackframe[], frame: FrameType) => {
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

const normalizeError = (maybeError: any, logger?: ILogger): any | undefined => {
  let error;

  if (isTypeOfError(maybeError) && hasStack(maybeError)) {
    error = maybeError;
  } else {
    logger?.warn(NON_ERROR_WARNING(ERROR_HANDLER, stringifyWithoutCircular(maybeError)));
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

export { normalizeError, createBugsnagException };
