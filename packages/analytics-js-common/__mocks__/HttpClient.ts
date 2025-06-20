import type { IErrorHandler } from '../src/types/ErrorHandler';
import type { IHttpClient } from '../src/types/HttpClient';
import type { ILogger } from '../src/types/Logger';
import { defaultLogger } from './Logger';

class HttpClient implements IHttpClient {
  errorHandler?: IErrorHandler;
  logger: ILogger = defaultLogger;
  hasErrorHandler = false;
  getData = jest.fn();
  getAsyncData = jest.fn();
  setAuthHeader = jest.fn();
  resetAuthHeader = jest.fn();
  init = jest.fn();
}

const defaultHttpClient = new HttpClient();

export { HttpClient, defaultHttpClient };
