import type { IHttpClient } from '@rudderstack/analytics-js-common/types/HttpClient';
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { defaultLogger } from './Logger';

class HttpClient implements IHttpClient {
  logger: ILogger = defaultLogger;
  hasErrorHandler = false;
  request = jest.fn();
  getAsyncData = jest.fn();
  setAuthHeader = jest.fn();
  resetAuthHeader = jest.fn();
}

const defaultHttpClient = new HttpClient();

export { HttpClient, defaultHttpClient };
