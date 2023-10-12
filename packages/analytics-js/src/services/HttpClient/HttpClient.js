import { isFunction } from '@rudderstack/analytics-js-common/utilities/checks';
import { toBase64 } from '@rudderstack/analytics-js-common/utilities/string';
import { HTTP_CLIENT } from '@rudderstack/analytics-js-common/constants/loggerContexts';
import { defaultErrorHandler } from '../ErrorHandler';
import { defaultLogger } from '../Logger';
import { responseTextToJson } from './xhr/xhrResponseHandler';
import { createXhrRequestOptions, xhrRequest } from './xhr/xhrRequestHandler';
// TODO: should we add any debug level loggers?
/**
 * Service to handle data communication with APIs
 */
class HttpClient {
  constructor(errorHandler, logger) {
    this.hasErrorHandler = false;
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.onError = this.onError.bind(this);
  }
  /**
   * Implement requests in a blocking way
   */
  async getData(config) {
    var _a;
    const { url, options, timeout, isRawResponse } = config;
    try {
      const data = await xhrRequest(
        createXhrRequestOptions(url, options, this.basicAuthHeader),
        timeout,
        this.logger,
      );
      return {
        data: isRawResponse ? data.response : responseTextToJson(data.response, this.onError),
        details: data,
      };
    } catch (reason) {
      this.onError((_a = reason.error) !== null && _a !== void 0 ? _a : reason);
      return { data: undefined, details: reason };
    }
  }
  /**
   * Implement requests in a non-blocking way
   */
  getAsyncData(config) {
    const { callback, url, options, timeout, isRawResponse } = config;
    const isFireAndForget = !(callback && isFunction(callback));
    xhrRequest(createXhrRequestOptions(url, options, this.basicAuthHeader), timeout, this.logger)
      .then(data => {
        if (!isFireAndForget) {
          callback(
            isRawResponse ? data.response : responseTextToJson(data.response, this.onError),
            data,
          );
        }
      })
      .catch(data => {
        var _a;
        this.onError((_a = data.error) !== null && _a !== void 0 ? _a : data);
        if (!isFireAndForget) {
          callback(undefined, data);
        }
      });
  }
  /**
   * Handle errors
   */
  onError(error) {
    var _a;
    if (this.hasErrorHandler) {
      (_a = this.errorHandler) === null || _a === void 0 ? void 0 : _a.onError(error, HTTP_CLIENT);
    } else {
      throw error;
    }
  }
  /**
   * Set basic authentication header (eg writekey)
   */
  setAuthHeader(value, noBtoa = false) {
    const authVal = noBtoa ? value : toBase64(`${value}:`);
    this.basicAuthHeader = `Basic ${authVal}`;
  }
  /**
   * Clear basic authentication header
   */
  resetAuthHeader() {
    this.basicAuthHeader = undefined;
  }
}
const defaultHttpClient = new HttpClient(defaultErrorHandler, defaultLogger);
export { HttpClient, defaultHttpClient };
