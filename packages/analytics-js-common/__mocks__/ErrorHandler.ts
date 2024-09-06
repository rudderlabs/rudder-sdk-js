import { PreLoadErrorData, type IErrorHandler } from '../src/types/ErrorHandler';
import { BufferQueue } from './BufferQueue';

// Mock all the methods of the ErrorHandler class
class ErrorHandler implements IErrorHandler {
  onError = jest.fn();
  leaveBreadcrumb = jest.fn();
  notifyError = jest.fn();
  init = jest.fn();
  private_attachErrorListeners = jest.fn();
  private_errorBuffer = new BufferQueue<PreLoadErrorData>();
}

const defaultErrorHandler = new ErrorHandler();

export { ErrorHandler, defaultErrorHandler };
