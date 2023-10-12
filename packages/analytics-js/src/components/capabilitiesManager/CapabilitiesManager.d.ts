import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { ICapabilitiesManager } from './types';
declare class CapabilitiesManager implements ICapabilitiesManager {
  logger?: ILogger;
  errorHandler?: IErrorHandler;
  externalSrcLoader: IExternalSrcLoader;
  constructor(errorHandler?: IErrorHandler, logger?: ILogger);
  init(): void;
  /**
   * Detect supported capabilities and set values in state
   */
  detectBrowserCapabilities(): void;
  /**
   * Detect if polyfills are required and then load script from polyfill URL
   */
  prepareBrowserCapabilities(): void;
  /**
   * Attach listeners to window to observe event that update capabilities state values
   */
  attachWindowListeners(): void;
  /**
   * Set the lifecycle status to next phase
   */
  onReady(): void;
  /**
   * Handles error
   * @param error The error object
   */
  onError(error: unknown): void;
}
export { CapabilitiesManager };
