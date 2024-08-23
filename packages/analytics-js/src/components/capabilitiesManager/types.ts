import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';

export interface ICapabilitiesManager {
  logger?: ILogger;
  errorHandler?: IErrorHandler;
  externalSrcLoader: IExternalSrcLoader;
  httpClient: IHttpClient;
  init(httpClient: IHttpClient): void;
  detectBrowserCapabilities(): void;
  prepareBrowserCapabilities(): void;
  attachWindowListeners(): void;
  onReady(): void;
}
