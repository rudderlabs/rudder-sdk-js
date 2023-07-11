import { ILogger } from '../../types/Logger';
import { IErrorHandler } from '../../types/ErrorHandler';

export interface IExternalSourceLoadConfig {
  url: string;
  id: string;
  callback?(id?: string): unknown;
  async?: boolean;
  timeout?: number;
  extraAttributes?: Record<string, string>;
}

export interface IExternalSrcLoader {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  timeout: number;
  loadJSFile(config: IExternalSourceLoadConfig): Promise<void>;
}
