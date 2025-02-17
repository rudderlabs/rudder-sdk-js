import { effect } from '@preact/signals-core';
import { defaultHttpClient } from '@rudderstack/analytics-js-common/__mocks__/HttpClient';
import { HttpClientError } from '@rudderstack/analytics-js-common/services/HttpClientError';
import type { ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { detectAdBlockers } from '../../../../src/components/capabilitiesManager/detection/adBlockers';
import { state, resetState } from '../../../../src/state';

describe('detectAdBlockers', () => {
  beforeEach(() => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';
  });

  afterEach(() => {
    resetState();
  });

  let errObj: Error | undefined;
  let responseObj: ResponseDetails | undefined;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultHttpClient.request = jest.fn().mockImplementation(({ callback }) => {
    callback(undefined, {
      error: errObj,
      response: responseObj,
    });
  });

  it('should detect adBlockers if the request is blocked', done => {
    errObj = new HttpClientError('Request blocked');
    responseObj = {
      redirected: false,
    } as unknown as ResponseDetails;

    detectAdBlockers(defaultHttpClient);

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(true);
      done();
    });
  });

  it('should detect adBlockers if the request internally redirected', done => {
    errObj = undefined;
    responseObj = {
      redirected: true,
    } as unknown as ResponseDetails;

    detectAdBlockers(defaultHttpClient);

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(true);
      done();
    });
  });

  it('should not detect adBlockers if the request is not blocked', done => {
    errObj = undefined;
    responseObj = {
      redirected: false,
    } as unknown as ResponseDetails;

    detectAdBlockers(defaultHttpClient);

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(false);
      done();
    });
  });
});
