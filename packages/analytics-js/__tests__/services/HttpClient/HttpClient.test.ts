/* eslint-disable sonarjs/no-identical-functions */
import type { IResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { HttpClientError } from '../../../src/services/HttpClient/HttpClientError';
import { HttpClient } from '../../../src/services/HttpClient';
import { server } from '../../../__fixtures__/msw.server';
import { dummyDataplaneHost } from '../../../__fixtures__/fixtures';
import { defaultLogger } from '../../../__mocks__/Logger';

describe('HttpClient', () => {
  let clientInstance: HttpClient;

  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    clientInstance = new HttpClient(defaultLogger);
    clientInstance.setAuthHeader('dummyWriteKey');
  });

  afterEach(() => {
    server.resetHandlers();
    server.events.removeAllListeners();
  });

  afterAll(() => {
    server.close();
  });

  it('should send requests without authorization header if not set', done => {
    const callback = (response: any, details: IResponseDetails) => {
      expect(response).toBeUndefined();
      expect(details?.error?.status).toBe(401);
      done();
    };

    // `useAuth` option is not explicitly set here
    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/testAuthHeader`,
    });
  });

  it('should send requests with authorization header if set', done => {
    const callback = (response: any, details: IResponseDetails) => {
      expect(response).toEqual({ success: true });
      expect(details.error).toBeUndefined();
      done();
    };

    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/testAuthHeader`,
      options: {
        method: 'GET',
        useAuth: true,
        headers: {
          'Dummy-Header': 'dummyValue',
        },
      },
    });
  });

  it('should send requests with raw authorization header if set', done => {
    clientInstance.setAuthHeader('rawHeaderValue', true);

    const callback = (response: any, details: IResponseDetails) => {
      expect(response).toEqual({ success: true });
      expect(details.error).toBeUndefined();
      done();
    };

    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/testRawAuthHeader`,
      options: {
        method: 'GET',
        useAuth: true,
        timeout: undefined, // explicitly set to undefined to not configure any timeout
      },
    });
  });

  it('should send requests without authorization header if not reset', done => {
    // Reset the auth header which is set in the `beforeEach` block
    clientInstance.resetAuthHeader();

    const callback = (response: any, details: IResponseDetails) => {
      expect(response).toBeUndefined();
      expect(details?.error?.status).toBe(401);
      done();
    };

    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/testAuthHeader`,
      options: {
        method: 'GET',
        useAuth: true,
      },
    });
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
      options: {
        method: 'GET',
      },
    });
  });

  it('should request expecting json response', done => {
    const callback = (response: any, details: IResponseDetails) => {
      expect(response).toEqual({ raw: 'sample' });
      expect(details.error).toBeUndefined();
      done();
    };

    // `isRawResponse` option is not explicitly set here
    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/rawSample`,
      options: {
        method: 'GET',
      },
    });
  });

  it('should handle 400 range errors in request requests', done => {
    const callback = (response: any, details: IResponseDetails) => {
      expect(response).toBeUndefined();

      const errResult = new HttpClientError(
        'The request failed with status 404 (Not Found) for URL "https://dummy.dataplane.host.com/404ErrorSample"',
        {
          status: 404,
          statusText: 'Not Found',
        },
      );
      expect(details.error).toEqual(errResult);
      done();
    };

    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/404ErrorSample`,
      options: {
        method: 'GET',
      },
    });
  });

  it('should handle 500 range errors in request requests', done => {
    const callback = (response: any, details: IResponseDetails) => {
      expect(response).toBeUndefined();

      const errResult = new HttpClientError(
        'The request failed with status 500 (Internal Server Error) for URL "https://dummy.dataplane.host.com/500ErrorSample"',
        {
          status: 500,
          statusText: 'Internal Server Error',
        },
      );
      expect(details.error).toEqual(errResult);
      done();
    };
    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/500ErrorSample`,
      options: {
        method: 'GET',
      },
    });
  });

  it('should handle malformed json response when expecting json response', done => {
    const callback = (response: any, details: IResponseDetails) => {
      expect(response).toBeUndefined();

      const errResult = new HttpClientError(
        'Failed to parse response data for URL "https://dummy.dataplane.host.com/brokenJsonSample": Expected property name or \'}\' in JSON at position 1',
        {
          status: 200,
          statusText: 'OK',
          responseBody: '{raw: sample}',
        },
      );

      expect(details.error).toEqual(errResult);
      done();
    };

    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/brokenJsonSample`,
      options: {
        method: 'GET',
      },
    });
  });

  it('should handle empty response when expecting json response', done => {
    const callback = (response: any, details: IResponseDetails) => {
      expect(response).toBeUndefined();

      const errResult = new HttpClientError(
        'Failed to parse response data for URL "https://dummy.dataplane.host.com/emptyJsonSample": Unexpected end of JSON input',
        {
          status: 200,
          statusText: 'OK',
          responseBody: '',
        },
      );

      expect(details.error).toEqual(errResult);

      done();
    };

    // We're using the `getAsyncData` method here for code coverage
    // It is identical to the `request` method
    clientInstance.getAsyncData({
      callback,
      url: `${dummyDataplaneHost}/emptyJsonSample`,
      options: {
        method: 'GET',
      },
    });
  });

  it('should handle no connection error', done => {
    const callback = (response: any, details: IResponseDetails) => {
      expect(response).toBeUndefined();

      const errResult = new HttpClientError(
        'The request failed due to timeout after 10000ms or no connection or aborted for URL "https://dummy.dataplane.host.com/noConnectionSample": Failed to fetch',
      );

      expect(details.error).toEqual(errResult);
      done();
    };

    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/noConnectionSample`,
      options: {
        method: 'GET',
      },
    });
  });

  it('should handle request timeout error', done => {
    jest.useFakeTimers();

    const callback = (response: any, details: IResponseDetails) => {
      expect(response).toBeUndefined();

      const errResult = new HttpClientError(
        'The request failed due to timeout after 10000ms or no connection or aborted for URL "https://dummy.dataplane.host.com/delayedResponse": The operation was aborted.',
      );

      expect(details.error).toEqual(errResult);
      done();
    };

    clientInstance.request({
      callback,
      url: `${dummyDataplaneHost}/delayedResponse`,
      options: {
        method: 'GET',
      },
    });

    jest.advanceTimersByTime(10000);
    jest.useRealTimers();
  });
});
