import {
  isApiKeyValid,
  getGlobalBugsnagLibInstance,
  getReleaseStage,
  isValidVersion,
  isRudderSDKError,
  enhanceErrorEventMutator,
  initBugsnagClient,
} from '@rudderstack/analytics-js-plugins/bugsnag/utils';
import { signal } from '@preact/signals-core';
import * as bugsnagConstants from '@rudderstack/analytics-js-plugins/bugsnag/constants';
import { clone } from 'ramda';

describe('Bugsnag utilities', () => {
  describe('isApiKeyValid', () => {
    it('should return true for a valid API key', () => {
      const apiKey = '1234567890abcdef';
      expect(isApiKeyValid(apiKey)).toBe(true);
    });

    it('should return false for an invalid API key', () => {
      const apiKey = '{{invalid-api-key}}';
      expect(isApiKeyValid(apiKey)).toBe(false);
    });

    it('should return false for an invalid API key', () => {
      const apiKey = '';
      expect(isApiKeyValid(apiKey)).toBe(false);
    });
  });

  describe('getGlobalBugsnagLibInstance', () => {
    it('should return the global Bugsnag instance if defined on the window object', () => {
      const bsObj = {
        version: '1.2.3',
      };
      (window as any).bugsnag = bsObj;

      expect(getGlobalBugsnagLibInstance()).toBe(bsObj);

      delete (window as any).bugsnag;
    });

    it('should return undefined if the global Bugsnag instance is not defined on the window object', () => {
      expect(getGlobalBugsnagLibInstance()).toBe(undefined);
    });
  });

  describe('getReleaseStage', () => {
    let windowSpy: any;
    let documentSpy: any;
    let navigatorSpy: any;
    let locationSpy: any;

    beforeEach(() => {
      windowSpy = jest.spyOn(window, 'window', 'get');
      locationSpy = jest.spyOn(globalThis, 'location', 'get');
    });

    afterEach(() => {
      windowSpy.mockRestore();
      locationSpy.mockRestore();
    });

    const testCaseData = [
      ['localhost', 'development'],
      ['127.0.0.1', 'development'],
      ['www.test-host.com', 'development'],
      ['[::1]', 'development'],
      ['', '__RS_BUGSNAG_RELEASE_STAGE__'],
      ['www.validhost.com', '__RS_BUGSNAG_RELEASE_STAGE__'],
    ];

    it.each(testCaseData)(
      'if window host name is "%s" then it should return the release stage as "%s" ',
      (hostName, expectedReleaseStage) => {
        locationSpy.mockImplementation(() => ({
          hostname: hostName,
        }));

        expect(getReleaseStage()).toBe(expectedReleaseStage);
      },
    );
  });

  describe('isValidVersion', () => {
    it('should return true if bugsnag version 6 is present in window scope', () => {
      (window as any).bugsnag = jest.fn(() => ({ notifier: { version: '6.0.0' } }));

      expect(isValidVersion((window as any).bugsnag)).toBe(true);

      delete (window as any).bugsnag;
    });

    it('should return false if bugsnag version 7 is present in window scope', () => {
      (window as any).bugsnag = { _client: { _notifier: { version: '7.0.0' } } };

      expect(isValidVersion((window as any).bugsnag)).toBe(false);

      delete (window as any).bugsnag;
    });

    it('should return false if bugsnag version 4 is present in window scope', () => {
      (window as any).bugsnag = jest.fn(() => ({ notifier: { version: '4.0.0' } }));

      expect(isValidVersion((window as any).bugsnag)).toBe(false);

      delete (window as any).bugsnag;
    });
  });

  describe('isRudderSDKError', () => {
    const testCaseData = [
      ['https://testdomain.com/rudder-analytics.min.js', true],
      ['https://testdomain.com/rudderanalytics.min.js', false],
      ['https://testdomain.com/rudder-analytics-plugins-Beacon.min.js', true],
      ['https://testdomain.com/Amplitude.min.js', true],
      ['https://testdomain.com/Qualaroo.min.js', true],
      ['https://testdomain.com/test.js', false],
      ['https://testdomain.com/rudder-analytics.css', false],
      [undefined, false],
      [null, false],
      [1, false],
      ['', false],
      ['testdomain.com', false],
    ];

    it.each(testCaseData)(
      'if script src is "%s" then it should return the value as "%s" ',
      (scriptSrc, expectedValue) => {
        // Bugsnag error event object structure
        const event = {
          stacktrace: [
            {
              file: scriptSrc,
            },
          ],
        };

        expect(isRudderSDKError(event)).toBe(expectedValue);
      },
    );
  });

  describe('enhanceErrorEventMutator', () => {
    it('should return the enhanced error event object', () => {
      const event = {
        metadata: {},
        stacktrace: [
          {
            file: 'https://testdomain.com/rudder-analytics.min.js',
          },
        ],
        updateMetaData: function (key, value) {
          this.metadata[key] = value;
        },
        errorMessage: 'test error message',
      };

      enhanceErrorEventMutator(event, 'dummyMetadataVal');

      expect(event.metadata).toEqual({
        source: {
          metadataSource: 'dummyMetadataVal',
        },
      });

      expect(event.context).toBe('test error message');
      expect(event.severity).toBe('error');
    });

    it('should return the enhanced error event object if the error is for script loads', () => {
      const event = {
        metadata: {},
        stacktrace: [
          {
            file: 'https://testdomain.com/rudder-analytics.min.js',
          },
        ],
        updateMetaData: function (key, value) {
          this.metadata[key] = value;
        },
        errorMessage: 'error in script loading "https://testdomain.com/rudder-analytics.min.js"',
      };

      enhanceErrorEventMutator(event, 'dummyMetadataVal');

      expect(event.metadata).toEqual({
        source: {
          metadataSource: 'dummyMetadataVal',
        },
      });

      expect(event.context).toBe('Script load failures');
      expect(event.severity).toBe('error');
    });
  });

  describe('initBugsnagClient', () => {
    const state = {
      source: signal({
        id: 'dummy-source-id',
      }),
    };

    const origSdkMaxWait = bugsnagConstants.MAX_WAIT_FOR_SDK_LOAD_MS;

    const mountBugsnagSDK = () => {
      (window as any).bugsnag = jest.fn(() => ({ notifier: { version: '6.0.0' } }));
    };

    afterEach(() => {
      delete (window as any).bugsnag;
      bugsnagConstants.MAX_WAIT_FOR_SDK_LOAD_MS = origSdkMaxWait;
    });

    it('should resolve the promise immediately if the bugsnag SDK is already loaded', async () => {
      mountBugsnagSDK();

      const bsClient = await new Promise((resolve, reject) => {
        initBugsnagClient(state, resolve, reject);
      });

      expect(bsClient).toBeDefined();
    });

    it('should resolve the promise after some time when the bugsnag SDK is loaded', async () => {
      setTimeout(() => {
        mountBugsnagSDK();
      }, 1000);

      const bsClientPromise = new Promise((resolve, reject) => {
        initBugsnagClient(state, resolve, reject);
      });

      const bsClient = await bsClientPromise;

      expect(bsClient).toBeDefined();
    });

    it('should reject the promise if the Bugsnag SDK is not loaded', async () => {
      bugsnagConstants.MAX_WAIT_FOR_SDK_LOAD_MS = 1000;

      const bsClientPromise = new Promise((resolve, reject) => {
        initBugsnagClient(state, resolve, reject);
      });

      await expect(bsClientPromise).rejects.toThrow('Bugsnag SDK load timed out.');
    });
  });
});
