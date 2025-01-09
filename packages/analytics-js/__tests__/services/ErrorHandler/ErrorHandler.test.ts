/* eslint-disable compat/compat */
import { defaultHttpClient } from '@rudderstack/analytics-js-common/__mocks__/HttpClient';
import { defaultLogger } from '@rudderstack/analytics-js-common/__mocks__/Logger';
import { resetState, state } from '../../../src/state';
import { ErrorHandler } from '../../../src/services/ErrorHandler';

describe('ErrorHandler', () => {
  let errorHandlerInstance: ErrorHandler;

  beforeEach(() => {
    resetState();
    errorHandlerInstance = new ErrorHandler(defaultHttpClient, defaultLogger);
  });

  it('should attach error listeners for unhandled errors', () => {
    const onErrorSpy = jest.spyOn(errorHandlerInstance, 'onError');

    // Dispatch an unhandled error
    const errorEvent = new ErrorEvent('error', { error: new Error('dummy error') });
    (globalThis as typeof window).dispatchEvent(errorEvent);

    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    expect(onErrorSpy).toHaveBeenCalledWith(
      errorEvent,
      'ErrorHandler',
      undefined,
      'unhandledException',
    );

    onErrorSpy.mockReset();

    // Dispatch an unhandled rejection
    const promiseRejectionEvent = new PromiseRejectionEvent('unhandledrejection', {
      reason: new Error('dummy error'),
      promise: Promise.resolve(),
    });
    (globalThis as typeof window).dispatchEvent(promiseRejectionEvent);

    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    expect(onErrorSpy).toHaveBeenCalledWith(
      promiseRejectionEvent,
      'ErrorHandler',
      undefined,
      'unhandledPromiseRejection',
    );
  });

  describe('leaveBreadcrumb', () => {
    it('should leave breadcrumb message', () => {
      errorHandlerInstance.leaveBreadcrumb('sample breadcrumb message');
      expect(state.reporting.breadcrumbs.value.length).toBe(1);
      expect(state.reporting.breadcrumbs.value).toEqual([
        {
          type: 'manual',
          metaData: {},
          name: 'sample breadcrumb message',
          timestamp: expect.any(Date),
        },
      ]);
    });

    it('should append breadcrumb messages', () => {
      errorHandlerInstance.leaveBreadcrumb('sample breadcrumb message 1');
      errorHandlerInstance.leaveBreadcrumb('sample breadcrumb message 2');
      expect(state.reporting.breadcrumbs.value.length).toBe(2);
      expect(state.reporting.breadcrumbs.value).toEqual([
        {
          type: 'manual',
          metaData: {},
          name: 'sample breadcrumb message 1',
          timestamp: expect.any(Date),
        },
        {
          type: 'manual',
          metaData: {},
          name: 'sample breadcrumb message 2',
          timestamp: expect.any(Date),
        },
      ]);
    });

    it('should handle error if leaveBreadcrumb fails', () => {
      const onErrorSpy = jest.spyOn(errorHandlerInstance, 'onError');

      // @ts-expect-error cause an error for testing
      state.reporting.breadcrumbs.value = null;

      errorHandlerInstance.leaveBreadcrumb('sample breadcrumb message');

      expect(onErrorSpy).toHaveBeenCalledTimes(1);
      expect(onErrorSpy).toHaveBeenCalledWith(
        expect.any(Error),
        'ErrorHandler:: Failed to log breadcrumb.',
      );

      onErrorSpy.mockRestore();
    });
  });

  describe('onError', () => {
    it('should skip processing if error is not a valid error', () => {
      errorHandlerInstance.onError({});

      expect(defaultLogger.warn).toHaveBeenCalledTimes(1);
      expect(defaultLogger.warn).toHaveBeenCalledWith('ErrorHandler:: Ignoring a non-error: {}.');

      // It should not be logged to the console
      expect(defaultLogger.error).toHaveBeenCalledTimes(0);
    });

    it('should skip errors if they are not originated from the sdk', () => {
      // For this error, the stacktrace would not contain the sdk file names
      errorHandlerInstance.onError(new Error('dummy error'));

      // It should not be logged to the console
      expect(defaultLogger.error).toHaveBeenCalledTimes(0);
    });

    it('should handle errors even if they are not originated from the sdk but installation type is NPM', () => {
      // Set the installation type to NPM
      // @ts-expect-error need to set the value for testing
      state.context.app.value.installType = 'npm';

      errorHandlerInstance.onError(new Error('dummy error'), 'Test', 'Custom Message');

      expect(defaultLogger.error).toHaveBeenCalledTimes(1);
      expect(defaultLogger.error).toHaveBeenCalledWith('Test:: Custom Message - dummy error');
    });

    it('should not log unhandled errors to the console', () => {
      errorHandlerInstance.onError(
        new Error('dummy error'),
        'Test',
        undefined,
        // @ts-expect-error not using the enum value for testing
        'unhandledException',
      );

      expect(defaultLogger.error).toHaveBeenCalledTimes(0);
    });

    it('should log unhandled errors that are explicitly dispatched by the SDK', () => {
      const error = new Error('dummy error');
      // Explicitly mark the error as dispatched by the SDK
      error.stack += '[SDK DISPATCHED ERROR]';
      const errorEvent = new ErrorEvent('error', { error });

      // @ts-expect-error not using the enum value for testing
      errorHandlerInstance.onError(errorEvent, 'Test', undefined, 'unhandledException');

      expect(defaultLogger.error).toHaveBeenCalledTimes(1);
      expect(defaultLogger.error).toHaveBeenCalledWith('Test:: dummy error');
    });

    it('should not notify errors if error reporting is disabled', () => {
      state.reporting.isErrorReportingEnabled.value = false;
      errorHandlerInstance.onError(new Error('dummy error'));

      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledTimes(0);
    });

    it('should not notify errors if the error message is not allowed to be notified', () => {
      state.reporting.isErrorReportingEnabled.value = true;
      // "The request failed" is one of the messages that should not be notified
      errorHandlerInstance.onError(new Error('The request failed due to some issue'));

      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledTimes(0);
    });

    it('should notify errors if error reporting is enabled and the error message is allowed to be notified', () => {
      state.reporting.isErrorReportingEnabled.value = true;
      state.lifecycle.writeKey.value = 'dummy-write-key';
      state.metrics.metricsServiceUrl.value = 'https://dummy.dataplane.com/rsaMetrics';

      // @ts-expect-error Ensure that error is notified. Force set the install type to NPM
      state.context.app.value.installType = 'npm';

      const error = new Error('dummy error');
      error.stack =
        'Error: Test:: dummy error\n    at Object.<anonymous> (https://example.com/sample.js:1:1)';
      errorHandlerInstance.onError(error, 'Test');

      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledTimes(1);
      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledWith({
        url: 'https://dummy.dataplane.com/rsaMetrics',
        options: {
          method: 'POST',
          data: expect.any(String),
          sendRawData: true,
        },
        isRawResponse: true,
      });
    });

    it('should log error if an error occurs while handling an error', () => {
      // @ts-expect-error Ensure that error is notified
      state.context.app.value.installType = 'npm';
      state.reporting.isErrorReportingEnabled.value = true;

      defaultHttpClient.getAsyncData.mockImplementationOnce(() => {
        throw new Error('Failed to notify error');
      });

      errorHandlerInstance.onError(new Error('dummy error'), 'Test');

      expect(defaultLogger.error).toHaveBeenCalledTimes(1);
      expect(defaultLogger.error).toHaveBeenCalledWith(
        'ErrorHandler:: Failed to handle the error.',
        new Error('Failed to notify error'),
      );
    });
  });
});
