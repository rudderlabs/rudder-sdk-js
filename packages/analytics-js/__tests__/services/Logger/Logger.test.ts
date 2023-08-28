import { LogLevel } from '@rudderstack/analytics-js-common/types/Logger';
import {
  LOG_MSG_PREFIX,
  LOG_MSG_PREFIX_STYLE,
  LOG_MSG_STYLE,
  LOG_LEVEL_MAP,
  Logger,
} from '@rudderstack/analytics-js/services/Logger/Logger';

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

  it(`should log with scope if set`, () => {
    loggerInstance = new Logger(LogLevel.Log);
    loggerInstance.setScope('dummy scope');
    loggerInstance.log('dummy msg');
    expect(console.log).toHaveBeenCalledWith(
      `%c ${LOG_MSG_PREFIX} - dummy scope %c dummy msg`,
      LOG_MSG_PREFIX_STYLE,
      LOG_MSG_STYLE,
    );
  });

  it(`should log all types of messages above the set min log level`, () => {
    loggerInstance = new Logger();
    loggerInstance.setMinLogLevel(LogLevel.Log);

    loggerInstance.log('dummy log msg');
    expect(console.log).toHaveBeenCalledWith(
      `%c ${LOG_MSG_PREFIX} %c dummy log msg`,
      LOG_MSG_PREFIX_STYLE,
      LOG_MSG_STYLE,
    );

    loggerInstance.info('dummy info msg');
    expect(console.info).toHaveBeenCalledWith(
      `%c ${LOG_MSG_PREFIX} %c dummy info msg`,
      LOG_MSG_PREFIX_STYLE,
      LOG_MSG_STYLE,
    );

    loggerInstance.debug('dummy debug msg');
    expect(console.debug).toHaveBeenCalledWith(
      `%c ${LOG_MSG_PREFIX} %c dummy debug msg`,
      LOG_MSG_PREFIX_STYLE,
      LOG_MSG_STYLE,
    );

    loggerInstance.warn('dummy warn msg');
    expect(console.warn).toHaveBeenCalledWith(
      `%c ${LOG_MSG_PREFIX} %c dummy warn msg`,
      LOG_MSG_PREFIX_STYLE,
      LOG_MSG_STYLE,
    );

    loggerInstance.error('dummy error msg');
    expect(console.error).toHaveBeenCalledWith(
      `%c ${LOG_MSG_PREFIX} %c dummy error msg`,
      LOG_MSG_PREFIX_STYLE,
      LOG_MSG_STYLE,
    );
  });

  it(`should not log any messages below the set min log level`, () => {
    loggerInstance = new Logger();
    loggerInstance.setMinLogLevel(LogLevel.Warn);

    loggerInstance.log('dummy log msg');
    expect(console.log).not.toHaveBeenCalled();

    loggerInstance.info('dummy info msg');
    expect(console.log).not.toHaveBeenCalled();

    loggerInstance.debug('dummy debug msg');
    expect(console.log).not.toHaveBeenCalled();

    loggerInstance.warn('dummy warn msg');
    expect(console.warn).toHaveBeenCalledWith(
      `%c ${LOG_MSG_PREFIX} %c dummy warn msg`,
      LOG_MSG_PREFIX_STYLE,
      LOG_MSG_STYLE,
    );

    loggerInstance.error('dummy error msg');
    expect(console.error).toHaveBeenCalledWith(
      `%c ${LOG_MSG_PREFIX} %c dummy error msg`,
      LOG_MSG_PREFIX_STYLE,
      LOG_MSG_STYLE,
    );
  });

  it(`should default the min log level to error if incorrectly set`, () => {
    loggerInstance = new Logger();
    loggerInstance.setMinLogLevel('dummy' as LogLevel);
    loggerInstance.error('dummy error msg');
    expect(console.error).toHaveBeenCalledWith(
      `%c ${LOG_MSG_PREFIX} %c dummy error msg`,
      LOG_MSG_PREFIX_STYLE,
      LOG_MSG_STYLE,
    );

    loggerInstance.warn('dummy warn msg');
    expect(console.warn).not.toHaveBeenCalled();
  });
});
