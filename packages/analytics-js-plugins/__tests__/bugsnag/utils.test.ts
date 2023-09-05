/* eslint-disable max-classes-per-file */
import { signal } from '@preact/signals-core';
import { ExternalSrcLoader } from '@rudderstack/analytics-js-common/services/ExternalSrcLoader';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import * as bugsnagConstants from '../../src/bugsnag/constants';
import {
  isApiKeyValid,
  getGlobalBugsnagLibInstance,
  getReleaseStage,
  isValidVersion,
  isRudderSDKError,
  enhanceErrorEventMutator,
  initBugsnagClient,
  loadBugsnagSDK,
  onError,
  getAppStateForMetadata,
} from '../../src/bugsnag/utils';

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
      ['https://invalid-domain.com/rsa.min.js', true],
      ['https://invalid-domain.com/rss.min.js', false],
      ['https://invalid-domain.com/rsa-plugins-Beacon.min.js', true],
      ['https://invalid-domain.com/Amplitude.min.js', false],
      ['https://invalid-domain.com/js-integrations/Amplitude.min.js', true],
      ['https://invalid-domain.com/js-integrations/Qualaroo.min.js', true],
      ['https://invalid-domain.com/test.js', false],
      ['https://invalid-domain.com/rsa.css', false],
      [undefined, false],
      [null, false],
      [1, false],
      ['', false],
      ['asdf.com', false],
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
            file: 'https://invalid-domain.com/rsa.min.js',
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
            file: 'https://invalid-domain.com/rsa.min.js',
          },
        ],
        updateMetaData: function (key, value) {
          this.metadata[key] = value;
        },
        errorMessage: 'error in script loading "https://invalid-domain.com/rsa.min.js"',
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
      lifecycle: {
        writeKey: signal('dummy-write-key'),
      },
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

      await expect(bsClientPromise).rejects.toThrow(
        'A timeout 1000 ms occurred while trying to load the Bugsnag SDK.',
      );
    });
  });

  describe('loadBugsnagSDK', () => {
    let insertBeforeSpy: any;

    class MockLogger implements ILogger {
      warn = jest.fn();
      log = jest.fn();
      error = jest.fn();
      info = jest.fn();
      debug = jest.fn();
      minLogLevel = 0;
      scope = 'test scope';
      setMinLogLevel = jest.fn();
      setScope = jest.fn();
      logProvider = console;
    }

    class MockErrorHandler implements IErrorHandler {
      init = jest.fn();
      onError = jest.fn();
      leaveBreadcrumb = jest.fn();
      notifyError = jest.fn();
    }

    const mockLogger = new MockLogger();
    const mockErrorHandler = new MockErrorHandler();
    const extSrcLoader = new ExternalSrcLoader(mockErrorHandler, mockLogger);

    const origBugsnagUrl = bugsnagConstants.BUGSNAG_CDN_URL;

    beforeEach(() => {
      insertBeforeSpy = jest.spyOn(document.head, 'insertBefore');
    });

    afterEach(() => {
      insertBeforeSpy.mockRestore();
      if (document.head.firstChild) {
        document.head.removeChild(document.head.firstChild as ChildNode);
      }
      delete (window as any).Bugsnag;
      delete (window as any).bugsnag;
      bugsnagConstants.BUGSNAG_CDN_URL = origBugsnagUrl;
    });

    it('should not load Bugsnag SDK if it (<=v6) is already loaded', () => {
      (window as any).bugsnag = jest.fn(() => ({ notifier: { version: '6.0.0' } }));

      loadBugsnagSDK();

      expect(insertBeforeSpy).not.toHaveBeenCalled();
    });

    it('should not load Bugsnag SDK if it (>v6) is already loaded', () => {
      (window as any).Bugsnag = { _client: { _notifier: { version: '7.0.0' } } };

      loadBugsnagSDK();

      expect(insertBeforeSpy).not.toHaveBeenCalled();
    });

    it('should attempt to load Bugsnag SDK if not already loaded', done => {
      loadBugsnagSDK(extSrcLoader, undefined);

      setTimeout(() => {
        expect(insertBeforeSpy).toHaveBeenCalled();
        done();
      }, 500);
    });

    it('should invoke error handler and log error if Bugsnag SDK could not be loaded', done => {
      bugsnagConstants.BUGSNAG_CDN_URL = 'https://asdf.com/bugsnag.min.js';
      loadBugsnagSDK(extSrcLoader, mockLogger);

      setTimeout(() => {
        expect(mockErrorHandler.onError).toHaveBeenCalledWith(
          new Error(
            `Failed to load the script with the id "rs-bugsnag" from URL "https://asdf.com/bugsnag.min.js".`,
          ),
          'ExternalSrcLoader',
        );
        expect(mockLogger.error).toHaveBeenCalledWith(
          `BugsnagPlugin:: Failed to load the Bugsnag SDK.`,
        );
        done();
      }, 2000);
    });
  });

  describe('onError', () => {
    const state = {
      source: signal({
        id: 'dummy-source-id',
      }),
    };

    it('should return a function', () => {
      expect(typeof onError(state)).toBe('function');
    });

    it('should return a function that returns false if the error is not from RudderStack SDK', () => {
      const error = {
        stacktrace: [
          {
            file: 'https://invalid-domain.com/not-rsa.min.js',
          },
        ],
      };

      const onErrorFn = onError(state);

      expect(onErrorFn(error)).toBe(false);
    });

    it('should return a function that returns true and enhances the error event if the error is from RudderStack SDK', () => {
      const error = {
        stacktrace: [
          {
            file: 'https://invalid-domain.com/rsa.min.js',
          },
        ],
        errorMessage: 'error in script loading "https://invalid-domain.com/rsa.min.js"',
        updateMetaData: jest.fn(),
      } as any;

      const onErrorFn = onError(state);

      expect(onErrorFn(error)).toBe(true);
      expect(error.updateMetaData).toHaveBeenCalledWith('source', {
        metadataSource: 'dummy-source-id',
      });
      expect(error.severity).toBe('error');
      expect(error.context).toBe('Script load failures');
    });

    it('should return a function that returns false if processing the event results in any unhandled exception', () => {
      // Not defining `updateMetaData` on the error object to simulate an unhandled exception
      const error = {
        stacktrace: [
          {
            file: 'https://invalid-domain.com/rsa.min.js',
          },
        ],
        errorMessage: 'error in script loading "https://invalid-domain.com/rsa.min.js"',
      } as any;

      const onErrorFn = onError(state);

      expect(onErrorFn(error)).toBe(false);
    });
  });

  describe('getAppStateForMetadata', () => {
    const origAppStateExcludes = bugsnagConstants.APP_STATE_EXCLUDE_KEYS;

    beforeEach(() => {
      bugsnagConstants.APP_STATE_EXCLUDE_KEYS = origAppStateExcludes;
    });

    // Here we are just exploring different combinations of data where
    // the signals could be buried inside objects, arrays, nested objects, etc.
    const tcData = [
      [
        {
          name: 'test',
          value: 123,
          someKey1: [1, 2, 3],
          someKey2: {
            key1: 'value1',
            key2: 'value2',
          },
          someKey3: 2.5,
          testSignal: signal('test'),
        },
        {
          name: 'test',
          value: 123,
          someKey1: [1, 2, 3],
          someKey2: {
            key1: 'value1',
            key2: 'value2',
          },
          someKey3: 2.5,
          testSignal: 'test',
        },
        undefined,
      ],
      [
        {
          name: 'test',
          someKey: {
            key1: 'value1',
            key2: signal('value2'),
          },
          someKey2: {
            key1: 'value1',
            key2: {
              key3: signal('value3'),
            },
          },
          someKey3: [signal('value1'), signal('value2'), 1, 3],
          someKey4: [
            {
              key1: signal('value1'),
              key2: signal('value2'),
            },
            'asdf',
            1,
            {
              key3: 'value3',
              key4: 'value4',
            },
          ],
        },
        {
          name: 'test',
          someKey: {
            key1: 'value1',
            key2: 'value2',
          },
          someKey2: {
            key1: 'value1',
            key2: {
              key3: 'value3',
            },
          },
          someKey3: ['value1', 'value2', 1, 3],
          someKey4: [
            {
              key1: 'value1',
              key2: 'value2',
            },
            'asdf',
            1,
            {
              key3: 'value3',
              key4: 'value4',
            },
          ],
        },
        [],
      ],
      [
        {
          someKey: signal({
            key1: 'value1',
            key2: signal('value2'),
            key3: [signal('value1'), signal('value2'), undefined, null],
            key4: true,
            key7: {
              key1: signal('value1'),
              key2: signal('value2'),
              key3: 'asdf',
              key4: signal('value4'),
            },
            key5: signal([signal('value1'), signal('value2'), 1, 3]),
            KEY6: 123,
          }),
        },
        {
          someKey: {
            key1: 'value1',
            key2: 'value2',
            key3: ['value1', 'value2', null, null],
            key7: {
              key1: 'value1',
              key2: 'value2',
              key3: 'asdf',
            },
            key5: ['value1', 'value2', 1, 3],
            KEY6: 123,
          },
        },
        ['key4', 'key6'], // excluded keys
      ],
      [
        {
          someKey: BigInt(123),
        },
        undefined,
        [],
      ],
    ];

    it.each(tcData)('should convert signals to JSON %#', (input, expected, excludes) => {
      bugsnagConstants.APP_STATE_EXCLUDE_KEYS = excludes;
      expect(getAppStateForMetadata(input)).toEqual(expected);
    });
  });
});
