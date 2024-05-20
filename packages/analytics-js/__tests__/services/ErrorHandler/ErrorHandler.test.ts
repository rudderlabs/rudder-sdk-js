import type { SDKError } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import type { IExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader/types';
import { defaultLogger } from '../../../src/services/Logger';
import { defaultPluginEngine } from '../../../src/services/PluginEngine';
import { ErrorHandler } from '../../../src/services/ErrorHandler';
import { state } from '../../../src/state';

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

describe('ErrorHandler', () => {
  let errorHandlerInstance: ErrorHandler;

  beforeEach(() => {
    errorHandlerInstance = new ErrorHandler(defaultLogger, defaultPluginEngine);
  });

  it('should leaveBreadcrumb if plugin engine is provided', () => {
    errorHandlerInstance.leaveBreadcrumb('breadcrumb');
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.breadcrumb',
      defaultPluginEngine,
      undefined,
      'breadcrumb',
      expect.any(Object),
    );
  });

  it('should notifyError if plugin engine is provided', () => {
    errorHandlerInstance.notifyError(new Error('notify'));
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.notify',
      defaultPluginEngine,
      undefined,
      expect.any(Error),
      state,
      expect.any(Object),
    );
  });

  it('should log error for Errors with context and custom message if logger exists', () => {
    errorHandlerInstance.onError(new Error('dummy error'), 'Unit test', 'dummy  custom  message');

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.notify',
      defaultPluginEngine,
      undefined,
      expect.any(Error),
      state,
      expect.any(Object),
    );

    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'Unit test:: dummy custom message dummy error',
    );
  });

  it('should log error for messages with context and custom message if logger exists', () => {
    errorHandlerInstance.onError('dummy error', 'Unit test', 'dummy custom message');

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.notify',
      defaultPluginEngine,
      undefined,
      expect.any(Error),
      state,
      expect.any(Object),
    );

    expect(defaultLogger.error).toHaveBeenCalledTimes(1);
    expect(defaultLogger.error).toHaveBeenCalledWith(
      'Unit test:: dummy custom message dummy error',
    );
  });

  it('should log and throw for messages with context and custom message if logger exists and shouldAlwaysThrow', () => {
    try {
      errorHandlerInstance.onError('dummy error', 'Unit test', 'dummy custom message', true);
    } catch (err) {
      expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
      expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
        'errorReporting.notify',
        defaultPluginEngine,
        undefined,
        expect.any(Error),
        state,
        expect.any(Object),
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
    defaultPluginEngine.invokeSingle = jest.fn(() => {
      throw new Error('dummy error');
    });

    errorHandlerInstance.notifyError(new Error('notify'));

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
    const extSrcLoader = {} as IExternalSrcLoader;

    it('reporting client should not be defined if the plugin engine is not supplied', () => {
      errorHandlerInstance = new ErrorHandler(defaultLogger);
      errorHandlerInstance.init(extSrcLoader);

      expect(errorHandlerInstance.errReportingClient).toBeUndefined();
    });

    it('reporting client should be defined', done => {
      const invokeSingleSpy = jest
        .spyOn(defaultPluginEngine, 'invokeSingle')
        .mockReturnValue(Promise.resolve({}));

      errorHandlerInstance.init(extSrcLoader);

      expect(invokeSingleSpy).toHaveBeenCalledTimes(1);
      expect(invokeSingleSpy).toHaveBeenCalledWith(
        'errorReporting.init',
        state,
        defaultPluginEngine,
        extSrcLoader,
        defaultLogger,
      );

      setTimeout(() => {
        expect(errorHandlerInstance.errReportingClient).toBeDefined();
        invokeSingleSpy.mockRestore();
        done();
      }, 0);
    });

    it('reporting client should not be defined if the plugin returns a promise that rejects', done => {
      const invokeSingleSpy = jest
        .spyOn(defaultPluginEngine, 'invokeSingle')
        .mockReturnValue(Promise.reject(new Error('dummy error')));

      errorHandlerInstance.init(extSrcLoader);

      expect(invokeSingleSpy).toHaveBeenCalledTimes(1);
      setTimeout(() => {
        expect(errorHandlerInstance.errReportingClient).toBeUndefined();
        expect(defaultLogger.error).toHaveBeenCalledTimes(1);
        expect(defaultLogger.error).toHaveBeenCalledWith(
          'ErrorHandler:: Failed to initialize the error reporting plugin.',
          new Error('dummy error'),
        );

        invokeSingleSpy.mockRestore();
        done();
      }, 0);
    });

    it('should invoke onError if invoking the plugin results in an exception', () => {
      defaultPluginEngine.invokeSingle = jest.fn(() => {
        throw new Error('dummy error');
      });

      const onErrorSpy = jest.spyOn(errorHandlerInstance, 'onError');
      errorHandlerInstance.init(extSrcLoader);

      expect(onErrorSpy).toHaveBeenCalledTimes(1);
      expect(onErrorSpy).toHaveBeenCalledWith(expect.any(Error), 'ErrorHandler');
      onErrorSpy.mockRestore();
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
