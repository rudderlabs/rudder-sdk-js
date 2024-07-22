import type { SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { defaultHttpClient } from '../../../src/services/HttpClient';
import { defaultLogger } from '../../../src/services/Logger';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { ErrorHandler } from '../../../src/services/ErrorHandler';
import * as processError from '../../../src/services/ErrorHandler/processError';
import { state, resetState } from '../../../src/state';

jest.mock('../../../src/services/Logger', () => {
  const originalModule = jest.requireActual('../../../src/services/Logger');

  return {
    __esModule: true,
    ...originalModule,
    defaultLogger: {
      error: jest.fn((): void => {}),
    },
  };
});

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
    processError: jest.fn((error: SDKError): string => error.message || error || ''),
  };
});

const extSrcLoader = {} as IExternalSrcLoader;

describe('ErrorHandler', () => {
  let errorHandlerInstance: ErrorHandler;

  beforeEach(() => {
    resetState();
    state.reporting.isErrorReportingPluginLoaded.value = false;
    errorHandlerInstance = new ErrorHandler(defaultLogger, defaultPluginEngine);
    errorHandlerInstance.init(defaultHttpClient, extSrcLoader);
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
    state.reporting.isErrorReportingEnabled.value = true;
    state.reporting.isErrorReportingPluginLoaded.value = true;
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
    state.reporting.isErrorReportingEnabled.value = true;
    state.reporting.isErrorReportingPluginLoaded.value = true;
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
    try {
      state.reporting.isErrorReportingEnabled.value = true;
      state.reporting.isErrorReportingPluginLoaded.value = true;
      errorHandlerInstance.onError('dummy error', 'Unit test', 'dummy custom message', true);
    } catch (err) {
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
      expect(err.message).toStrictEqual('Unit test:: dummy custom message dummy error');
    }
  });

  it('should throw error for Errors with context and custom message if logger does not exist', () => {
    errorHandlerInstance = new ErrorHandler();
    try {
      errorHandlerInstance.onError(new Error('dummy error'), 'Unit test', 'dummy  custom  message');
    } catch (err) {
      expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
      expect(defaultLogger.error).toHaveBeenCalledTimes(0);
      expect(err.message).toStrictEqual('Unit test:: dummy custom message dummy error');
    }
  });

  it('should throw error for messages with context and custom message if logger does not exist', () => {
    errorHandlerInstance = new ErrorHandler();
    try {
      errorHandlerInstance.onError('dummy error', 'Unit test', 'dummy custom message');
    } catch (err) {
      expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
      expect(defaultLogger.error).toHaveBeenCalledTimes(0);
      expect(err.message).toStrictEqual('Unit test:: dummy custom message dummy error');
    }
  });

  it('should swallow Errors based on processError logic', () => {
    errorHandlerInstance.onError('');

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledTimes(0);
  });

  it('should log error on notifyError if invoking plugin results in an exception', () => {
    // Hard code the presence of the error reporting client
    errorHandlerInstance.errReportingClient = {};

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
      'unhandledException',
    );
    expect(getNormalizedErrorForUnhandledErrorSpy).toHaveBeenCalled();
  });

  describe('init', () => {
    it('reporting client should not be defined if the plugin engine is not supplied', () => {
      errorHandlerInstance = new ErrorHandler(defaultLogger);
      errorHandlerInstance.init(defaultHttpClient);

      expect(errorHandlerInstance.httpClient).not.toBeUndefined();
    });
  });

  it('should attach error listeners', () => {
    const unhandledRejectionListener = jest.spyOn(window, 'addEventListener');
    errorHandlerInstance.attachErrorListeners();
    expect(unhandledRejectionListener).toHaveBeenCalledTimes(2);
    expect(unhandledRejectionListener).toHaveBeenCalledWith('error', expect.any(Function));
    expect(unhandledRejectionListener).toHaveBeenCalledWith(
      'unhandledrejection',
      expect.any(Function),
    );
  });

  it('should notify buffered errors once Error reporting plugin is loaded', () => {
    errorHandlerInstance.notifyError = jest.fn();
    errorHandlerInstance.errorBuffer.enqueue({
      error: new Error('dummy error'),
      errorState: {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
    });
    state.reporting.isErrorReportingPluginLoaded.value = true;
    setTimeout(() => {
      expect(errorHandlerInstance.attachEffect).toHaveBeenCalledTimes(1);
      expect(errorHandlerInstance.errorBuffer.size()).toBe(0);
      expect(errorHandlerInstance.notifyError).toHaveBeenCalledTimes(1);
    }, 1);
  });

  it('should enqueue errors if Error reporting plugin is not loaded', () => {
    errorHandlerInstance.errorBuffer.enqueue = jest.fn();
    state.reporting.isErrorReportingEnabled.value = true;
    errorHandlerInstance.onError(new Error('dummy error'));
    expect(errorHandlerInstance.errorBuffer.enqueue).toHaveBeenCalledTimes(1);
  });

  it('should not invoke the plugin if Error reporting plugin is not loaded', () => {
    errorHandlerInstance.attachEffect();
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
  });

  it('should log error in case unhandled error occurs during processing or notifying the error', () => {
    state.reporting.isErrorReportingEnabled.value = true;
    state.reporting.isErrorReportingPluginLoaded.value = true;
    const dummyError = new Error('dummy error');
    errorHandlerInstance.notifyError = jest.fn(() => {
      throw dummyError;
    });
    errorHandlerInstance.logger.error = jest.fn();
    errorHandlerInstance.onError(
      new Error('test error'),
      undefined,
      undefined,
      undefined,
      'unhandledException',
    );
    expect(errorHandlerInstance.logger.error).toHaveBeenCalledTimes(1);
    expect(errorHandlerInstance.logger.error).toHaveBeenCalledWith(
      'ErrorHandler:: Failed to notify the error.',
      dummyError,
    );
  });
});
