import { isString, isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
import type { ILogger, LogLevel } from '@rudderstack/analytics-js-common/types/Logger';
import type { LoggerProvider } from './types';

const LOG_LEVEL_MAP: Record<LogLevel, number> = {
  LOG: 0,
  INFO: 1,
  DEBUG: 2,
  WARN: 3,
  ERROR: 4,
  NONE: 5,
};

const DEFAULT_LOG_LEVEL = 'LOG';
const POST_LOAD_LOG_LEVEL = 'ERROR';
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

  constructor(minLogLevel: LogLevel = DEFAULT_LOG_LEVEL, scope = '', logProvider = console) {
    this.minLogLevel = LOG_LEVEL_MAP[minLogLevel];
    this.scope = scope;
    this.logProvider = logProvider;
  }

  log(...data: any[]) {
    this.outputLog('LOG', data);
  }

  info(...data: any[]) {
    this.outputLog('INFO', data);
  }

  debug(...data: any[]) {
    this.outputLog('DEBUG', data);
  }

  warn(...data: any[]) {
    this.outputLog('WARN', data);
  }

  error(...data: any[]) {
    this.outputLog('ERROR', data);
  }

  outputLog(logMethod: LogLevel, data: any[]) {
    if (this.minLogLevel <= LOG_LEVEL_MAP[logMethod]) {
      this.logProvider[
        logMethod.toLowerCase() as Exclude<Lowercase<LogLevel>, Lowercase<'NONE'>>
      ]?.(...this.formatLogData(data));
    }
  }

  setScope(scopeVal: string) {
    this.scope = scopeVal || this.scope;
  }

  // TODO: should we allow to change the level via global variable on run time
  //  to assist on the fly debugging?
  setMinLogLevel(logLevel: LogLevel) {
    this.minLogLevel = LOG_LEVEL_MAP[logLevel];
    if (isUndefined(this.minLogLevel)) {
      this.minLogLevel = LOG_LEVEL_MAP[DEFAULT_LOG_LEVEL];
    }
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
      const originalMsg = isString(data[0]) ? data[0].trim() : '';

      // prepare the final message
      msg = `${msg} %c ${originalMsg}`;

      const styledLogArgs = [
        msg,
        LOG_MSG_PREFIX_STYLE, // add style for the prefix
        LOG_MSG_STYLE, // reset the style for the actual message
      ];

      // add first it if it was not a string msg
      if (!isString(data[0])) {
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
  LOG_LEVEL_MAP,
  LOG_MSG_PREFIX,
  LOG_MSG_PREFIX_STYLE,
  LOG_MSG_STYLE,
  defaultLogger,
  POST_LOAD_LOG_LEVEL,
};
