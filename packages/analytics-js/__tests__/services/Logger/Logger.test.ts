import {
  LOG_MSG_PREFIX,
  LOG_MSG_PREFIX_STYLE,
  LOG_MSG_STYLE,
  LOG_LEVEL_MAP,
  Logger,
} from '@rudderstack/analytics-js/services/Logger/Logger';
import { LogLevel } from '@rudderstack/analytics-js/state/types';

import SpyInstance = jest.SpyInstance;

let consoleErrorMock: SpyInstance;
let consoleWarnMock: SpyInstance;
let consoleDebugMock: SpyInstance;
let consoleInfoMock: SpyInstance;
let consoleLogMock: SpyInstance;

const mockConsole = () => {
  consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
  consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
  consoleDebugMock = jest.spyOn(console, 'debug').mockImplementation();
  consoleInfoMock = jest.spyOn(console, 'info').mockImplementation();
  consoleLogMock = jest.spyOn(console, 'log').mockImplementation();
};

const mockConsoleRestore = () => {
  consoleErrorMock.mockRestore();
  consoleWarnMock.mockRestore();
  consoleDebugMock.mockRestore();
  consoleInfoMock.mockRestore();
  consoleLogMock.mockRestore();
};

describe('Logger', () => {
  let loggerInstance: Logger;

  beforeEach(() => {
    mockConsole();
    loggerInstance = new Logger();
  });

  afterEach(() => {
    mockConsoleRestore();
  });

  Object.keys(LOG_LEVEL_MAP).forEach(logLevelName => {
    if (logLevelName !== LogLevel.None) {
      it(`should log ${logLevelName} for string value if minimum logLevel is set for ${logLevelName} level`, () => {
        loggerInstance = new Logger(logLevelName, 'dummy scope');
        const lowerCaseLogLevelName = logLevelName.toLowerCase();
        loggerInstance[lowerCaseLogLevelName]('dummy msg');
        expect(console[lowerCaseLogLevelName]).toHaveBeenCalledTimes(1);
        expect(console[lowerCaseLogLevelName]).toHaveBeenCalledWith(
          `%c ${LOG_MSG_PREFIX} - dummy scope %c dummy msg`,
          LOG_MSG_PREFIX_STYLE,
          LOG_MSG_STYLE,
        );
      });
    }
  });

  Object.keys(LOG_LEVEL_MAP).forEach(logLevelName => {
    if (logLevelName !== LogLevel.None) {
      it(`should log ${logLevelName} for non string value if minimum logLevel is set for ${logLevelName} level`, () => {
        loggerInstance = new Logger(logLevelName, 'dummy scope');
        const lowerCaseLogLevelName = logLevelName.toLowerCase();
        loggerInstance[lowerCaseLogLevelName]({});
        expect(console[lowerCaseLogLevelName]).toHaveBeenCalledTimes(1);
        expect(console[lowerCaseLogLevelName]).toHaveBeenCalledWith(
          `%c ${LOG_MSG_PREFIX} - dummy scope %c `,
          LOG_MSG_PREFIX_STYLE,
          LOG_MSG_STYLE,
          {},
        );
      });
    }
  });

  Object.keys(LOG_LEVEL_MAP).forEach(logLevelName => {
    if (logLevelName !== LogLevel.None) {
      it(`should log ${logLevelName} if minimum logLevel is set for lower level`, () => {
        loggerInstance = new Logger(LogLevel.Log);
        const lowerCaseLogLevelName = logLevelName.toLowerCase();
        loggerInstance[lowerCaseLogLevelName]('dummy msg');
        expect(console[lowerCaseLogLevelName]).toHaveBeenCalledTimes(1);
        expect(console[lowerCaseLogLevelName]).toHaveBeenCalledWith(
          `%c ${LOG_MSG_PREFIX} %c dummy msg`,
          LOG_MSG_PREFIX_STYLE,
          LOG_MSG_STYLE,
        );
      });
    }
  });

  Object.keys(LOG_LEVEL_MAP).forEach(logLevelName => {
    if (logLevelName !== LogLevel.None) {
      it(`should not log ${logLevelName} if minimum logLevel is set for higher level`, () => {
        const lowerCaseLogLevelName = logLevelName.toLowerCase();
        loggerInstance = new Logger(LogLevel.None);
        loggerInstance[lowerCaseLogLevelName]('dummy msg');
        expect(console[lowerCaseLogLevelName]).toHaveBeenCalledTimes(0);
      });
    }
  });

  it(`should not log if minimum logLevel is set to none`, () => {
    loggerInstance = new Logger(LogLevel.None);
    loggerInstance.log('dummy msg');
    expect(console.log).toHaveBeenCalledTimes(0);
  });
});
