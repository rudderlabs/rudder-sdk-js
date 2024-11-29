import type { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';

class ErrorHandler implements IErrorHandler {
  onError = jest.fn();
  init = jest.fn();
  leaveBreadcrumb = jest.fn();
  notifyError = jest.fn();
}

const defaultErrorHandler = new ErrorHandler();

export { ErrorHandler, defaultErrorHandler };
