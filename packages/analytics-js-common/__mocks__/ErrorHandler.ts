import type { IErrorHandler } from '../src/types/ErrorHandler';
import { defaultHttpClient } from './HttpClient';

// Mock all the methods of the ErrorHandler class
class ErrorHandler implements IErrorHandler {
  onError = jest.fn();
  leaveBreadcrumb = jest.fn();
  httpClient = defaultHttpClient;
}

const defaultErrorHandler = new ErrorHandler();

export { ErrorHandler, defaultErrorHandler };
