import type { IErrorHandler } from '../src/types/ErrorHandler';
import type { IHttpClient } from '../src/types/HttpClient';
import type { ILogger } from '../src/types/Logger';

class HttpClient implements IHttpClient {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  hasErrorHandler = false;
  init = jest.fn();
  getData = jest.fn();
  getAsyncData = jest.fn();
  setAuthHeader = jest.fn();
  resetAuthHeader = jest.fn();
}

const defaultHttpClient = new HttpClient();

export { HttpClient, defaultHttpClient };
