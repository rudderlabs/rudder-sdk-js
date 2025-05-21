import { DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS } from '../../constants/timeouts';
import { isFunction } from '../../utilities/checks';
import type { SDKError } from '../../types/ErrorHandler';
import type { ILogger } from '../../types/Logger';
import type { IExternalSourceLoadConfig, IExternalSrcLoader } from './types';
import { jsFileLoader } from './jsFileLoader';

/**
 * Service to load external resources/files
 */
class ExternalSrcLoader implements IExternalSrcLoader {
  logger: ILogger;
  timeout: number;

  constructor(logger: ILogger, timeout = DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS) {
    this.logger = logger;
    this.timeout = timeout;
  }

  /**
   * Load external resource of type javascript
   */
  loadJSFile(config: IExternalSourceLoadConfig) {
    const { url, id, timeout, async, callback, extraAttributes } = config;
    const isFireAndForget = !isFunction(callback);

    jsFileLoader(url, id, timeout || this.timeout, async, extraAttributes)
      .then((id: string) => {
        if (!isFireAndForget) {
          callback(id);
        }
      })
      .catch((err: SDKError) => {
        if (!isFireAndForget) {
          callback(id, err);
        }
      });
  }
}

export { ExternalSrcLoader };
