import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IPluginsManager } from '@rudderstack/analytics-js-common/types/PluginsManager';
import type { IErrorListener } from './types';
import { attachOnError } from './windowOnError';
import { attachUnhandledRejection } from './windowUnhandledRejection';

class ErrorListener implements IErrorListener {
  pluginsManager: IPluginsManager;
  logger?: ILogger;

  constructor(pluginsManager: IPluginsManager, logger?: ILogger) {
    this.pluginsManager = pluginsManager;
    this.logger = logger;
    this.attachErrorListeners();
  }

  attachErrorListeners() {
    attachOnError(this.pluginsManager, this.logger);
    attachUnhandledRejection(this.pluginsManager, this.logger);
  }
}

export { ErrorListener };
