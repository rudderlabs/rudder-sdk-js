import type { ErrorState } from '@rudderstack/analytics-js-common/types/ErrorHandler';
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
  errorHandler?: {
    onError(
      error: unknown,
      context?: string,
      customMessage?: string,
      shouldAlwaysThrow?: boolean,
    ): void;
    leaveBreadcrumb(breadcrumb: string): void;
    notifyError(error: Error, errorState: ErrorState): void;
  };
  logger?: ILogger;
  timeout: number;
  loadJSFile(config: IExternalSourceLoadConfig): void;
}
