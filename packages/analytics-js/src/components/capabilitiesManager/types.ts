import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';

export interface ICapabilitiesManager {
  private_logger?: ILogger;
  private_errorHandler?: IErrorHandler;
  private_externalSrcLoader: IExternalSrcLoader;
  private_httpClient: IHttpClient;
  init(httpClient: IHttpClient): void;
  private_detectBrowserCapabilities(): void;
  private_prepareBrowserCapabilities(): void;
  private_attachWindowListeners(): void;
  private_onReady(): void;
}
