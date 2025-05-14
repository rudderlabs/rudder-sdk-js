import type { ILogger } from '../../types/Logger';
import type { SDKError } from '../../types/ErrorHandler';
export interface IExternalSourceLoadConfig {
  url: string;
  id: string;
  callback?(id: string, error?: SDKError): void;
  async?: boolean;
  timeout?: number;
  extraAttributes?: Record<string, string>;
}

export interface IExternalSrcLoader {
  logger: ILogger;
  timeout: number;
  loadJSFile(config: IExternalSourceLoadConfig): void;
}
