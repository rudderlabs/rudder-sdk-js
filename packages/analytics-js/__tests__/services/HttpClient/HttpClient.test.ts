import { HttpClient } from '@rudderstack/analytics-js/services/HttpClient';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { server } from '../../../__mocks__/msw.server';
import { dummyDataplaneHost } from '../../../__mocks__/fixtures';

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
    clientInstance = new HttpClient(defaultErrorHandler, defaultLogger);
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
    expect(data).toStrictEqual('{"raw": "sample"}');
  });

  it('should getData expecting json response', async () => {
    const data = await clientInstance.getData({
      url: `${dummyDataplaneHost}/jsonSample`,
    });
    expect(data).toStrictEqual({ json: 'sample' });
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

  it('should fire and forget getAsyncData', async () => {
    const response = await clientInstance.getAsyncData({
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
    const callback = (response: any) => {
      expect(response).toBeUndefined();
      expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
      expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
        new Error(
          'Request failed with status: 404, Not Found for URL: https://dummy.dataplane.host.com/404ErrorSample',
        ),
        'HttpClient',
      );
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
    expect(response).toBeUndefined();
    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
      new Error(
        'Request failed with status: 404, Not Found for URL: https://dummy.dataplane.host.com/404ErrorSample',
      ),
      'HttpClient',
    );
  });

  it('should handle 500 range errors in getAsyncData requests', done => {
    const callback = (response: any) => {
      expect(response).toBeUndefined();
      expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
      expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
        new Error(
          'Request failed with status: 500, Internal Server Error for URL: https://dummy.dataplane.host.com/500ErrorSample',
        ),
        'HttpClient',
      );
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
    expect(response).toBeUndefined();
    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
      new Error(
        'Request failed with status: 500, Internal Server Error for URL: https://dummy.dataplane.host.com/500ErrorSample',
      ),
      'HttpClient',
    );
  });

  it('should handle connection errors in getData requests', async () => {
    const response = await clientInstance.getData({
      url: `${dummyDataplaneHost}/noConnectionSample`,
    });
    expect(response).toBeUndefined();
    expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
    expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
      new Error(
        'Request failed due to timeout or no connection, error for URL: https://dummy.dataplane.host.com/noConnectionSample',
      ),
      'HttpClient',
    );
  });

  it('should handle malformed json response when expecting json response', done => {
    const callback = (response: any) => {
      expect(response).toBeUndefined();
      expect(defaultErrorHandler.onError).toHaveBeenCalledTimes(1);
      expect(defaultErrorHandler.onError).toHaveBeenCalledWith(
        new Error('Response data parsing failed, Unexpected token r in JSON at position 1'),
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
        new Error('Response data parsing failed, Unexpected end of JSON input'),
        'HttpClient',
      );
      done();
    };
    clientInstance.getAsyncData({
      callback,
      url: `${dummyDataplaneHost}/emptyJsonSample`,
    });
  });
});
