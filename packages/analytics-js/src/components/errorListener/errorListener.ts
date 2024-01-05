import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IErrorListener } from './types';
import { attachOnError } from './windowOnError';
import { attachUnhandledRejection } from './windowUnhandledRejection';

class ErrorListener implements IErrorListener {
  pluginsManager: IPluginsManager;
  errorHandler?: IErrorHandler;
  logger?: ILogger;

  constructor(pluginsManager: IPluginsManager, errorHandler?: IErrorHandler, logger?: ILogger) {
    this.pluginsManager = pluginsManager;
    this.errorHandler = errorHandler;
    this.logger = logger;
  }

  // eslint-disable-next-line class-methods-use-this
  attachErrorListeners() {
    attachOnError(this.pluginsManager, this.logger);
    attachUnhandledRejection(this.pluginsManager, this.logger);
  }
}

export { ErrorListener };
