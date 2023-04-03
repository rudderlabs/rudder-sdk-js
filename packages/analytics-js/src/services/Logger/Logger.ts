import { ILogger, LoggerLevel, LoggerProvider } from './types';

const LOG_LEVEL: Record<LoggerLevel, number> = {
  log: 0,
  info: 1,
  debug: 2,
  warn: 3,
  error: 4,
  none: 5,
};

const DEFAULT_LOG_LEVEL: LoggerLevel = 'error';
const LOG_MSG_PREFIX = 'RS SDK';
const LOG_MSG_PREFIX_STYLE = 'font-weight: bold; background: black; color: white;';
const LOG_MSG_STYLE = 'font-weight: normal;';

/**
 * Service to log messages/data to output provider, default is console
 */
class Logger implements ILogger {
  minLogLevel: number;
  scope?: string;
  logProvider: LoggerProvider;

  constructor(minLogLevel: LoggerLevel = DEFAULT_LOG_LEVEL, scope = '', logProvider = console) {
    this.minLogLevel = LOG_LEVEL[minLogLevel];
    this.scope = scope;
    this.logProvider = logProvider;
  }

  log(...data: any[]) {
    this.outputLog('log', data);
  }

  info(...data: any[]) {
    this.outputLog('info', data);
  }

  debug(...data: any[]) {
    this.outputLog('debug', data);
  }

  warn(...data: any[]) {
    this.outputLog('warn', data);
  }

  error(...data: any[]) {
    this.outputLog('error', data);
  }

  outputLog(logMethod: LoggerLevel, data: any[]) {
    if (logMethod === 'none') {
      return;
    }

    if (this.minLogLevel <= LOG_LEVEL[logMethod]) {
      this.logProvider[logMethod](...this.formatLogData(data));
    }
  }

  setScope(scopeVal: string) {
    this.scope = scopeVal || this.scope;
  }

  // TODO: should we allow to change the level via global variable on run time
  //  to assist on the fly debugging?
  setMinLogLevel(logLevel: LoggerLevel) {
    this.minLogLevel = LOG_LEVEL[logLevel];
  }

  /**
   * Formats the console message using `scope` and styles
   */
  formatLogData(data: any[]) {
    if (Array.isArray(data) && data.length > 0) {
      // prefix SDK identifier
      let msg = `%c ${LOG_MSG_PREFIX}`;

      // format the log message using `scope`
      if (this.scope) {
        msg = `${msg} - ${this.scope}`;
      }

      // trim whitespaces for original message
      const originalMsg = typeof data[0] === 'string' ? data[0].trim() : '';

      // prepare the final message
      msg = `${msg} %c ${originalMsg}`;

      const styledLogArgs = [
        msg,
        LOG_MSG_PREFIX_STYLE, // add style for the prefix
        LOG_MSG_STYLE, // reset the style for the actual message
      ];

      // add first it if it was not a string msg
      if (typeof data[0] !== 'string') {
        styledLogArgs.push(data[0]);
      }

      // append rest of the original arguments
      styledLogArgs.push(...data.slice(1));
      return styledLogArgs;
    }

    return data;
  }
}

const defaultLogger = new Logger();

export {
  Logger,
  DEFAULT_LOG_LEVEL,
  LOG_LEVEL,
  LOG_MSG_PREFIX,
  LOG_MSG_PREFIX_STYLE,
  LOG_MSG_STYLE,
  defaultLogger,
};
