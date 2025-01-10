/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import { loadingSnippet } from './nativeSdkLoader';

describe('Test suite for the SDK', () => {
  const WRITE_KEY = 'write-key';
  const DATA_PLANE_URL = 'https://example.dataplane.com';

  const MOCK_SOURCE_CONFIGURATION = {
    updatedAt: new Date().toISOString(),
    source: {
      name: 'source-name',
      id: 'source-id',
      workspaceId: 'workspace-id',
      writeKey: WRITE_KEY,
      updatedAt: new Date().toISOString(),
      config: {
        statsCollection: {
          errors: {
            enabled: false,
          },
          metrics: {
            enabled: false,
          },
        },
      },
      enabled: true,
      destinations: [],
    },
  };

  const xhrMock: any = {
    open: jest.fn(),
    setRequestHeader: jest.fn(),
    onload: jest.fn(),
    onreadystatechange: jest.fn(),
    responseText: JSON.stringify(MOCK_SOURCE_CONFIGURATION),
    status: 200,
    send: jest.fn(() => xhrMock.onload()),
  };

  const USER_ID = 'user-id';
  const USER_TRAITS = {
    'user-trait-key-1': 'user-trait-value-1',
    'user-trait-key-2': 'user-trait-value-2',
  };

  const USER_GROUP_ID = 'group-id';
  const USER_GROUP_TRAITS = {
    'group-trait-key-1': 'group-trait-value-1',
    'group-trait-key-2': 'group-trait-value-2',
  };

  const SDK_PATH = '../dist/cdn/legacy/iife/rsa.js';

  const loadAndWaitForSDK = async () => {
    const readyPromise = new Promise(resolve => {
      // eslint-disable-next-line sonarjs/no-nested-functions
      window.rudderanalytics?.ready(() => resolve(true));
    });

    require(SDK_PATH);

    await readyPromise;
  };

  const originalXMLHttpRequest = window.XMLHttpRequest;

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    window.rudderanalytics = undefined;

    window.XMLHttpRequest = originalXMLHttpRequest;
  });

  describe('preload buffer', () => {
    it.skip('should process the buffered API calls when SDK script is loaded', async () => {
      // Mocking the xhr function
      window.XMLHttpRequest = jest.fn(() => xhrMock) as unknown as typeof XMLHttpRequest;

      loadingSnippet(WRITE_KEY, DATA_PLANE_URL);

      window.rudderanalytics?.page();
      window.rudderanalytics?.track('test-event');

      await loadAndWaitForSDK();

      expect((window.rudderanalytics as any).push).not.toBe(Array.prototype.push);

      // one source configuration request, one page request, and one track request
      expect(xhrMock.send).toHaveBeenCalledTimes(3);
    });
  });

  describe('api', () => {
    beforeEach(async () => {
      // Mocking the xhr function
      window.XMLHttpRequest = jest.fn(() => xhrMock) as unknown as typeof XMLHttpRequest;

      loadingSnippet(WRITE_KEY, DATA_PLANE_URL);

      await loadAndWaitForSDK();

      window.rudderanalytics?.reset();
    });

    afterEach(() => {
      window.XMLHttpRequest = originalXMLHttpRequest;
    });

    it.skip('should make network requests when event APIs are invoked', () => {
      window.rudderanalytics?.page();
      window.rudderanalytics?.track('test-event');
      window.rudderanalytics?.identify(USER_ID, USER_TRAITS);
      window.rudderanalytics?.group(USER_GROUP_ID, USER_GROUP_TRAITS);
      window.rudderanalytics?.alias('new-user-id', USER_ID);

      // one source config endpoint call and individual event requests
      expect(xhrMock.send).toHaveBeenCalledTimes(6);
    });

    describe('getAnonymousId', () => {
      it('should return a new UUID when no prior persisted data is present', () => {
        const anonId = window.rudderanalytics?.getAnonymousId();

        const uuidRegEx = /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[\da-f]{4}-[\da-f]{12}$/i;
        expect(anonId).toMatch(uuidRegEx);
      });

      it('should persist the anonymous ID generated by the SDK', () => {
        const anonIdRes1 = window.rudderanalytics?.getAnonymousId();

        // SDK remembers the previously generated anonymous ID and returns the same value
        const anonIdRes2 = window.rudderanalytics?.getAnonymousId();

        expect(anonIdRes1).toEqual(anonIdRes2);
      });
    });

    describe('reset', () => {
      it('should clear all the persisted data except for anonymous ID when the flag is not set', () => {
        // Make identify and group API calls to let the SDK persist
        // user (ID and traits) and group data (ID and traits)
        window.rudderanalytics?.identify(USER_ID, USER_TRAITS);
        window.rudderanalytics?.group(USER_GROUP_ID, USER_GROUP_TRAITS);

        const anonId = 'anon-ID';
        window.rudderanalytics?.setAnonymousId(anonId);

        // SDK clears all the persisted data except for anonymous ID
        window.rudderanalytics?.reset();

        // SDK remembers the previously generated anonymous ID and returns the same value
        const anonIdRes = window.rudderanalytics?.getAnonymousId();

        expect(anonId).toEqual(anonIdRes);
        expect(window.rudderanalytics?.getUserId()).toEqual('');
        expect(window.rudderanalytics?.getUserTraits()).toEqual({});
        expect(window.rudderanalytics?.getGroupId()).toEqual('');
        expect(window.rudderanalytics?.getGroupTraits()).toEqual({});
      });

      it('should clear all the persisted data include anonymous ID when the flag is set', () => {
        // Make identify and group API calls to let the SDK persist
        // user (ID and traits) and group data (ID and traits)
        window.rudderanalytics?.identify(USER_ID, USER_TRAITS);
        window.rudderanalytics?.group(USER_GROUP_ID, USER_GROUP_TRAITS);

        const anonId = 'anon-ID';
        window.rudderanalytics?.setAnonymousId(anonId);

        // SDK clears all the persisted data
        window.rudderanalytics?.reset(true);

        // SDK remembers the previously generated anonymous ID and returns the same value
        const anonIdRes = window.rudderanalytics?.getAnonymousId();

        expect(anonId).not.toEqual(anonIdRes);
        expect(window.rudderanalytics?.getUserId()).toEqual('');
        expect(window.rudderanalytics?.getUserTraits()).toEqual({});
        expect(window.rudderanalytics?.getGroupId()).toEqual('');
        expect(window.rudderanalytics?.getGroupTraits()).toEqual({});
      });
    });
  });
});
