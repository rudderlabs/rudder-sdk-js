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
    this.scope = scope || "";
  }

  setLogLevel(levelStr) {
    this.level = levelStr
      ? LogLevel[levelStr.toString().toUpperCase()].value
      : this.level;
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
      const logVal = Object.values(LogLevel).find(
        (val) => val.value === logLevel
      );
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
      let msg = `%c RS SDK `;
      // format the log message using `scope`
      if (this.scope) {
        msg = `${msg}- ${this.scope}`;
      }
      msg = `${msg} %c ${logArgs[0].trim()}`;
      const retArgs = [];
      retArgs.push(msg);
      retArgs.push("font-weight: bold; background: black; color: white;");
      retArgs.push("font-weight: normal;");
      retArgs.push(...logArgs.slice(1));
      return retArgs;
    }
    return logArgs;
  }
}

export default Logger;
