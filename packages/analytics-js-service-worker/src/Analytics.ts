/* eslint-disable no-underscore-dangle,no-param-reassign,consistent-return, sonarjs/prefer-single-boolean-return */
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import axiosRetry from 'axios-retry';
import ms from 'ms';
import { v4 as uuid } from '@lukeed/uuid';
import { is, clone } from 'ramda';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import { isValidURL } from '@rudderstack/analytics-js-common/utilities/url';
import type { IAnalytics } from './IAnalytics';
import type {
  ApiCallback,
  ApiObject,
  ConstructorOptions,
  FlushOverrideMessage,
  IntegrationOptions,
} from './types';
import { looselyValidateEvent } from './loosely-validate-event';
import { getDataPlaneUrl, isFunction, noop } from './utilities';

const version = __PACKAGE_VERSION__;

class Analytics implements IAnalytics {
  timeout?: number;
  flushAt: number;
  flushInterval?: number;
  enable?: boolean;
  maxInternalQueueSize: number;
  logLevel?: 'silly' | 'debug' | 'info' | 'error' | 'off';
  flushOverride?: (message: FlushOverrideMessage) => void;
  queue: { message: Record<string, any>; callback?: ApiCallback }[];
  writeKey?: string;
  host: string;
  flushed: boolean;
  axiosInstance: AxiosInstance;
  logger: null | any;
  flushTimer?: null | any;
  timer?: null | any;


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

  constructor(writeKey: string, dataPlaneURL: string, options?: ConstructorOptions) {
    options = options || {};

    if (!writeKey) {
      throw new Error('You must pass the source write key.');
    }

    if (!isValidURL(dataPlaneURL)) {
      throw new Error(`The provided data plane URL "${dataPlaneURL}" is invalid.`);
    }

    this.queue = [];
    this.writeKey = writeKey;
    this.host = getDataPlaneUrl(dataPlaneURL);
    this.timeout = options.timeout || undefined;
    this.flushAt = options.flushAt ? Math.max(options.flushAt, 1) : 20;
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
      error(message: string, ...args: any[]) {
        if (this.logLevel !== 'off') {
          console.error(`${new Date().toISOString()} ["Rudder"] error: ${message}`, ...args);
        }
      },
      info(message: string, ...args: any[]) {
        if (['silly', 'debug', 'info'].includes(this.logLevel)) {
          console.log(`${new Date().toISOString()} ["Rudder"] info: ${message}`, ...args);
        }
      },
      debug(message: string, ...args: any[]) {
        if (['silly', 'debug'].includes(this.logLevel)) {
          console.debug(`${new Date().toISOString()} ["Rudder"] debug: ${message}`, ...args);
        }
      },
      silly(message: string, ...args: any[]) {
        if (['silly'].includes(this.logLevel)) {
          console.info(`${new Date().toISOString()} ["Rudder"] silly: ${message}`, ...args);
        }
      },
    };

    axiosRetry(this.axiosInstance, { retries: 0 });
  }

  _validate(message: Record<string, any>, type?: string) {
    try {
      looselyValidateEvent(message, type);
    } catch (e: any) {
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

  identify(
    message: {
      userId?: string;
      anonymousId?: string;
      context?: ApiObject;
      traits?: ApiObject;
      integrations?: IntegrationOptions;
      timestamp?: Date;
    },
    callback?: ApiCallback,
  ): IAnalytics {
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

  group(
    message: {
      groupId: string;
      userId?: string;
      anonymousId?: string;
      context?: ApiObject;
      traits?: ApiObject;
      integrations?: IntegrationOptions;
      timestamp?: Date;
    },
    callback?: ApiCallback,
  ): IAnalytics {
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

  track(
    message: {
      event: string;
      userId?: string;
      anonymousId?: string;
      context?: ApiObject;
      properties?: ApiObject;
      integrations?: IntegrationOptions;
      timestamp?: Date;
    },
    callback?: ApiCallback,
  ): IAnalytics {
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

  page(
    message: {
      name: string;
      userId?: string;
      anonymousId?: string;
      context?: ApiObject;
      properties?: ApiObject;
      integrations?: IntegrationOptions;
      timestamp?: Date;
    },
    callback?: ApiCallback,
  ): IAnalytics {
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

  screen(message: { [key: string]: any }, callback?: ApiCallback): IAnalytics {
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

  alias(
    message: {
      previousId: string;
      userId?: string;
      anonymousId?: string;
      context?: ApiObject;
      properties?: ApiObject;
      integrations?: IntegrationOptions;
      timestamp?: Date;
    },
    callback?: ApiCallback,
  ): IAnalytics {
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

  enqueue(type: string, message: Record<string, any>, callback?: ApiCallback): any {
    if (this.queue.length >= this.maxInternalQueueSize) {
      this.logger.error(
        `not adding events for processing as queue size ${this.queue.length} >= than max configuration ${this.maxInternalQueueSize}`,
      );
      return;
    }
    // Clone the incoming message object
    // before altering the data
    let lMessage = clone(message);
    callback = callback || noop;

    if (!this.enable) {
      return setImmediate(callback);
    }

    if (type === 'identify' && lMessage.traits) {
      if (!lMessage.context) {
        lMessage.context = {};
      }
      lMessage.context.traits = lMessage.traits;
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
    if (lMessage.anonymousId && !is(String, lMessage.anonymousId)) {
      lMessage.anonymousId = JSON.stringify(lMessage.anonymousId);
    }
    if (lMessage.userId && !is(String, lMessage.userId)) {
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
   * @return {any}
   */

  flush(callback?: ApiCallback): any {
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

    if (this.queue.length === 0) {
      this.logger.debug('queue is empty, nothing to flush');
      return setImmediate(callback);
    }

    const items = this.queue.splice(0, this.flushAt);
    const callbacks = items.map(
      (item: { message: Record<string, any>; callback?: ApiCallback }) => item.callback,
    );
    const messages = items.map((item: { message: Record<string, any>; callback?: ApiCallback }) => {
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

    const done = (err?: any) => {
      callbacks.forEach((callback_?: ApiCallback) => {
        if (callback_) {
          callback_(err);
        }
      });
      if (callback) {
        callback(err, data);
      }
    };

    // Don't set the user agent if we're not on a browser. The latest spec allows
    // the User-Agent header (see https://fetch.spec.whatwg.org/#terminology-headers
    // and https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/setRequestHeader),
    // but browsers such as Chrome and Safari have not caught up.
    const headers: Record<string, string> = {};
    if (typeof window === 'undefined') {
      headers['user-agent'] = `analytics-service-worker/${version}`;
      headers['Content-Type'] = `application/json`;
    }

    const reqTimeout =
      typeof this.timeout === 'string' ? parseInt(ms(this.timeout), 10) : this.timeout;

    if (data.batch.length === 0) {
      this.logger.debug('batch is empty, nothing to flush');
      return setImmediate(callback);
    }

    if (this.flushOverride) {
      this.flushOverride({
        host: `${this.host}`,
        writeKey: this.writeKey as string,
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
      } as AxiosRequestConfig;

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
      } as any)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .then((response: AxiosResponse) => {
          this.timer = setTimeout(this.flush.bind(this), this.flushInterval);
          done();
        })
        .catch((err: any) => {
          this.logger.error(err);
          this.logger.error(
            `got error while attempting send for 3 times, dropping ${items.length} events`,
          );
          this.timer = setTimeout(this.flush.bind(this), this.flushInterval);
          if (err.response) {
            const error = new Error(err.response.statusText);
            return done(error);
          }
          done(err);
        });
    }
  }

  _isErrorRetryable(error: AxiosError) {
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
