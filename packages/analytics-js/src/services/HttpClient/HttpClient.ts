import { defaultLogger, Logger } from '@rudderstack/analytics-js/services/Logger';
import { defaultErrorHandler, ErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import { createXhrRequestOptions, IXHRRequestOptions, xhrRequest } from './xhrRequestHandler';
import { responseTextToJson } from './xhrResponseHandler';

export interface IRequestConfig {
  url: string;
  options?: Partial<IXHRRequestOptions>;
  isRawResponse?: boolean;
  timeout?: number;
}

export interface IAsyncRequestConfig<T> extends IRequestConfig {
  callback?: (data?: T | string | undefined) => void;
}

class HttpClient {
  errorhandler?: ErrorHandler;
  logger?: Logger;
  basicAuthHeader?: string;
  hasErrorHandler = false;
  hasLogger = false;

  constructor(errorhandler?: ErrorHandler, logger?: Logger) {
    this.errorhandler = errorhandler;
    this.logger = logger;
    this.hasErrorHandler = Boolean(this.errorhandler);
    this.hasLogger = Boolean(this.logger);
  }

  async getData<T = any>(config: IRequestConfig): Promise<T | string | undefined> {
    const { url, options, timeout, isRawResponse } = config;

    try {
      const data = await xhrRequest(
        createXhrRequestOptions(url, options, this.basicAuthHeader),
        timeout,
      );
      return isRawResponse ? data : responseTextToJson<T>(data, this.onError);
    } catch (err) {
      this.onError(err);
      return undefined;
    }
  }

  getAsyncData<T = any>(config: IAsyncRequestConfig<T>): void {
    const { callback, url, options, timeout, isRawResponse } = config;
    const isFireAndForget = !(callback && isFunction(callback));

    xhrRequest(createXhrRequestOptions(url, options, this.basicAuthHeader), timeout)
      .then((data?: string) => {
        if (!isFireAndForget) {
          callback(isRawResponse ? data : responseTextToJson<T>(data, this.onError));
        }
      })
      .catch(err => {
        this.onError(err);
        if (!isFireAndForget) {
          callback();
        }
      });
  }

  onError(error: Error | unknown) {
    if (this.hasErrorHandler) {
      this.errorhandler?.onError(error, 'HttpClient');
    } else {
      throw error;
    }
  }

  setAuthHeader(value: string, noBtoa = false) {
    this.basicAuthHeader = `Basic ${noBtoa ? value : btoa(`${value}:`)}`;
  }

  resetAuthHeader() {
    this.basicAuthHeader = undefined;
  }
}

const defaultHttpClient = new HttpClient(defaultErrorHandler, defaultLogger);

export { HttpClient, defaultHttpClient };
