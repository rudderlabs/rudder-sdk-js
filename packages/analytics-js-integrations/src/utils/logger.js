const LogLevel = {
  LOG: {
    value: 0,
    method: console.log,
  },
  INFO: {
    value: 1,
    method: console.info,
  },
  DEBUG: {
    value: 2,
    method: console.debug,
  },
  WARN: {
    value: 3,
    method: console.warn,
  },
  ERROR: {
    value: 4,
    method: console.error,
  },
};

class Logger {
  constructor(scope, level) {
    this.level = +level || LogLevel.ERROR.value;
    this.scope = scope || '';
  }

  setLogLevel(levelStr) {
    if (levelStr && typeof levelStr === 'string') {
      const lvlStr = levelStr.toUpperCase();
      this.level = LogLevel[lvlStr] ? LogLevel[lvlStr].value : this.level;
    }
  }

  setScope(scopeVal) {
    this.scope = scopeVal || this.scope;
  }

  log(...args) {
    this.logBase(args, LogLevel.LOG.value);
  }

  info(...args) {
    this.logBase(args, LogLevel.INFO.value);
  }

  debug(...args) {
    this.logBase(args, LogLevel.DEBUG.value);
  }

  warn(...args) {
    this.logBase(args, LogLevel.WARN.value);
  }

  error(...args) {
    this.logBase(args, LogLevel.ERROR.value);
  }

  logBase(args, logLevel) {
    if (this.level <= logLevel) {
      const logVal = Object.values(LogLevel).find(val => val.value === logLevel);
      logVal.method(...this.getLogData(args));
    }
  }

  /**
   * Formats the console message using `scope`
   * @param {*} logArgs
   * @returns updated log arguments
   */
  getLogData(logArgs) {
    if (Array.isArray(logArgs) && logArgs.length > 0) {
      // prefix SDK identifier
      let msg = `%c RS SDK`;

      // format the log message using `scope`
      if (this.scope) {
        msg = `${msg} - ${this.scope}`;
      }

      // trim whitespaces
      const orgMsg = logArgs[0].trim();

      // prepare the final message
      msg = `${msg} %c ${orgMsg}`;

      const retArgs = [];
      retArgs.push(msg);

      // add style for the prefix
      retArgs.push('font-weight: bold; background: black; color: white;');

      // reset the style for the actual message
      retArgs.push('font-weight: normal;');

      // append rest of the original arguments
      retArgs.push(...logArgs.slice(1));
      return retArgs;
    }
    return logArgs;
  }
}

export default Logger;
