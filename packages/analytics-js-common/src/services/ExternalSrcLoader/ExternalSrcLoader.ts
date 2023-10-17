import { EXTERNAL_SRC_LOADER } from '../../constants/loggerContexts';
import { DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS } from '../../constants/timeouts';
import { isFunction } from '../../utilities/checks';
import { IErrorHandler } from '../../types/ErrorHandler';
import { ILogger } from '../../types/Logger';
import { IExternalSourceLoadConfig, IExternalSrcLoader } from './types';
import { jsFileLoader } from './jsFileLoader';

/**
 * Service to load external resources/files
 */
class ExternalSrcLoader implements IExternalSrcLoader {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  hasErrorHandler = false;
  timeout: number;

  constructor(
    errorHandler?: IErrorHandler,
    logger?: ILogger,
    timeout = DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS,
  ) {
    this.errorHandler = errorHandler;
    this.logger = logger;
    this.timeout = timeout;
    this.hasErrorHandler = Boolean(this.errorHandler);
    this.onError = this.onError.bind(this);
  }

  /**
   * Load external resource of type javascript
   */
  loadJSFile(config: IExternalSourceLoadConfig) {
    const { url, id, timeout, async, callback, extraAttributes } = config;
    const isFireAndForget = !isFunction(callback);

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
