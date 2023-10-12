import { IHttpClient, ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IConfigManager, SourceConfigResponse } from './types';
declare class ConfigManager implements IConfigManager {
  httpClient: IHttpClient;
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  hasErrorHandler: boolean;
  constructor(httpClient: IHttpClient, errorHandler?: IErrorHandler, logger?: ILogger);
  attachEffects(): void;
  /**
   * A function to validate, construct and store loadOption, lifecycle, source and destination
   * config related information in global state
   */
  init(): void;
  /**
   * Handle errors
   */
  onError(error: unknown, customMessage?: string, shouldAlwaysThrow?: boolean): void;
  /**
   * A callback function that is executed once we fetch the source config response.
   * Use to construct and store information that are dependent on the sourceConfig.
   */
  processConfig(response?: SourceConfigResponse | string, details?: ResponseDetails): void;
  /**
   * A function to fetch source config either from /sourceConfig endpoint
   * or from getSourceConfig load option
   * @returns
   */
  getConfig(): void;
}
export { ConfigManager };
