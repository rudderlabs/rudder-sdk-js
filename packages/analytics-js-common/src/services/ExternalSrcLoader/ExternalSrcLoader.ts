import { EXTERNAL_SRC_LOADER } from '../../constants/loggerContexts';
import { DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS } from '../../constants/timeouts';
import { isFunction } from '../../utilities/checks';
import type { IErrorHandler } from '../../types/ErrorHandler';
import type { ILogger } from '../../types/Logger';
import type { IExternalSourceLoadConfig, IExternalSrcLoader } from './types';
import { jsFileLoader } from './jsFileLoader';

/**
 * Service to load external resources/files
 */
class ExternalSrcLoader implements IExternalSrcLoader {
  private_errorHandler?: IErrorHandler;
  private_logger?: ILogger;
  private_timeout: number;

  constructor(
    errorHandler?: IErrorHandler,
    logger?: ILogger,
    timeout = DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS,
  ) {
    this.private_errorHandler = errorHandler;
    this.private_logger = logger;
    this.private_timeout = timeout;
    this.private_onError = this.private_onError.bind(this);
  }

  /**
   * Load external resource of type javascript
   */
  loadJSFile(config: IExternalSourceLoadConfig) {
    const { url, id, timeout, async, callback, extraAttributes } = config;
    const isFireAndForget = !isFunction(callback);

    jsFileLoader(url, id, timeout ?? this.private_timeout, async, extraAttributes)
      .then((id?: string) => {
        if (!isFireAndForget) {
          callback(id);
        }
      })
      .catch(err => {
        this.private_onError(err);
        if (!isFireAndForget) {
          callback();
        }
      });
  }

  /**
   * Handle errors
   */
  private_onError(error: any) {
    if (this.private_errorHandler) {
      this.private_errorHandler.onError(error, EXTERNAL_SRC_LOADER);
    } else {
      throw error;
    }
  }
}

export { ExternalSrcLoader };
