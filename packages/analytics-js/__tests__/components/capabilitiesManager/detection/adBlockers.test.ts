import { effect } from '@preact/signals-core';
import { detectAdBlockers } from '../../../../src/components/capabilitiesManager/detection/adBlockers';
import { state, resetState } from '../../../../src/state';

let errObj;
let responseObj;

jest.mock('../../../../src/services/HttpClient/HttpClient', () => {
  const originalModule = jest.requireActual('../../../../src/services/HttpClient/HttpClient');

  return {
    __esModule: true,
    ...originalModule,
    HttpClient: jest.fn().mockImplementation(() => ({
      setAuthHeader: jest.fn(),
      request: jest.fn().mockImplementation(({ url, callback }) => {
        callback(undefined, {
          error: errObj,
          response: responseObj,
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
    responseObj = {
      redirected: false,
    };

    detectAdBlockers();

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(true);
      done();
    });
  });

  it('should detect adBlockers if the request internally redirected', done => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';

    errObj = undefined;
    responseObj = {
      redirected: true,
    };

    detectAdBlockers();

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(true);
      done();
    });
  });

  it('should not detect adBlockers if the request is not blocked', done => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';

    errObj = undefined;
    responseObj = {
      redirected: false,
    };

    detectAdBlockers();

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(false);
      done();
    });
  });
});
