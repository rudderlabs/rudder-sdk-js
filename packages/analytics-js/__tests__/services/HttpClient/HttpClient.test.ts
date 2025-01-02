import type { ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { HttpClient } from '../../../src/services/HttpClient';
import { defaultErrorHandler } from '../../../src/services/ErrorHandler';
import { defaultLogger } from '../../../src/services/Logger';
import { server } from '../../../__fixtures__/msw.server';
import { dummyDataplaneHost } from '../../../__fixtures__/fixtures';

jest.mock('../../../src/services/Logger', () => {
  const originalModule = jest.requireActual('../../../src/services/Logger');

  return {
    __esModule: true,
    ...originalModule,
    defaultLogger: {
      error: jest.fn((): void => {}),
      warn: jest.fn((): void => {}),
    },
  };
});

jest.mock('../../../src/services/ErrorHandler', () => {
  const originalModule = jest.requireActual('../../../src/services/ErrorHandler');

  return {
    __esModule: true,
    ...originalModule,
    defaultErrorHandler: {
      onError: jest.fn((): void => {}),
    },
  };
});

describe('HttpClient', () => {
  let clientInstance: HttpClient;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    clientInstance = new HttpClient(defaultLogger);
    clientInstance.init(defaultErrorHandler);
  });

  afterEach(() => {
    server.resetHandlers();
    server.events.removeAllListeners();
  });

  afterAll(() => {
    server.close();
  });

  it('should getData expecting raw response', async () => {
    const data = await clientInstance.getData({
      url: `${dummyDataplaneHost}/rawSample`,
      isRawResponse: true,
    });
    expect(data.data).toStrictEqual('{"raw": "sample"}');
  });

  it('should getData expecting json response', async () => {
    const data = await clientInstance.getData({
      url: `${dummyDataplaneHost}/jsonSample`,
    });
    expect(data.data).toStrictEqual({ json: 'sample' });
  });

  it('should getAsyncData expecting raw response', done => {
    const callback = (response: any) => {
      expect(response).toStrictEqual('{"raw": "sample"}');
      done();
    };
    clientInstance.getAsyncData({
      callback,
      url: `${dummyDataplaneHost}/rawSample`,
      isRawResponse: true,
    });
  });

  it('should getAsyncData expecting json response', done => {
    const callback = (response: any) => {
      expect(response).toStrictEqual({ json: 'sample' });
      done();
    };
    clientInstance.getAsyncData({
      callback,
      url: `${dummyDataplaneHost}/jsonSample`,
    });
  });

  it('should fire and forget getAsyncData', () => {
    const response = clientInstance.getAsyncData({
      url: `${dummyDataplaneHost}/jsonSample`,
    });
    expect(response).toBeUndefined();
  });

  it('should set auth header', () => {
    clientInstance.setAuthHeader('dummyWriteKey');
    expect(clientInstance.basicAuthHeader).toStrictEqual('Basic ZHVtbXlXcml0ZUtleTo=');
  });

  it('should set raw auth header', () => {
    clientInstance.setAuthHeader('dummyWriteKey', true);
    expect(clientInstance.basicAuthHeader).toStrictEqual('Basic dummyWriteKey');
  });

  it('should set auth header', () => {
    clientInstance.setAuthHeader('dummyWriteKey', true);
    clientInstance.resetAuthHeader();
    expect(clientInstance.basicAuthHeader).toBeUndefined();
  });

  it('should getAsyncData with auth header expecting json response', done => {
    const callback = (response: any) => {
      expect(response).toStrictEqual({ json: 'sample' });
      done();
    };
    clientInstance.setAuthHeader('dummyWriteKey');
    clientInstance.getAsyncData({
      callback,
      url: `${dummyDataplaneHost}/jsonSample`,
    });
  });

  it('should handle 400 range errors in getAsyncData requests', done => {
    const callback = (response: any, reject: ResponseDetails) => {
      const errResult = new Error(
        'The request failed with status: 404, Not Found for URL: https://dummy.dataplane.host.com/404ErrorSample.',
      );
      expect(reject.error).toEqual(errResult);
      expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
      expect(defaultErrorHandler.onError).toHaveBeenCalledWith(errResult, 'HttpClient');
      done();
    };
    clientInstance.getAsyncData({
      callback,
      url: `${dummyDataplaneHost}/404ErrorSample`,
    });
  });

  it('should handle 400 range errors in getData requests', async () => {
    const response = await clientInstance.getData({
      url: `${dummyDataplaneHost}/404ErrorSample`,
    });
    expect(response.data).toBeUndefined();
    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
      new Error(
        'The request failed with status: 404, Not Found for URL: https://dummy.dataplane.host.com/404ErrorSample.',
      ),
      'HttpClient',
    );
  });

  it('should handle 500 range errors in getAsyncData requests', done => {
    const callback = (response: any, reject: ResponseDetails) => {
      const errResult = new Error(
        'The request failed with status: 500, Internal Server Error for URL: https://dummy.dataplane.host.com/500ErrorSample.',
      );
      expect(reject.error).toEqual(errResult);
      expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
      expect(defaultErrorHandler.onError).toHaveBeenCalledWith(errResult, 'HttpClient');
      done();
    };
    clientInstance.getAsyncData({
      callback,
      url: `${dummyDataplaneHost}/500ErrorSample`,
    });
  });

  it('should handle 500 range errors in getData requests', async () => {
    const response = await clientInstance.getData({
      url: `${dummyDataplaneHost}/500ErrorSample`,
    });
    expect(response.data).toBeUndefined();
    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
      new Error(
        'The request failed with status: 500, Internal Server Error for URL: https://dummy.dataplane.host.com/500ErrorSample.',
      ),
      'HttpClient',
    );
  });

  it('should handle connection errors in getData requests', async () => {
    const response = await clientInstance.getData({
      url: `${dummyDataplaneHost}/noConnectionSample`,
    });
    expect(response.data).toBeUndefined();
    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
      new Error(
        'The request failed due to timeout or no connection (error) for URL: https://dummy.dataplane.host.com/noConnectionSample.',
      ),
      'HttpClient',
    );
  });

  it('should handle malformed json response when expecting json response', done => {
    const callback = (response: any) => {
      expect(response).toBeUndefined();
      expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
      expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
        new SyntaxError(
          "Failed to parse response data: Expected property name or '}' in JSON at position 1",
        ),
        'HttpClient',
      );
      done();
    };
    clientInstance.getAsyncData({
      callback,
      url: `${dummyDataplaneHost}/brokenJsonSample`,
    });
  });

  it('should handle empty response when expecting json response', done => {
    const callback = (response: any) => {
      expect(response).toBeUndefined();
      expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
      expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
        new Error('Failed to parse response data: Unexpected end of JSON input'),
        'HttpClient',
      );
      done();
    };
    clientInstance.getAsyncData({
      callback,
      url: `${dummyDataplaneHost}/emptyJsonSample`,
    });
  });

  it('should handle if input data contains non-stringifiable values', done => {
    const callback = (response: any) => {
      expect(response).toBeUndefined();
      expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
      expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
        new Error('Failed to prepare data for the request.'),
        'HttpClient',
      );
      done();
    };
    clientInstance.getAsyncData({
      callback,
      url: `${dummyDataplaneHost}/nonStringifiableDataSample`,
      options: {
        data: {
          a: 1,
          b: BigInt(1),
        },
      },
    });
  });
});
