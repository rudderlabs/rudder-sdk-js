import { processError } from '@rudderstack/analytics-js/services/ErrorHandler/processError';

jest.mock('@rudderstack/analytics-js/components/utilities/event', () => {
  const originalModule = jest.requireActual('@rudderstack/analytics-js/components/utilities/event');

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

  it('should process any other type of argument value', () => {
    const msg = processError({ foo: 'bar' });
    expect(msg).toStrictEqual('{"foo":"bar"}');
  });
});
