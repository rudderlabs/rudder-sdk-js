import { processError } from '@rudderstack/analytics-js/services/ErrorHandler/processError';
import { EXTERNAL_SOURCE_LOAD_ORIGIN } from '@rudderstack/common/constants/htmlAttributes';

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

  it('should process error Event from SDK script loading as argument value', () => {
    const mockEvent = {
      target: {
        src: 'dummyUrl',
        id: 'dummyId',
        dataset: {
          appendOrigin: EXTERNAL_SOURCE_LOAD_ORIGIN,
        },
        localName: 'script',
      },
    };
    const msg = processError(mockEvent);
    expect(msg).toStrictEqual('Failed to load script from dummyUrl with id dummyId');
  });

  it('should ignore error Event from non SDK script loading as argument value', () => {
    const mockEvent = {
      target: {
        src: 'dummyUrl',
        id: 'dummyId',
        dataset: {},
        localName: 'script',
      },
    };
    const msg = processError(mockEvent);
    expect(msg).toStrictEqual('');
  });

  it('should ignore error Event from ad-blocked SDK script loading as argument value', () => {
    const mockEvent = {
      target: {
        src: 'dummyUrl',
        id: 'ad-block',
        dataset: {
          appendOrigin: EXTERNAL_SOURCE_LOAD_ORIGIN,
        },
        localName: 'script',
      },
    };
    const msg = processError(mockEvent);
    expect(msg).toStrictEqual('');
  });

  it('should process any other type of argument value', () => {
    const msg = processError({ foo: 'bar' });
    expect(msg).toStrictEqual('{"foo":"bar"}');
  });
});
