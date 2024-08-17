import type { IResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { HttpClientError } from '../../../src/services/HttpClient/utils';
import { HttpClient } from '../../../src/services/HttpClient';
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
    clientInstance = new HttpClient('fetch', defaultLogger);
  });

  afterEach(() => {
    server.resetHandlers();
    server.events.removeAllListeners();
  });

  afterAll(() => {
    server.close();
  });

  it('should request expecting raw response', done => {
    const callback = (response: any) => {
      expect(response).toStrictEqual('{"raw": "sample"}');
      done();
    };
    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/rawSample`,
      isRawResponse: true,
    });
  });

  it('should request expecting json response', done => {
    const callback = (response: any) => {
      expect(response).toEqual({ raw: 'sample' });
      done();
    };
    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/rawSample`,
    });
  });

  it('should fire and forget request', async () => {
    const response = await clientInstance.request({
      url: `${dummyDataplaneHost}/rawSample`,
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

  it('should reset auth header', () => {
    clientInstance.setAuthHeader('dummyWriteKey', true);
    clientInstance.resetAuthHeader();
    expect(clientInstance.basicAuthHeader).toBeUndefined();
  });

  it('should request with auth header expecting json response', done => {
    const callback = (response: any) => {
      expect(response).toEqual({ raw: 'sample' });
      done();
    };
    clientInstance.setAuthHeader('dummyWriteKey');
    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/rawSample`,
    });
  });

  it('should handle 400 range errors in request requests', done => {
    const callback = (response: any, details: IResponseDetails) => {
      const errResult = new HttpClientError(
        'The request failed with status 404: Not Found (), for URL: https://dummy.dataplane.host.com/404ErrorSample.',
      );
      expect(details.error).toEqual(errResult);
      done();
    };
    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/404ErrorSample`,
    });
  });

  it('should handle 500 range errors in request requests', done => {
    const callback = (response: any, details: IResponseDetails) => {
      const errResult = new Error(
        'The request failed with status 500: Internal Server Error (), for URL: https://dummy.dataplane.host.com/500ErrorSample.',
      );
      expect(details.error).toEqual(errResult);
      done();
    };
    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/500ErrorSample`,
    });
  });

  it('should handle malformed json response when expecting json response', done => {
    const callback = (response: any) => {
      expect(response).toBeUndefined();
      done();
    };
    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/brokenJsonSample`,
    });
  });

  it('should handle empty response when expecting json response', done => {
    const callback = (response: any) => {
      expect(response).toBeUndefined();
      done();
    };
    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/emptyJsonSample`,
    });
  });

  it('should handle if input data contains non-stringifiable values', done => {
    const callback = (response: any) => {
      expect(response).toBeUndefined();
      done();
    };
    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/nonStringifiableDataSample`,
      options: {
        body: {
          a: 1,
          b: BigInt(1),
        },
      },
    });
  });
});
