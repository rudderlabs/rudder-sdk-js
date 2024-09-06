import type { IErrorHandler } from '../../types/ErrorHandler';
import type { ILogger } from '../../types/Logger';

export interface IExternalSourceLoadConfig {
  url: string;
  id: string;
  callback?(id?: string): unknown;
  async?: boolean;
  timeout?: number;
  extraAttributes?: Record<string, string>;
}

export interface IExternalSrcLoader {
  private_errorHandler?: IErrorHandler;
  private_logger?: ILogger;
  private_timeout: number;
  loadJSFile(config: IExternalSourceLoadConfig): void;
}
