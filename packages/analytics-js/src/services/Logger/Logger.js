import { isString, isUndefined } from '@rudderstack/analytics-js-common/utilities/checks';
const LOG_LEVEL_MAP = {
  LOG: 0,
  INFO: 1,
  DEBUG: 2,
  WARN: 3,
  ERROR: 4,
  NONE: 5,
};
const DEFAULT_LOG_LEVEL = 'ERROR';
const LOG_MSG_PREFIX = 'RS SDK';
const LOG_MSG_PREFIX_STYLE = 'font-weight: bold; background: black; color: white;';
const LOG_MSG_STYLE = 'font-weight: normal;';
/**
 * Service to log messages/data to output provider, default is console
 */
class Logger {
  constructor(minLogLevel = DEFAULT_LOG_LEVEL, scope = '', logProvider = console) {
    this.minLogLevel = LOG_LEVEL_MAP[minLogLevel];
    this.scope = scope;
    this.logProvider = logProvider;
  }
  log(...data) {
    this.outputLog('LOG', data);
  }
  info(...data) {
    this.outputLog('INFO', data);
  }
  debug(...data) {
    this.outputLog('DEBUG', data);
  }
  warn(...data) {
    this.outputLog('WARN', data);
  }
  error(...data) {
    this.outputLog('ERROR', data);
  }
  outputLog(logMethod, data) {
    var _a, _b;
    if (this.minLogLevel <= LOG_LEVEL_MAP[logMethod]) {
      (_b = (_a = this.logProvider)[logMethod.toLowerCase()]) === null || _b === void 0
        ? void 0
        : _b.call(_a, ...this.formatLogData(data));
    }
  }
  setScope(scopeVal) {
    this.scope = scopeVal || this.scope;
  }
  // TODO: should we allow to change the level via global variable on run time
  //  to assist on the fly debugging?
  setMinLogLevel(logLevel) {
    this.minLogLevel = LOG_LEVEL_MAP[logLevel];
    if (isUndefined(this.minLogLevel)) {
      this.minLogLevel = LOG_LEVEL_MAP[DEFAULT_LOG_LEVEL];
    }
  }
  /**
   * Formats the console message using `scope` and styles
   */
  formatLogData(data) {
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
        LOG_MSG_PREFIX_STYLE,
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
};
