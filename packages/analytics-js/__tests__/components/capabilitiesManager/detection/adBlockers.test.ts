import { effect } from '@preact/signals-core';
import { detectAdBlockers } from '../../../../src/components/capabilitiesManager/detection/adBlockers';
import { state, resetState } from '../../../../src/state';
import { HttpClientError } from '../../../../src/services/HttpClient/utils';

describe('detectAdBlockers', () => {
  let errObj;
  let responseObj;

  const mockHttpClient = {
    setAuthHeader: jest.fn(),
    request: jest.fn().mockImplementation(({ callback }) => {
      callback(undefined, {
        error: errObj,
        response: responseObj,
      });
    }),
  };

  beforeEach(() => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';
  });

  afterEach(() => {
    resetState();
  });

  it('should detect adBlockers if the request is blocked', done => {
    errObj = new HttpClientError('Request blocked');
    responseObj = {
      redirected: false,
    };

    detectAdBlockers(mockHttpClient);

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(true);
      done();
    });
  });

  it('should detect adBlockers if the request internally redirected', done => {
    errObj = undefined;
    responseObj = {
      redirected: true,
    };

    detectAdBlockers(mockHttpClient);

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(true);
      done();
    });
  });

  it('should not detect adBlockers if the request is not blocked', done => {
    errObj = undefined;
    responseObj = {
      redirected: false,
    };

    detectAdBlockers(mockHttpClient);

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(false);
      done();
    });
  });
});
