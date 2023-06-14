import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { defaultPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine';
import { SDKError } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ErrorHandler } from '../../../src/services/ErrorHandler';

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

  it('should log error if processError throws and logger exists', () => {
    errorHandlerInstance.onError(null);

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(1);
    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledWith(
      'errorReporting.notify',
      defaultPluginEngine,
      undefined,
      expect.any(Error),
      expect.any(Object),
    );

    expect(defaultLogger.error).toHaveBeenCalledTimes(2);
    expect(defaultLogger.error).nthCalledWith(
      1,
      "Exception:: Cannot read properties of null (reading 'message')",
    );
    expect(defaultLogger.error).nthCalledWith(2, 'Original error:: null');
  });

  it('should swallow Errors based on processError logic', () => {
    errorHandlerInstance.onError('');

    expect(defaultPluginEngine.invokeSingle).toHaveBeenCalledTimes(0);
    expect(defaultLogger.error).toHaveBeenCalledTimes(0);
  });
});
