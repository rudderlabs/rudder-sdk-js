const LOG_LEVEL_INFO = 1;
const LOG_LEVEL_DEBUG = 2;
const LOG_LEVEL_WARN = 3;
const LOG_LEVEL_ERROR = 4;
const DEF_LOG_LEVEL = LOG_LEVEL_ERROR;
let LOG_LEVEL = DEF_LOG_LEVEL;

const logger = {
  setLogLevel(logLevel) {
    switch (logLevel.toUpperCase()) {
      case 'INFO':
        LOG_LEVEL = LOG_LEVEL_INFO;
        break;
      case 'DEBUG':
        LOG_LEVEL = LOG_LEVEL_DEBUG;
        break;
      case 'WARN':
        LOG_LEVEL = LOG_LEVEL_WARN;
        break;
      default:
        LOG_LEVEL = DEF_LOG_LEVEL;
        break;
    }
  },

  info(...args) {
    if (LOG_LEVEL <= LOG_LEVEL_INFO) {
      console.info(...args);
    }
  },

  debug(...args) {
    if (LOG_LEVEL <= LOG_LEVEL_DEBUG) {
      console.log(...args);
    }
  },

  warn(...args) {
    if (LOG_LEVEL <= LOG_LEVEL_WARN) {
      console.warn(...args);
    }
  },

  error(...args) {
    if (LOG_LEVEL <= LOG_LEVEL_ERROR) {
      console.error(...args);
    }
  },
};

export default logger;
