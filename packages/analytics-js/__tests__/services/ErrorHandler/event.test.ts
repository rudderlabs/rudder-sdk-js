import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import type ErrorStackParser from 'error-stack-parser';
import {
  createBugsnagException,
  createException,
  ensureString,
  formatStackframe,
  normalizeError,
  normalizeFunctionName,
} from '../../../src/services/ErrorHandler/ErrorEvent/event';

describe('event', () => {
  describe('normalizeFunctionName', () => {
    const testCases: any[][] = [
      ['functionName', 'functionName'],
      ['global code', 'global code'],
      ['GLOBAL CODE', 'global code'],
      ['Global Code', 'global code'],
      ['Global code', 'global code'],
      ['global Code', 'global code'],
      ['globalcode', 'globalcode'],
      ['global code with something extra', 'global code with something extra'],
      ['', ''],
      [undefined, undefined],
    ];

    it.each(testCases)('if function name is %p then return %p', (input, output) => {
      expect(normalizeFunctionName(input)).toBe(output);
    });
  });

  describe('ensureString', () => {
    const testCases: any[][] = [
      ['string', 'string'],
      [123, ''],
      [undefined, ''],
      [null, ''],
      [{}, ''],
      [[], ''],
      [true, ''],
      [false, ''],
    ];

    it.each(testCases)('if input is %p then return %p', (input, output) => {
      expect(ensureString(input)).toBe(output);
    });
  });

  describe('formatStackframe', () => {
    const testCases: any[][] = [
      [
        {
          fileName: 'file.js',
          functionName: 'functionName',
          lineNumber: 1,
          columnNumber: 2,
        },
        {
          file: 'file.js',
          method: 'functionName',
          lineNumber: 1,
          columnNumber: 2,
        },
      ],
      [
        {
          fileName: '',
          functionName: '',
          lineNumber: 1,
          columnNumber: 1,
        },
        {
          file: 'global code',
          method: '',
          lineNumber: 1,
          columnNumber: 1,
        },
      ],
      [
        {
          fileName: '',
          functionName: 'Global Code',
          lineNumber: -1,
          columnNumber: -1,
        },
        {
          file: '',
          method: 'global code',
          lineNumber: -1,
          columnNumber: -1,
        },
      ],
    ];

    it.each(testCases)('if stack frame is %p then return %p', (input, output) => {
      expect(formatStackframe(input)).toEqual(output);
    });
  });

  describe('createException', () => {
    it('should return exception object with valid stacktrace', () => {
      const errorClass = 'errorClass';
      const errorMessage = 'errorMessage';
      const msgPrefix = 'msgPrefix';
      const stacktrace = [
        {
          fileName: 'file.js',
          functionName: 'functionName',
          lineNumber: 1,
          columnNumber: 2,
        },
        // should be ignored
        {},
        // stack frame with a circular reference, should be ignored
        {
          // will be replaced by circular reference below
          fileName: 'xyz',
          functionName: 'functionName',
          lineNumber: 1,
          columnNumber: 2,
        },
        {
          fileName: 'file2.js',
          functionName: 'functionName2',
          lineNumber: 3,
          columnNumber: 4,
        },
      ] as unknown as ErrorStackParser.StackFrame[];

      // create circular reference
      (stacktrace[2] as any).fileName = stacktrace;

      const expectedOutput = {
        errorClass,
        message: `${msgPrefix}${errorMessage}`,
        type: 'browserjs',
        stacktrace: [
          {
            file: 'file.js',
            method: 'functionName',
            lineNumber: 1,
            columnNumber: 2,
          },
          {
            file: 'file2.js',
            method: 'functionName2',
            lineNumber: 3,
            columnNumber: 4,
          },
        ],
      };
      expect(createException(errorClass, errorMessage, msgPrefix, stacktrace)).toEqual(
        expectedOutput,
      );
    });
  });

  describe('normalizeError', () => {
    it('should return error object if it is an instance of Error and has stacktrace', () => {
      const error = new Error('error message');
      error.stack = 'stacktrace';

      expect(normalizeError(error, defaultLogger)).toEqual(error);
      expect(defaultLogger.warn).not.toHaveBeenCalled();
    });

    it('should return undefined and log warning if error is not an instance of Error', () => {
      const error = 'error message';

      expect(normalizeError(error, defaultLogger)).toBeUndefined();
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith(
        'ErrorHandler:: Ignoring a non-error: "error message".',
      );
    });

    it('should return undefined and log warning if error does not have stacktrace', () => {
      const error = new Error('error message');
      error.stack = undefined;

      expect(normalizeError(error, defaultLogger)).toBeUndefined();
      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith('ErrorHandler:: Ignoring a non-error: {}.');
    });
  });

  describe('createBugsnagException', () => {
    it('should return exception object with a valid stacktrace', () => {
      const error = new Error('error message');
      // override stack property to a custom stack trace with proper function names etc.
      error.stack = `Error: error message
        at functionName (file.js:1:2)
        at functionName2 (file2.js:3:4)`;

      const msgPrefix = 'msgPrefix';

      const expectedOutput = {
        errorClass: 'Error',
        message: `${msgPrefix}error message`,
        type: 'browserjs',
        stacktrace: [
          {
            file: 'file.js',
            method: 'functionName',
            lineNumber: 1,
            columnNumber: 2,
          },
          {
            file: 'file2.js',
            method: 'functionName2',
            lineNumber: 3,
            columnNumber: 4,
          },
        ],
      };

      expect(createBugsnagException(error, msgPrefix)).toEqual(expectedOutput);
    });

    it('should return exception object with an empty stack trace if the stack trace information is not parsable', () => {
      const error = new Error('error message');
      // override stack property to cause an exception while parsing
      error.stack = undefined;

      const msgPrefix = 'msgPrefix';

      const expectedOutput = {
        errorClass: 'Error',
        message: `${msgPrefix}error message`,
        type: 'browserjs',
        stacktrace: [],
      };

      expect(createBugsnagException(error, msgPrefix)).toEqual(expectedOutput);
    });
  });
});
