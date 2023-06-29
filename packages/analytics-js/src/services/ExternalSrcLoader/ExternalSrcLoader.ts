import { DEFAULT_EXT_SRC_LOAD_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import { isFunction } from '@rudderstack/analytics-js/components/utilities/checks';
import {
  IExternalSourceLoadConfig,
  IExternalSrcLoader,
} from '@rudderstack/common/types/ExternalSrcLoader';
import { IErrorHandler } from '@rudderstack/common/types/ErrorHandler';
import { ILogger } from '@rudderstack/common/types/Logger';
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
  async loadJSFile(config: IExternalSourceLoadConfig): Promise<void> {
    const { url, id, timeout, async, callback, extraAttributes } = config;
    const isFireAndForget = !(callback && isFunction(callback));

    await jsFileLoader(url, id, timeout || this.timeout, async, extraAttributes)
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
  onError(error: Error | unknown) {
    if (this.hasErrorHandler) {
      this.errorHandler?.onError(error, 'ExternalSrcLoader');
    } else {
      throw error;
    }
  }
}

export { ExternalSrcLoader };
