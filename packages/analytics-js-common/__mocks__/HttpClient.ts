import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { defaultErrorHandler } from './ErrorHandler';
import { defaultLogger } from './Logger';

class HttpClient implements IHttpClient {
  errorHandler?: IErrorHandler;
  logger: ILogger = defaultLogger;
  hasErrorHandler = false;
  request = jest.fn();
  getAsyncData = jest.fn();
  setAuthHeader = jest.fn();
  resetAuthHeader = jest.fn();
  init = jest.fn();
}

const defaultHttpClient = new HttpClient();

export { HttpClient, defaultHttpClient };
