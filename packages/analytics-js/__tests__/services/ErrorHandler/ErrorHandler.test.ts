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

      errorHandlerInstance.onError(new Error('dummy error'), 'Test');

      expect(defaultLogger.error).toHaveBeenCalledTimes(1);
      expect(defaultLogger.error).toHaveBeenCalledWith(new Error('Test:: dummy error'));
    });

    it('should not log unhandled errors to the console', () => {
      // @ts-expect-error not using the enum value for testing
      errorHandlerInstance.onError(
        new Error('dummy error'),
        'Test',
        undefined,
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
      expect(defaultLogger.error).toHaveBeenCalledWith(new Error('Test:: dummy error'));
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

    it.skip('should notify errors if error reporting is enabled and the error message is allowed to be notified', () => {
      state.reporting.isErrorReportingEnabled.value = true;
      state.metrics.metricsServiceUrl.value = 'https://dummy.dataplane.com/rsaMetrics';

      // @ts-expect-error Ensure that error is notified. Force set the install type to NPM
      state.context.app.value.installType = 'npm';

      errorHandlerInstance.onError(new Error('dummy error'));

      const notifyPayload = {
        version: '1',
        message_id: expect.any(String),
        source: {
          name: 'js',
          sdk_version: '1.0.0',
          write_key: '',
          install_type: 'npm',
        },
        errors: {
          payloadVersion: '5',
          notifier: {
            name: 'RudderStack JavaScript SDK',
            version: '1.0.0',
            url: 'https://',
          },
          events: [
            {
              exceptions: [
                {
                  message: 'dummy error',
                  errorClass: 'Error',
                  type: 'browserjs',
                  stacktrace: expect.any(String),
                },
              ],
              severity: 'error',
              unhandled: false,
              severityReason: { type: 'handledException' },
              app: {
                version: '1.0.0',
                releaseStage: 'production',
                type: 'npm',
              },
              device: {
                locale: undefined,
                userAgent: undefined,
                time: expect.any(Date),
              },
              request: {
                url: '',
                clientIp: '[NOT COLLECTED]',
              },
              breadcrumbs: [],
              metaData: {
                app: {
                  snippetVersion: undefined,
                },
                device: {
                  density: 0,
                  width: 0,
                  height: 0,
                  innerWidth: 0,
                  innerHeight: 0,
                  timezone: undefined,
                },
              },
              user: {
                id: '',
                name: '',
              },
            },
          ],
        },
      };

      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledTimes(1);
      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledWith({
        url: 'https://dummy.dataplane.com/rsaMetrics',
        options: {
          method: 'POST',
          data: JSON.stringify(notifyPayload),
          sendRawData: true,
        },
        isRawResponse: true,
      });
    });
  });
});
