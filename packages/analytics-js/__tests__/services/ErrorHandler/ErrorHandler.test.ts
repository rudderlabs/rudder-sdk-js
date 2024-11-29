import type { ErrorType, SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { ErrorHandler } from '../../../src/services/ErrorHandler';
import * as processError from '../../../src/services/ErrorHandler/processError';
import { state, resetState } from '../../../src/state';
import { HttpClient } from '../../../src/services/HttpClient';
import { defaultLogger } from '../../../__mocks__/Logger';

jest.mock('../../../src/services/PluginEngine', () => {
  const originalModule = jest.requireActual('../../../src/services/PluginEngine');

  return {
    __esModule: true,
    ...originalModule,
    defaultPluginEngine: {
      invokeSingle: jest.fn((): void => {}),
    },
  };
});

jest.mock('../../../src/services/ErrorHandler/processError', () => {
  const originalModule = jest.requireActual('../../../src/services/ErrorHandler/processError');

  return {
    __esModule: true,
    ...originalModule,
    processError: jest.fn((error: SDKError): string => (error as any).message || error || ''),
  };
});

const extSrcLoader = {} as IExternalSrcLoader;

describe('ErrorHandler', () => {
  let errorHandlerInstance: ErrorHandler;
  const defaultHttpClient = new HttpClient(defaultLogger);

  beforeEach(() => {
    state.reporting.isErrorReportingEnabled.value = true;
    state.reporting.isErrorReportingPluginLoaded.value = true;

    errorHandlerInstance = new ErrorHandler(defaultLogger, defaultPluginEngine);
    errorHandlerInstance.init(defaultHttpClient, extSrcLoader);
  });

  afterEach(() => {
    resetState();
    jest.clearAllMocks();
  });

  it('should attach error listeners', () => {
    const onErrorSpy = jest.spyOn(errorHandlerInstance, 'onError');

    // Raise an error event
    const errorEvent = new ErrorEvent('error', { error: new Error('dummy error') });
    window.dispatchEvent(errorEvent);
    expect(onErrorSpy).toHaveBeenCalledWith(
      errorEvent,
      undefined,
      undefined,
      undefined,
      'unhandledException',
    );

    // Raise a promise rejection event
    // eslint-disable-next-line compat/compat
    const promiseRejectionEvent = new ErrorEvent('unhandledrejection', {
      error: new Error('dummy error'),
    });
    window.dispatchEvent(promiseRejectionEvent);
    expect(onErrorSpy).toHaveBeenCalledWith(
      promiseRejectionEvent,
      undefined,
      undefined,
      undefined,
      'unhandledPromiseRejection',
    );
  });

  it('should leaveBreadcrumb if plugin engine is provided', () => {
    errorHandlerInstance.leaveBreadcrumb('breadcrumb');
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(2);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.breadcrumb',
      defaultPluginEngine,
      undefined,
      'breadcrumb',
      defaultLogger,
      state,
    );
  });

  it('should notifyError if plugin engine is provided', () => {
    errorHandlerInstance.notifyError(new Error('notify'), {
      severity: 'error',
      unhandled: false,
      severityReason: { type: 'handledException' },
    });
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(2);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.notify',
      defaultPluginEngine,
      undefined,
      expect.any(Error),
      state,
      defaultLogger,
      defaultHttpClient,
      {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
    );
  });

  it('should log error for Errors with context and custom message if logger exists', () => {
    errorHandlerInstance.onError(new Error('dummy error'), 'Unit test', 'dummy  custom  message');

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(2);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.notify',
      defaultPluginEngine,
      undefined,
      expect.any(Error),
      state,
      defaultLogger,
      defaultHttpClient,
      {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
    );

    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'Unit test:: dummy custom message dummy error',
    );
  });

  it('should log error for messages with context and custom message if logger exists', () => {
    errorHandlerInstance.onError('dummy error', 'Unit test', 'dummy custom message');

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(2);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.notify',
      defaultPluginEngine,
      undefined,
      expect.any(Error),
      state,
      defaultLogger,
      defaultHttpClient,
      {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
    );

    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'Unit test:: dummy custom message dummy error',
    );
  });

  it('should log and throw for messages with context and custom message if logger exists and shouldAlwaysThrow', () => {
    // @ts-expect-error need to clear the mock of any previous calls
    defaultPluginEngine.invokeSingle.mockClear();

    expect(() =>
      errorHandlerInstance.onError('dummy error', 'Unit test', 'dummy custom message', true),
    ).toThrow(new Error('Unit test:: dummy custom message dummy error'));

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenNthCalledWith(
      1,
      'errorReporting.notify',
      defaultPluginEngine,
      undefined,
      expect.any(Error),
      state,
      defaultLogger,
      defaultHttpClient,
      {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
    );

    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenNthCalledWith(
      1,
      'Unit test:: dummy custom message dummy error',
    );
  });

  it('should throw error if specified', () => {
    // @ts-expect-error need to clear the mock of any previous calls
    defaultPluginEngine.invokeSingle.mockClear();

    expect(() =>
      errorHandlerInstance.onError('dummy error', 'Unit test', 'dummy custom message', true),
    ).toThrow(new Error('Unit test:: dummy custom message dummy error'));

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
  });

  it('should throw error for messages with context and custom message if logger does not exist', () => {
    errorHandlerInstance = new ErrorHandler();

    expect(() =>
      errorHandlerInstance.onError('dummy error', 'Unit test', 'dummy custom message'),
    ).toThrow(new Error('Unit test:: dummy custom message dummy error'));

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledTimes(0);
  });

  it('should swallow Errors based on processError logic', () => {
    errorHandlerInstance.onError('');

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledTimes(0);
  });

  it('should log error on notifyError if invoking plugin results in an exception', () => {
    // Hard code the presence of the error reporting client
    errorHandlerInstance.private_errReportingClient = {};

    defaultPluginEngine.invokeSingle = jest.fn(() => {
      throw new Error('dummy error');
    });

    errorHandlerInstance.notifyError(new Error('notify'), {
      severity: 'error',
      unhandled: false,
      severityReason: { type: 'handledException' },
    });

    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'ErrorHandler:: Failed to notify the error.',
      new Error('dummy error'),
    );
  });

  it('should invoke onError on leaveBreadcrumb if invoking plugin results in an exception', () => {
    defaultPluginEngine.invokeSingle = jest.fn(() => {
      throw new Error('dummy error');
    });

    const onErrorSpy = jest.spyOn(errorHandlerInstance, 'onError');
    errorHandlerInstance.leaveBreadcrumb('breadcrumb');

    expect(onErrorSpy).toHaveBeenCalledTimes(1);
    expect(onErrorSpy).toHaveBeenCalledWith(
      expect.any(Error),
      'ErrorHandler',
      'errorReporting.breadcrumb',
    );
    onErrorSpy.mockRestore();
  });

  it('should invoke getNormalizedErrorForUnhandledError fn to normalize unhandled error types', () => {
    const getNormalizedErrorForUnhandledErrorSpy = jest.spyOn(
      processError,
      'getNormalizedErrorForUnhandledError',
    );
    errorHandlerInstance.onError(
      new ErrorEvent('error'),
      undefined,
      undefined,
      undefined,
      'unhandledException' as ErrorType,
    );
    expect(getNormalizedErrorForUnhandledErrorSpy).toHaveBeenCalled();
  });

  describe('init', () => {
    it('reporting client should not be defined if the plugin engine is not supplied', () => {
      errorHandlerInstance = new ErrorHandler(defaultLogger);
      errorHandlerInstance.init(defaultHttpClient, extSrcLoader);

      expect(errorHandlerInstance.private_errReportingClient).toBeUndefined();
    });
  });

  it('should set the error reporting client if the plugin engine is supplied', done => {
    // @ts-expect-error need to mock the resolve case
    defaultPluginEngine.invokeSingle.mockImplementationOnce(() => Promise.resolve({}));

    errorHandlerInstance = new ErrorHandler(defaultLogger, defaultPluginEngine);
    errorHandlerInstance.init(defaultHttpClient, extSrcLoader);

    setTimeout(() => {
      expect(errorHandlerInstance.private_errReportingClient).toStrictEqual({});
      done();
    }, 1);
  });

  it('should not set the error reporting client if the plugin engine is supplied but the promise is rejected', done => {
    // @ts-expect-error need to mock the reject case
    defaultPluginEngine.invokeSingle.mockImplementationOnce(() =>
      Promise.reject(new Error('dummy error')),
    );

    errorHandlerInstance = new ErrorHandler(defaultLogger, defaultPluginEngine);
    errorHandlerInstance.init(defaultHttpClient, extSrcLoader);

    setTimeout(() => {
      expect(errorHandlerInstance.private_errReportingClient).toBeUndefined();

      expect(defaultLogger.error).toHaveBeenCalledWith(
        'ErrorHandler:: Failed to initialize the error reporting plugin.',
        new Error('dummy error'),
      );

      done();
    }, 1);
  });

  it('should notify buffered errors once Error reporting plugin is loaded', () => {
    errorHandlerInstance.notifyError = jest.fn();
    errorHandlerInstance.private_errorBuffer.enqueue({
      error: new Error('dummy error'),
      errorState: {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
    });
    state.reporting.isErrorReportingPluginLoaded.value = true;
    setTimeout(() => {
      expect(errorHandlerInstance.private_attachEffects).toHaveBeenCalledTimes(1);
      expect(errorHandlerInstance.private_errorBuffer.size()).toBe(0);
      expect(errorHandlerInstance.notifyError).toHaveBeenCalledTimes(1);
    }, 1);
  });

  it('should enqueue errors if Error reporting plugin is not loaded', () => {
    state.reporting.isErrorReportingEnabled.value = true;
    state.reporting.isErrorReportingPluginLoaded.value = false;

    errorHandlerInstance.private_errorBuffer.enqueue = jest.fn();
    errorHandlerInstance.onError(new Error('dummy error'));
    expect(errorHandlerInstance.private_errorBuffer.enqueue).toHaveBeenCalledTimes(1);
  });

  it('should log error in case unhandled error occurs during processing or notifying the error', () => {
    const dummyError = new Error('dummy error');
    errorHandlerInstance.notifyError = jest.fn(() => {
      throw dummyError;
    });

    defaultLogger.error.mockImplementationOnce(() => {});
    defaultLogger.error.mockClear();

    errorHandlerInstance.onError(
      new Error('test error'),
      undefined,
      undefined,
      undefined,
      'unhandledException' as ErrorType,
    );
    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'ErrorHandler:: Failed to notify the error.',
      dummyError,
    );
  });

  it('should notify buffered errors if Error reporting plugin is loaded', () => {
    state.reporting.isErrorReportingPluginLoaded.value = false;

    errorHandlerInstance = new ErrorHandler(defaultLogger, defaultPluginEngine);

    errorHandlerInstance.notifyError = jest.fn();
    errorHandlerInstance.private_errorBuffer.enqueue({
      error: new Error('dummy error'),
      errorState: {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
    });

    state.reporting.isErrorReportingPluginLoaded.value = true;

    setTimeout(() => {
      expect(errorHandlerInstance.private_errorBuffer.size()).toBe(0);
      expect(errorHandlerInstance.notifyError).toHaveBeenCalledTimes(1);
    }, 1);
  });
});
