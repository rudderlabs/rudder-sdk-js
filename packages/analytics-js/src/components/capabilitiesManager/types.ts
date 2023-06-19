import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import {
  IErrorHandler,
  IExternalSrcLoader,
} from '@rudderstack/analytics-js/services/ErrorHandler/types';

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
