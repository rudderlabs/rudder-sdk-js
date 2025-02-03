import { effect } from '@preact/signals-core';
import { detectAdBlockers } from '../../../../src/components/capabilitiesManager/detection/adBlockers';
import { state, resetState } from '../../../../src/state';
import { defaultHttpClient } from '../../../../src/services/HttpClient';

describe('detectAdBlockers', () => {
  beforeEach(() => {
    resetState();
  });

  let errObj: Error | undefined;
  let xhrObj: XMLHttpRequest;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultHttpClient.getAsyncData = jest.fn().mockImplementation(({ callback, ...rest }) => {
    callback(undefined, {
      error: errObj,
      xhr: xhrObj,
    });
  });

  it('should detect adBlockers if the request is blocked', done => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';

    errObj = new Error('Request blocked');
    xhrObj = {
      responseURL: 'https://example.com/some/path/?view=ad',
    } as unknown as XMLHttpRequest;

    detectAdBlockers(defaultHttpClient);

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
    } as unknown as XMLHttpRequest;

    detectAdBlockers(defaultHttpClient);

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
    } as unknown as XMLHttpRequest;

    detectAdBlockers(defaultHttpClient);

    effect(() => {
      expect(state.capabilities.isAdBlocked.value).toBe(false);
      done();
    });
  });
});
