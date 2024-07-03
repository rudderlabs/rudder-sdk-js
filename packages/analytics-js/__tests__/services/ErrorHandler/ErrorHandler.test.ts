import type { SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { defaultHttpClient } from '../../../src/services/HttpClient';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { defaultLogger } from '../../../src/services/Logger';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { ErrorHandler } from '../../../src/services/ErrorHandler';
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
    errorHandlerInstance = new ErrorHandler(defaultLogger, defaultPluginEngine, defaultHttpClient);
  });

  it('should leaveBreadcrumb if plugin engine is provided', () => {
    errorHandlerInstance.leaveBreadcrumb('breadcrumb');
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.breadcrumb',
      'breadcrumb',
      state,
    );
  });

  it('should notifyError if plugin engine is provided', () => {
    errorHandlerInstance.notifyError(new Error('notify'), {
      severity: 'error',
      unhandled: false,
      severityReason: { type: 'handledException' },
    });
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.notify',
      expect.any(Error),
      {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
      state,
      defaultHttpClient,
      defaultLogger,
    );
  });

  it('should log error for Errors with context and custom message if logger exists', () => {
    state.reporting.isErrorReportingEnabled.value = true;
    state.reporting.isErrorReportingPluginLoaded.value = true;
    errorHandlerInstance.onError(new Error('dummy error'), 'Unit test', 'dummy  custom  message');

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.notify',
      expect.any(Error),
      {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
      state,
      defaultHttpClient,
      defaultLogger,
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

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.notify',
      expect.any(Error),
      {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      },
      state,
      defaultHttpClient,
      defaultLogger,
    );

    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'Unit test:: dummy custom message dummy error',
    );
  });

  it('should log and throw for messages with context and custom message if logger exists and shouldAlwaysThrow', () => {
    // Hard code the presence of the error reporting client
    errorHandlerInstance.errReportingClient = {};

    try {
      state.reporting.isErrorReportingEnabled.value = true;
      state.reporting.isErrorReportingPluginLoaded.value = true;
      errorHandlerInstance.onError('dummy error', 'Unit test', 'dummy custom message', true);
    } catch (err) {
      expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
      expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
        'errorReporting.notify',
        expect.any(Error),
        {
          severity: 'error',
          unhandled: false,
          severityReason: { type: 'handledException' },
        },
        state,
        defaultHttpClient,
        defaultLogger,
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
      expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(0);
      expect(defaultLogger.error).toHaveBeenCalledTimes(0);
      expect(err.message).toStrictEqual('Unit test:: dummy custom message dummy error');
    }
  });

  it('should throw error for messages with context and custom message if logger does not exist', () => {
    errorHandlerInstance = new ErrorHandler();
    try {
      errorHandlerInstance.onError('dummy error', 'Unit test', 'dummy custom message');
    } catch (err) {
      expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(0);
      expect(defaultLogger.error).toHaveBeenCalledTimes(0);
      expect(err.message).toStrictEqual('Unit test:: dummy custom message dummy error');
    }
  });

  it('should swallow Errors based on processError logic', () => {
    errorHandlerInstance.onError('');

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(0);
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
});
