import { DEFAULT_EXT_SRC_LOAD_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import {
  IErrorHandler,
  IExternalSourceLoadConfig,
  IExternalSrcLoader,
} from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { EXTERNAL_SRC_LOADER } from '@rudderstack/analytics-js/constants/loggerContexts';
import { jsFileLoader } from './jsFileLoader';

/**
 * Service to load external resources/files
 */
class ExternalSrcLoader implements IExternalSrcLoader {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  hasErrorHandler = false;
  hasLogger = false;
  timeout: number;

  constructor(
    errorHandler?: IErrorHandler,
    logger?: ILogger,
    timeout = DEFAULT_EXT_SRC_LOAD_TIMEOUT,
  ) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.timeout = timeout;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.hasLogger = Boolean(this.logger);
    this.onError = this.onError.bind(this);
  }

  /**
   * Load external resource of type javascript
   */
  loadJSFile(config: IExternalSourceLoadConfig) {
    const { url, id, timeout, async, callback, extraAttributes } = config;
    const isFireAndForget = !(callback && isFunction(callback));

    jsFileLoader(url, id, timeout || this.timeout, async, extraAttributes)
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

  /**
   * Handle errors
   */
  onError(error: unknown) {
    if (this.hasErrorHandler) {
      this.errorHandler?.onError(error, EXTERNAL_SRC_LOADER);
    } else {
      throw error;
    }
  }
}

export { ExternalSrcLoader };
