import { DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS } from '../../constants/timeouts';
import { isFunction } from '../../utilities/checks';
import type { IExternalSourceLoadConfig, IExternalSrcLoader } from './types';
import { jsFileLoader } from './jsFileLoader';

/**
 * Service to load external resources/files
 */
class ExternalSrcLoader implements IExternalSrcLoader {
  /**
   * Load external resource of type JavaScript
   */
  // eslint-disable-next-line class-methods-use-this
  loadJSFile(config: IExternalSourceLoadConfig) {
    const { url, id, timeout, async, callback, extraAttributes } = config;
    const isFireAndForget = !isFunction(callback);

    jsFileLoader(url, id, timeout ?? DEFAULT_EXT_SRC_LOAD_TIMEOUT_MS, async, extraAttributes)
      .then((id?: string) => {
        if (!isFireAndForget) {
          callback(id);
        }
      })
      .catch(err => {
        if (!isFireAndForget) {
          callback(undefined, err);
        }
      });
  }
}

export { ExternalSrcLoader };
