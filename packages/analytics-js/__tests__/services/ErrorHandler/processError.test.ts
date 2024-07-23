import {
  processError,
  getNormalizedErrorForUnhandledError,
  isAllowedToBeNotified,
} from '../../../src/services/ErrorHandler/processError';

jest.mock('../../../src/components/utilities/event', () => {
  const originalModule = jest.requireActual('../../../src/components/utilities/event');

  return {
    __esModule: true,
    ...originalModule,
    isEvent: jest.fn((event): boolean => event && Boolean(event.target)),
  };
});

describe('ErrorHandler - process error', () => {
  it('should not throw error for non supported argument value', () => {
    const msg = processError(null);
    expect(msg).toStrictEqual("Unknown error: Cannot read properties of null (reading 'message')");
  });

  it('should process string argument value', () => {
    const msg = processError('dummy error');
    expect(msg).toStrictEqual('dummy error');
  });

  it('should process Error argument value', () => {
    const msg = processError(new Error('dummy error'));
    expect(msg).toStrictEqual('dummy error');
  });

  it('should process ErrorEvent argument value', () => {
    const msg = processError(new ErrorEvent('dummy error', { message: 'dummy error' }));
    expect(msg).toStrictEqual('dummy error');
  });

  it('should process any other type of argument value', () => {
    const msg = processError({ foo: 'bar' });
    expect(msg).toStrictEqual('{"foo":"bar"}');
  });

  it('should process any other type of argument value with message property', () => {
    const msg = processError({ foo: 'bar', message: 'dummy error' });
    expect(msg).toStrictEqual('dummy error');
  });
});

describe('ErrorHandler - getNormalizedErrorForUnhandledError', () => {
  it('should return error instance for Error argument value', () => {
    const error = new Error('dummy error');
    const normalizedError = getNormalizedErrorForUnhandledError(error);
    expect(normalizedError).toStrictEqual(error);
  });

  it('should return error instance for ErrorEvent argument value', () => {
    const error = new ErrorEvent('dummy error');
    const normalizedError = getNormalizedErrorForUnhandledError(error);
    expect(normalizedError).toStrictEqual(error);
  });

  it('should return error instance for PromiseRejectionEvent argument value', () => {
    const error = new PromiseRejectionEvent('dummy error');
    const normalizedError = getNormalizedErrorForUnhandledError(error);
    expect(normalizedError).toStrictEqual(error);
  });

  it('should return undefined for Event argument value', () => {
    const event = new Event('dummyError');
    const targetElement = document.createElement('div');
    targetElement.id = 'targetElement';
    document.body.appendChild(targetElement);

    let normalizedError;

    targetElement.addEventListener('dummyError', e => {
      normalizedError = getNormalizedErrorForUnhandledError(e);
    });
    targetElement.dispatchEvent(event);
    expect(normalizedError).toBeUndefined();
  });

  it('should return undefined for Event argument value with non SDK script target', () => {
    const event = new Event('dummyError');
    const targetElement = document.createElement('script');
    targetElement.id = 'targetElement';
    document.body.appendChild(targetElement);

    let normalizedError;

    targetElement.addEventListener('dummyError', e => {
      normalizedError = getNormalizedErrorForUnhandledError(e);
    });
    targetElement.dispatchEvent(event);
    expect(normalizedError).toBeUndefined();
  });

  it.skip('should return error instance for Event argument value with SDK script target', () => {
    const event = new Event('dummyError');
    const targetElement = document.createElement('script');
    targetElement.dataset.loader = 'RS_JS_SDK';
    targetElement.dataset.isnonnativesdk = 'true';
    targetElement.id = 'dummy';
    targetElement.src = 'dummy';
    document.body.appendChild(targetElement);

    let normalizedError;

    targetElement.addEventListener('dummyError', e => {
      normalizedError = getNormalizedErrorForUnhandledError(e);
    });
    targetElement.dispatchEvent(event);
    console.log('normalizedError', normalizedError);
    expect(normalizedError?.message).toStrictEqual(
      'Error in loading a third-party script from URL https://www.test-host.com/dummy with ID dummy.',
    );
  });
});

describe('ErrorHandler - isAllowedToBeNotified', () => {
  it('should return true for Error argument value', () => {
    const result = isAllowedToBeNotified(new Error('dummy error'));
    expect(result).toBeTruthy();
  });

  it('should return true for Error argument value', () => {
    const result = isAllowedToBeNotified(new Error('The request failed'));
    expect(result).toBeFalsy();
  });

  it('should return true for ErrorEvent argument value', () => {
    const result = isAllowedToBeNotified(new ErrorEvent('dummy error'));
    expect(result).toBeTruthy();
  });

  it('should return true for PromiseRejectionEvent argument value', () => {
    const result = isAllowedToBeNotified(new PromiseRejectionEvent('dummy error'));
    expect(result).toBeTruthy();
  });

  it('should return true for PromiseRejectionEvent argument value', () => {
    const result = isAllowedToBeNotified(new PromiseRejectionEvent('The request failed'));
    expect(result).toBeFalsy();
  });
});
