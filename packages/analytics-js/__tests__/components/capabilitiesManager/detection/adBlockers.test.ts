import { effect } from '@preact/signals-core';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';
import { detectAdBlockers } from '../../../../src/components/capabilitiesManager/detection/adBlockers';
import { state, resetState } from '../../../../src/state';

let errObj: any;
let xhrObj: any;

jest.mock('../../../../src/services/HttpClient/HttpClient', () => {
  const originalModule = jest.requireActual('../../../../src/services/HttpClient/HttpClient');

  return {
    __esModule: true,
    ...originalModule,
    HttpClient: jest.fn().mockImplementation(() => ({
      setAuthHeader: jest.fn(),
      init: jest.fn(),
      getAsyncData: jest.fn().mockImplementation(({ url, callback }) => {
        callback(undefined, {
          error: errObj,
          xhr: xhrObj,
        });
      }),
    })),
  };
});

describe('detectAdBlockers', () => {
  beforeEach(() => {
    resetState();
  });

  it('should detect adBlockers if the request is blocked', done => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';

    errObj = new Error('Request blocked');
    xhrObj = {
      responseURL: 'https://example.com/some/path/?view=ad',
    };

    detectAdBlockers(defaultErrorHandler);

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(true);
      done();
    });
  });

  it('should detect adBlockers if the request internally redirected', done => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';

    errObj = undefined;
    xhrObj = {
      responseURL: 'data:text/css;charset=UTF-8;base64,dGVtcA==',
    };

    detectAdBlockers(defaultErrorHandler);

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(true);
      done();
    });
  });

  it('should not detect adBlockers if the request is not blocked', done => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';

    errObj = undefined;
    xhrObj = {
      responseURL: 'https://example.com/some/path/?view=ad',
    };

    detectAdBlockers(defaultErrorHandler);

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(false);
      done();
    });
  });
});
