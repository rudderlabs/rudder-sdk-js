import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';

export interface IExternalSourceLoadConfig {
  url: string;
  id: string;
  callback?(id?: string): unknown;
  async?: boolean;
  timeout?: number;
}

export interface IExternalSrcLoader {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  timeout: number;
  loadJSFile(config: IExternalSourceLoadConfig): Promise<void>;
}
