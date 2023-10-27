import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';

export interface ICapabilitiesManager {
  logger?: ILogger;
  errorHandler?: IErrorHandler;
  externalSrcLoader?: IExternalSrcLoader;
  init(): void;
  detectBrowserCapabilities(): void;
  prepareBrowserCapabilities(): void;
  attachWindowListeners(): void;
  onReady(): void;
}
