import type { SourceConfigResponse } from '@rudderstack/analytics-js-common/types/Source';
import type {
  IHttpClient,
  ResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';

export interface IConfigManager {
  httpClient: IHttpClient;
  errorHandler: IErrorHandler;
  logger: ILogger;
  init: () => void;
  getConfig: () => void;
  processConfig: (
    response: SourceConfigResponse | undefined | null,
    details?: ResponseDetails,
  ) => void;
}
