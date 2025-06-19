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
    setTimeout(() => {
      callback(undefined, {
        error: errObj,
        xhr: xhrObj,
      });
    }, 10);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set detection in progress when starting detection', () => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';

    // Verify initial state
    expect(state.capabilities.isAdBlockerDetectionInProgress.value).toBe(false);

    detectAdBlockers(defaultHttpClient);

    // Verify detection in progress is set immediately
    expect(state.capabilities.isAdBlockerDetectionInProgress.value).toBe(true);
  });

  it('should clear detection in progress when detection completes (no ad blocker)', done => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';

    errObj = undefined;
    xhrObj = {
      responseURL: 'https://example.com/some/path/?view=ad',
    } as unknown as XMLHttpRequest;

    detectAdBlockers(defaultHttpClient);

    effect(() => {
      if (state.capabilities.isAdBlocked.value !== undefined) {
        expect(state.capabilities.isAdBlocked.value).toBe(false);
        expect(state.capabilities.isAdBlockerDetectionInProgress.value).toBe(false);
        done();
      }
    });
  });

  it('should clear detection in progress when detection completes (ad blocker detected)', done => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';

    errObj = new Error('Request blocked');
    xhrObj = {
      responseURL: 'https://example.com/some/path/?view=ad',
    } as unknown as XMLHttpRequest;

    detectAdBlockers(defaultHttpClient);

    effect(() => {
      if (state.capabilities.isAdBlocked.value !== undefined) {
        expect(state.capabilities.isAdBlocked.value).toBe(true);
        expect(state.capabilities.isAdBlockerDetectionInProgress.value).toBe(false);
        done();
      }
    });
  });

  it('should clear detection in progress when detection completes (internal redirect)', done => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';

    errObj = undefined;
    xhrObj = {
      responseURL: 'data:text/css;charset=UTF-8;base64,dGVtcA==',
    } as unknown as XMLHttpRequest;

    detectAdBlockers(defaultHttpClient);

    effect(() => {
      if (state.capabilities.isAdBlocked.value !== undefined) {
        expect(state.capabilities.isAdBlocked.value).toBe(true);
        expect(state.capabilities.isAdBlockerDetectionInProgress.value).toBe(false);
        done();
      }
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
      if (state.capabilities.isAdBlocked.value !== undefined) {
        expect(state.capabilities.isAdBlocked.value).toBe(true);
        done();
      }
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
      if (state.capabilities.isAdBlocked.value !== undefined) {
        expect(state.capabilities.isAdBlocked.value).toBe(true);
        done();
      }
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
      if (state.capabilities.isAdBlocked.value !== undefined) {
        expect(state.capabilities.isAdBlocked.value).toBe(false);
        done();
      }
    });
  });

  it('should handle multiple simultaneous detection requests properly', () => {
    state.lifecycle.sourceConfigUrl.value = 'https://example.com/some/path/';

    // First detection call
    detectAdBlockers(defaultHttpClient);
    expect(state.capabilities.isAdBlockerDetectionInProgress.value).toBe(true);
    expect(defaultHttpClient.getAsyncData).toHaveBeenCalledTimes(1);

    // Second detection call while first is in progress
    detectAdBlockers(defaultHttpClient);
    expect(state.capabilities.isAdBlockerDetectionInProgress.value).toBe(true);
    // Should still be called twice (current implementation doesn't prevent concurrent calls)
    // This documents the current behavior - if prevention is needed, implementation should be updated
    expect(defaultHttpClient.getAsyncData).toHaveBeenCalledTimes(2);
  });

  describe('request configuration', () => {
    it('should use correct URL with view=ad query parameter', () => {
      state.lifecycle.sourceConfigUrl.value = 'https://api.rudderstack.com/sourceConfig';

      detectAdBlockers(defaultHttpClient);

      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://api.rudderstack.com/sourceConfig?view=ad',
          options: expect.objectContaining({
            method: 'HEAD',
            headers: {
              'Content-Type': undefined,
            },
          }),
          isRawResponse: true,
        }),
      );
    });

    it('should preserve complex source config URLs', () => {
      state.lifecycle.sourceConfigUrl.value =
        'https://custom.dataplane.com/v1/sourceConfig?writeKey=test&extra=param';

      detectAdBlockers(defaultHttpClient);

      expect(defaultHttpClient.getAsyncData).toHaveBeenCalledWith(
        expect.objectContaining({
          url: 'https://custom.dataplane.com/v1/sourceConfig?view=ad',
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should reset detection flag and re-throw error when an exception occurs', () => {
      state.lifecycle.sourceConfigUrl.value = 'https://api.rudderstack.com/sourceConfig';

      // Mock httpClient to throw an error
      const mockGetAsyncData = jest.fn().mockImplementation(() => {
        throw new Error('HTTP client error');
      });
      const mockHttpClient = { getAsyncData: mockGetAsyncData };

      // Verify initial state
      expect(state.capabilities.isAdBlockerDetectionInProgress.value).toBe(false);

      // Should throw an error and reset the flag
      expect(() => detectAdBlockers(mockHttpClient as any)).toThrow('HTTP client error');
      expect(state.capabilities.isAdBlockerDetectionInProgress.value).toBe(false);
    });
  });
});
