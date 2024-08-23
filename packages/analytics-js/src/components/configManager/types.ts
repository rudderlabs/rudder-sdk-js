import type {
  IHttpClient,
  IResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import type { SourceConfigResponse } from '@rudderstack/analytics-js-common/types/LoadOptions';

export interface IConfigManager {
  httpClient: IHttpClient;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  init: () => void;
  getConfig: () => void;
  processConfig: (response: SourceConfigResponse, details?: IResponseDetails) => void;
}
