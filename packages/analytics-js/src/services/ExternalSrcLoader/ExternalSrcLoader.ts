import { defaultErrorHandler, ErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger, Logger } from '@rudderstack/analytics-js/services/Logger';
import { DEFAULT_EXT_SRC_LOAD_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import { jsFileLoader } from './jsFileLoader';

export interface IExternalSourceLoadConfig {
  url: string;
  id: string;
  callback?: (id?: string) => unknown;
  async?: boolean;
  timeout?: number;
}

class ExternalSrcLoader {
  errorHandler?: ErrorHandler;
  logger?: Logger;
  hasErrorHandler = false;
  hasLogger = false;
  timeout: number;

  constructor(
    errorHandler?: ErrorHandler,
    logger?: Logger,
    timeout = DEFAULT_EXT_SRC_LOAD_TIMEOUT,
  ) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.timeout = timeout;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.hasLogger = Boolean(this.logger);
    this.onError = this.onError.bind(this);
  }

  async loadJSFile(config: IExternalSourceLoadConfig) {
    const { url, id, timeout, async, callback } = config;
    const isFireAndForget = !(callback && isFunction(callback));

    await jsFileLoader(url, id, timeout || this.timeout, async)
      .then((id?: string) => {
        if (!isFireAndForget) {
          callback(id);
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
      this.errorHandler?.onError(error, 'HttpClient');
    } else {
      throw error;
    }
  }
}

const defaultExternalSrcLoader = new ExternalSrcLoader(defaultErrorHandler, defaultLogger);

export { ExternalSrcLoader, defaultExternalSrcLoader };
