/* eslint-disable max-classes-per-file */
import { signal } from '@preact/signals-core';
import { ErrorFormat } from '../../src/errorReporting/event/event';
import * as errorReportingConstants from '../../src/errorReporting/constants';
import {
  getReleaseStage,
  isRudderSDKError,
  getAppStateForMetadata,
  getErrorContext,
  createNewBreadCrumb,
  getURLWithoutSearchParam,
  enhanceErrorEvent,
  getErrorDeliveryPayload,
} from '../../src/errorReporting/utils';

jest.mock('@rudderstack/analytics-js-common/utilities/uuId', () => ({
  generateUUID: jest.fn().mockReturnValue('test_uuid'),
}));

describe('Error Reporting utilities', () => {
  describe('createNewBreadCrumb', () => {
    it('should create and return a breadcrumb ', () => {
      const msg = 'sample message';
      const breadcrumb = createNewBreadCrumb(msg);

      expect(breadcrumb).toStrictEqual({
        metaData: {},
        type: 'manual',
        timestamp: expect.any(Date),
        name: msg,
      });
    });
  });

  describe('getURLWithoutSearchParam', () => {
    it('should return url without query param ', () => {
      (window as any).location.href = 'http://www.test-host.com?key1=1234&key2=true';
      const urlWithoutSearchParam = getURLWithoutSearchParam();
      expect(urlWithoutSearchParam).toEqual('http://www.test-host.com/');
    });
  });
  describe('getReleaseStage', () => {
    let windowSpy: any;
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

  describe('isRudderSDKError', () => {
    const newError = new Error('ReferenceError: testUndefinedFn is not defined');

    it('should return true if error generate from sdk', () => {
      const normalizedError = Object.create(newError, {
        stack: {
          value: `ReferenceError: testUndefinedFn is not defined at Analytics.page (http://localhost:3001/cdn/modern/iife/rsa.js:1610:3) at RudderAnalytics.page (http://localhost:3001/cdn/modern/iife/rsa.js:1666:84)`,
        },
      });
      expect(isRudderSDKError(normalizedError)).toBe(true);
    });
    it('should return false if error generate from sdk', () => {
      const normalizedError = Object.create(newError, {
        stack: {
          value: `ReferenceError: testUndefinedFn is not defined at Analytics.page (http://localhost:3001/cdn/modern/iife/abc.js:1610:3) at RudderAnalytics.page (http://localhost:3001/cdn/modern/iife/abc.js:1666:84)`,
        },
      });
      expect(isRudderSDKError(normalizedError)).toBe(false);
    });
    it('should return true if error generate from integration sdk', () => {
      const normalizedError = Object.create(newError, {
        stack: {
          value: `ReferenceError: testUndefinedFn is not defined at Analytics.page (http://localhost:3001/cdn/modern/js-integrations/abc.js:1610:3) at RudderAnalytics.page (http://localhost:3001/cdn/modern/js-integrations/abc.js:1666:84)`,
        },
      });
      expect(isRudderSDKError(normalizedError)).toBe(true);
    });
    it('should return false if error generate from integration sdk', () => {
      const normalizedError = Object.create(newError, {
        stack: {
          value: `ReferenceError: testUndefinedFn is not defined at Analytics.page (http://localhost:3001/cdn/modern/abc.js:1610:3) at RudderAnalytics.page (http://localhost:3001/cdn/modern/abc.js:1666:84)`,
        },
      });
      expect(isRudderSDKError(normalizedError)).toBe(false);
    });
  });

  describe('getErrorContext', () => {
    it('should return error context', () => {
      const event = {
        metadata: {},
        stacktrace: [
          {
            file: 'https://invalid-domain.com/rsa.min.js',
          },
        ],
        message: 'test error message',
      };

      const context = getErrorContext(event);

      expect(context).toBe('test error message');
    });

    it('should return the enhanced error event object if the error is for script loads', () => {
      const event = {
        metadata: {},
        stacktrace: [
          {
            file: 'https://invalid-domain.com/rsa.min.js',
          },
        ],
        message: 'Error in loading a third-party script "https://invalid-domain.com/rsa.min.js"',
      };

      const context = getErrorContext(event);

      expect(context).toBe('Script load failures');
    });
  });

  describe('getAppStateForMetadata', () => {
    const origAppStateExcludes = errorReportingConstants.APP_STATE_EXCLUDE_KEYS;

    beforeEach(() => {
      errorReportingConstants.APP_STATE_EXCLUDE_KEYS = origAppStateExcludes;
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
        {},
        [],
      ],
    ];

    it.each(tcData)('should convert signals to JSON %#', (input, expected, excludes) => {
      errorReportingConstants.APP_STATE_EXCLUDE_KEYS = excludes;
      expect(getAppStateForMetadata(input)).toEqual(expected);
    });
  });

  describe('enhanceErrorEvent', () => {
    it('should return enhanced error event payload', () => {
      const newError = new Error();
      const normalizedError = Object.create(newError, {
        message: { value: 'ReferenceError: testUndefinedFn is not defined' },
        stack: {
          value: `ReferenceError: testUndefinedFn is not defined at Analytics.page (http://localhost:3001/cdn/modern/iife/rsa.js:1610:3) at RudderAnalytics.page (http://localhost:3001/cdn/modern/iife/rsa.js:1666:84)`,
        },
      });
      const errorState = {
        severity: 'error',
        unhandled: false,
        severityReason: { type: 'handledException' },
      };
      const errorPayload = ErrorFormat.create(normalizedError, true, errorState, 'notify()', 2);

      const appState = {
        context: {
          locale: signal('en-GB'),
          userAgent: signal('sample user agent'),
          app: signal({ version: 'sample_version' }),
        },
        lifecycle: {
          writeKey: signal('sample-write-key'),
        },
        reporting: {
          breadCrumbs: signal([]),
        },
        source: signal({ id: 'sample_source_id' }),
      };
      (window as any).RudderSnippetVersion = 'sample_snippet_version';
      const enhancedError = enhanceErrorEvent(errorPayload, errorState, appState);
      console.log(JSON.stringify(enhancedError));
      const expectedOutcome = {
        notifier: {
          name: 'RudderStack JavaScript SDK Error Notifier',
          version: '__PACKAGE_VERSION__',
          url: 'https://github.com/rudderlabs/rudder-sdk-js',
        },
        events: [
          {
            payloadVersion: '5',
            exceptions: [
              {
                errorClass: 'Error',
                message: 'ReferenceError: testUndefinedFn is not defined',
                type: 'browserjs',
                stacktrace: [
                  {
                    file: 'ReferenceError: testUndefinedFn is not defined at Analytics.page http://localhost:3001/cdn/modern/iife/rsa.js:1610:3 at RudderAnalytics.page http://localhost:3001/cdn/modern/iife/rsa.js',
                    lineNumber: 1666,
                    columnNumber: 84,
                    code: undefined,
                    inProject: undefined,
                    method: undefined,
                  },
                ],
              },
            ],
            severity: 'error',
            unhandled: false,
            severityReason: {
              type: 'handledException',
            },
            app: {
              version: 'sample_version',
              releaseStage: 'development',
            },
            device: {
              locale: 'en-GB',
              userAgent: 'sample user agent',
              time: expect.any(Date),
            },
            request: {
              url: 'http://www.test-host.com/',
              clientIp: '[NOT COLLECTED]',
            },
            breadcrumbs: [],
            context: 'ReferenceError: testUndefinedFn is not defined',
            metaData: {
              sdk: {
                name: 'JS',
                installType: '__MODULE_TYPE__',
              },
              state: {
                context: {
                  userAgent: 'sample user agent',
                  locale: 'en-GB',
                  app: {
                    version: 'sample_version',
                  },
                },
                lifecycle: {
                  writeKey: 'sample-write-key',
                },
                reporting: {
                  breadCrumbs: [],
                },
                source: {
                  id: 'sample_source_id',
                },
              },
              source: {
                id: 'sample_source_id',
                snippetVersion: 'sample_snippet_version',
              },
            },
            user: {
              id: 'sample-write-key',
            },
          },
        ],
      };
      expect(enhancedError).toEqual(expectedOutcome);
    });
  });

  describe('getErrorDeliveryPayload', () => {
    it('should return error delivery payload', () => {
      const appState = {
        lifecycle: {
          writeKey: signal('sample-write-key'),
        },
        context: {
          app: signal({ version: 'sample_version' }),
        },
      };
      const enhancedErrorPayload = {
        notifier: {
          name: 'Rudderstack JavaScript SDK Error Notifier',
          version: '__PACKAGE_VERSION__',
          url: 'https://github.com/rudderlabs/rudder-sdk-js',
        },
        events: [
          {
            payloadVersion: '5',
            exceptions: [
              {
                errorClass: 'Error',
                errorMessage: 'ReferenceError: testUndefinedFn is not defined',
                type: 'browserjs',
                stacktrace: [
                  {
                    file: 'ReferenceError: testUndefinedFn is not defined at Analytics.page http://localhost:3001/cdn/modern/iife/rsa.js:1610:3 at RudderAnalytics.page http://localhost:3001/cdn/modern/iife/rsa.js',
                    lineNumber: 1666,
                    columnNumber: 84,
                    code: undefined,
                    inProject: undefined,
                    method: undefined,
                  },
                ],
              },
            ],
            severity: 'error',
            unhandled: false,
            severityReason: {
              type: 'handledException',
            },
            app: {
              version: 'sample_version',
              releaseStage: 'development',
            },
            device: {
              locale: 'en-GB',
              userAgent: 'sample user agent',
              time: expect.any(Date),
            },
            request: {
              url: 'http://www.test-host.com/',
              clientIp: '[NOT COLLECTED]',
            },
            breadcrumbs: [],
            context: 'ReferenceError: testUndefinedFn is not defined',
            metaData: {
              sdk: {
                name: 'JS',
                installType: '__MODULE_TYPE__',
              },
              state: {
                context: {
                  userAgent: 'sample user agent',
                  locale: 'en-GB',
                  app: 'sample_version',
                },
                lifecycle: {
                  writeKey: 'sample-write-key',
                },
                breadCrumbs: [],
              },
            },
            user: {
              id: 'sample-write-key',
            },
          },
        ],
      };

      const deliveryPayload = getErrorDeliveryPayload(enhancedErrorPayload, appState);
      expect(deliveryPayload).toEqual(
        JSON.stringify({
          version: '1',
          message_id: 'test_uuid',
          source: {
            name: 'js',
            sdk_version: 'sample_version',
            write_key: 'sample-write-key',
            install_type: '__MODULE_TYPE__',
          },
          errors: enhancedErrorPayload,
        }),
      );
    });
  });
});
