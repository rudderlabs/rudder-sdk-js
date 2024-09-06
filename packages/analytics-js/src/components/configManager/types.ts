import type {
  IHttpClient,
  IResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { SourceConfigResponse } from '@rudderstack/analytics-js-common/types/LoadOptions';

export interface IConfigManager {
  private_httpClient: IHttpClient;
  private_errorHandler?: IErrorHandler;
  private_logger?: ILogger;
  init: () => void;
  private_getConfig: () => void;
  private_processConfig: (response: SourceConfigResponse, details?: IResponseDetails) => void;
}
