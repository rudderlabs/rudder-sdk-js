import looselyValidate from '@segment/loosely-validate-event';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import ms from 'ms';
import { v4 as uuid } from '@lukeed/uuid';
import isString from 'lodash.isstring';
import cloneDeep from 'lodash.clonedeep';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';

const version = '__PACKAGE_VERSION__';

const removeTrailingSlashes = inURL =>
  inURL && inURL.endsWith('/') ? inURL.replace(/\/+$/, '') : inURL;

const isFunction = value =>
  typeof value === 'function' && Boolean(value.constructor && value.call && value.apply);

const setImmediate = process.nextTick.bind(process);
const noop = () => {};

class Analytics {
  /**
   * Initialize a new `Analytics` with your RudderStack source's `writeKey` and an
   * optional dictionary of `options`.
   *
   * @param {String} writeKey
   * @param {String} dataPlaneURL
   * @param {Object=} options (optional)
   * @param {Number=20} options.flushAt (default: 20)
   * @param {Number=20000} options.flushInterval (default: 20000)
   * @param {Boolean=true} options.enable (default: true)
   * @param {Number=20000} options.maxInternalQueueSize (default: 20000)
   * @param {Number} options.timeout (default: false)
   * @param {String=info} options.logLevel (default: info)
   * @param {Function} options.flushOverride (optional)
   */

  constructor(writeKey, dataPlaneURL, options) {
    options = options || {};

    if (!writeKey) {
      throw new Error("You must pass your project's write key.");
    }

    if (!dataPlaneURL) {
      throw new Error('You must pass our data plane url.');
    }

    this.queue = [];
    this.writeKey = writeKey;
    this.host = removeTrailingSlashes(dataPlaneURL);
    this.timeout = options.timeout || false;
    this.flushAt = Math.max(options.flushAt, 1) || 20;
    this.flushInterval = options.flushInterval || 20000;
    this.maxInternalQueueSize = options.maxInternalQueueSize || 20000;
    this.logLevel = options.logLevel || 'info';
    this.flushOverride =
      options.flushOverride && isFunction(options.flushOverride)
        ? options.flushOverride
        : undefined;
    this.flushed = false;
    this.axiosInstance = axios.create({
      adapter: fetchAdapter,
    });
    Object.defineProperty(this, 'enable', {
      configurable: false,
      writable: false,
      enumerable: true,
      value: typeof options.enable === 'boolean' ? options.enable : true,
    });

    this.logger = {
      error(message, ...args) {
        if (this.logLevel !== 'off') {
          console.error(`${new Date().toISOString()} ["Rudder"] error: ${message}`, ...args);
        }
      },
      info(message, ...args) {
        if (['silly', 'debug', 'info'].includes(this.logLevel)) {
          console.log(`${new Date().toISOString()} ["Rudder"] info: ${message}`, ...args);
        }
      },
      debug(message, ...args) {
        if (['silly', 'debug'].includes(this.logLevel)) {
          console.debug(`${new Date().toISOString()} ["Rudder"] debug: ${message}`, ...args);
        }
      },
      silly(message, ...args) {
        if (['silly'].includes(this.logLevel)) {
          console.info(`${new Date().toISOString()} ["Rudder"] silly: ${message}`, ...args);
        }
      },
    };

    axiosRetry(this.axiosInstance, { retries: 0 });
  }

  _validate(message, type) {
    try {
      looselyValidate(message, type);
    } catch (e) {
      if (e.message === 'Your message must be < 32kb.') {
        this.logger.info(
          'Your message must be < 32kb. This is currently surfaced as a warning. Please update your code',
          message,
        );
        return;
      }
      throw e;
    }
  }

  /**
   * Send an identify `message`.
   *
   * @param {Object} message
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.traits (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */

  identify(message, callback) {
    this._validate(message, 'identify');
    this.enqueue('identify', message, callback);
    return this;
  }

  /**
   * Send a group `message`.
   *
   * @param {Object} message
   * @param {String} message.groupId
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.traits (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */

  group(message, callback) {
    this._validate(message, 'group');
    this.enqueue('group', message, callback);
    return this;
  }

  /**
   * Send a track `message`.
   *
   * @param {Object} message
   * @param {String} message.event
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.properties (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */

  track(message, callback) {
    this._validate(message, 'track');
    this.enqueue('track', message, callback);
    return this;
  }

  /**
   * Send a page `message`.
   *
   * @param {Object} message
   * @param {String} message.name
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.properties (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */

  page(message, callback) {
    this._validate(message, 'page');
    this.enqueue('page', message, callback);
    return this;
  }

  /**
   * Send a screen `message`.
   *
   * @param {Object} message
   * @param {Function} callback (optional)
   * @return {Analytics}
   */

  screen(message, callback) {
    this._validate(message, 'screen');
    this.enqueue('screen', message, callback);
    return this;
  }

  /**
   * Send an alias `message`.
   *
   * @param {Object} message
   * @param {String} message.previousId
   * @param {String=} message.userId (optional)
   * @param {String=} message.anonymousId (optional)
   * @param {Object=} message.context (optional)
   * @param {Object=} message.properties (optional)
   * @param {Object=} message.integrations (optional)
   * @param {Date=} message.timestamp (optional)
   * @param {Function=} callback (optional)
   * @return {Analytics}
   */

  alias(message, callback) {
    this._validate(message, 'alias');
    this.enqueue('alias', message, callback);
    return this;
  }

  /**
   * Add a `message` of type `type` to the queue and
   * check whether it should be flushed.
   *
   * @param {String} type
   * @param {Object} message
   * @param {Function} [callback] (optional)
   * @api private
   */

  enqueue(type, message, callback) {
    if (this.queue.length >= this.maxInternalQueueSize) {
      this.logger.error(
        `not adding events for processing as queue size ${this.queue.length} >= than max configuration ${this.maxInternalQueueSize}`,
      );
      return;
    }
    // Clone the incoming message object
    // before altering the data
    let lMessage = cloneDeep(message);
    callback = callback || noop;

    if (!this.enable) {
      return setImmediate(callback);
    }

    if (type == 'identify') {
      if (lMessage.traits) {
        if (!lMessage.context) {
          lMessage.context = {};
        }
        lMessage.context.traits = lMessage.traits;
      }
    }

    lMessage = { ...lMessage };
    lMessage.type = type;

    lMessage.context = {
      library: {
        name: 'analytics-service-worker',
        version,
      },
      ...lMessage.context,
    };

    lMessage.channel = 'service-worker';

    lMessage._metadata = {
      serviceWorkerVersion: version,
      ...lMessage._metadata,
    };

    if (!lMessage.originalTimestamp) {
      lMessage.originalTimestamp = new Date();
    }

    if (!lMessage.messageId) {
      lMessage.messageId = uuid();
    }

    // Historically this library has accepted strings and numbers as IDs.
    // However, our spec only allows strings. To avoid breaking compatibility,
    // we'll coerce these to strings if they aren't already.
    if (lMessage.anonymousId && !isString(lMessage.anonymousId)) {
      lMessage.anonymousId = JSON.stringify(lMessage.anonymousId);
    }
    if (lMessage.userId && !isString(lMessage.userId)) {
      lMessage.userId = JSON.stringify(lMessage.userId);
    }

    this.queue.push({ message: lMessage, callback });

    if (!this.flushed) {
      this.flushed = true;
      this.flush();
      return;
    }

    if (this.queue.length >= this.flushAt) {
      this.logger.debug('flushAt reached, trying flush...');
      this.flush();
    }

    if (this.flushInterval && !this.flushTimer) {
      this.logger.debug('no existing flush timer, creating new one');
      this.flushTimer = setTimeout(this.flush.bind(this), this.flushInterval);
    }
  }

  /**
   * Flush the current queue
   *
   * @param {Function} [callback] (optional)
   * @return {Analytics}
   */

  flush(callback) {
    // check if earlier flush was pushed to queue
    this.logger.debug('in flush');
    callback = callback || noop;

    if (!this.enable) {
      return setImmediate(callback);
    }

    if (this.timer) {
      this.logger.debug('cancelling existing timer...');
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.flushTimer) {
      this.logger.debug('cancelling existing flushTimer...');
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (!this.queue.length) {
      this.logger.debug('queue is empty, nothing to flush');
      return setImmediate(callback);
    }

    const items = this.queue.splice(0, this.flushAt);
    const callbacks = items.map(item => item.callback);
    const messages = items.map(item => {
      // if someone mangles directly with queue
      if (typeof item.message === 'object') {
        item.message.sentAt = new Date();
      }
      return item.message;
    });

    const data = {
      batch: messages,
      sentAt: new Date(),
    };
    this.logger.debug(`batch size is ${items.length}`);
    this.logger.silly('===data===', data);

    const done = err => {
      callbacks.forEach(callback_ => {
        callback_(err);
      });
      callback(err, data);
    };

    // Don't set the user agent if we're not on a browser. The latest spec allows
    // the User-Agent header (see https://fetch.spec.whatwg.org/#terminology-headers
    // and https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader),
    // but browsers such as Chrome and Safari have not caught up.
    const headers = {};
    if (typeof window === 'undefined') {
      headers['user-agent'] = `analytics-service-worker/${version}`;
      headers['Content-Type'] = `application/json`;
    }

    const reqTimeout = typeof this.timeout === 'string' ? ms(this.timeout) : this.timeout;

    if (this.flushOverride) {
      this.flushOverride({
        host: `${this.host}`,
        writeKey: this.writeKey,
        data,
        headers,
        reqTimeout,
        flush: this.flush.bind(this),
        done,
        isErrorRetryable: this._isErrorRetryable.bind(this),
      });
    } else {
      const req = {
        method: 'POST',
        url: `${this.host}`,
        auth: {
          username: this.writeKey,
        },
        data,
        headers,
      };

      if (reqTimeout) {
        req.timeout = reqTimeout;
      }

      this.axiosInstance({
        ...req,
        'axios-retry': {
          retries: 3,
          retryCondition: this._isErrorRetryable.bind(this),
          retryDelay: axiosRetry.exponentialDelay,
        },
      })
        .then(response => {
          this.timer = setTimeout(this.flush.bind(this), this.flushInterval);
          done();
        })
        .catch(err => {
          console.log(err);
          this.logger.error(
            `got error while attempting send for 3 times, dropping ${items.length} events`,
          );
          this.timer = setTimeout(this.flush.bind(this), this.flushInterval);
          if (err.response) {
            const error = new Error(err.response.statusText);
            done(error);
            return;
          }
          done(err);
        });
    }
  }

  _isErrorRetryable(error) {
    // Retry Network Errors.
    if (axiosRetry.isNetworkError(error)) {
      return true;
    }

    if (!error.response) {
      // Cannot determine if the request can be retried
      return false;
    }

    this.logger.error(`error status: ${error.response.status}`);
    // Retry Server Errors (5xx).
    if (error.response.status >= 500 && error.response.status <= 599) {
      return true;
    }

    // Retry if rate limited.
    if (error.response.status === 429) {
      return true;
    }

    return false;
  }
}

export { Analytics };
