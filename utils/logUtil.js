/* eslint-disable no-console */
const LOG_LEVEL_INFO = 1;
const LOG_LEVEL_DEBUG = 2;
const LOG_LEVEL_WARN = 3;
const LOG_LEVEL_ERROR = 4;
let LOG_LEVEL = LOG_LEVEL_ERROR;

const logger = {
  setLogLevel(logLevel) {
    switch (logLevel.toUpperCase()) {
      case "INFO":
        LOG_LEVEL = LOG_LEVEL_INFO;
        break;
      case "DEBUG":
        LOG_LEVEL = LOG_LEVEL_DEBUG;
        break;
      case "WARN":
        LOG_LEVEL = LOG_LEVEL_WARN;
        break;
      default:
        LOG_LEVEL = LOG_LEVEL_ERROR;
        break;
    }
  },

  info(...args) {
    if (LOG_LEVEL <= LOG_LEVEL_INFO) {
      console.log(...args);
    }
  },

  debug(...args) {
    if (LOG_LEVEL <= LOG_LEVEL_DEBUG) {
      console.log(...args);
    }
  },

  warn(...args) {
    if (LOG_LEVEL <= LOG_LEVEL_WARN) {
      console.log(...args);
    }
  },

  error(...args) {
    if (LOG_LEVEL <= LOG_LEVEL_ERROR) {
      console.log(...args);
    }
  },
};
export default logger;
