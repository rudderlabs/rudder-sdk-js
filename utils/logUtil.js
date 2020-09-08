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
        return;
      case "DEBUG":
        LOG_LEVEL = LOG_LEVEL_DEBUG;
        return;
      case "WARN":
        LOG_LEVEL = LOG_LEVEL_WARN;
    }
  },

  info() {
    if (LOG_LEVEL <= LOG_LEVEL_INFO) {
      console.log(...arguments);
    }
  },

  debug() {
    if (LOG_LEVEL <= LOG_LEVEL_DEBUG) {
      console.log(...arguments);
    }
  },

  warn() {
    if (LOG_LEVEL <= LOG_LEVEL_WARN) {
      console.log(...arguments);
    }
  },

  error() {
    if (LOG_LEVEL <= LOG_LEVEL_ERROR) {
      console.log(...arguments);
    }
  },
};
export default logger;
