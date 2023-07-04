import { ILogger } from '@rudderstack/common/types/Logger';
import { IErrorHandler } from '@rudderstack/common/types/ErrorHandler';
import { IExternalSrcLoader } from '@rudderstack/common/services/ExternalSrcLoader/types';

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
