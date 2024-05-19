/* eslint-disable global-require */
import { loadingSnippet } from './nativeSdkLoader';

function wait(time: number) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

describe('Test suite for the SDK', () => {
  const xhrMock: any = {
    open: jest.fn(),
    setRequestHeader: jest.fn(),
    onload: jest.fn(),
    onreadystatechange: jest.fn(),
    responseText: JSON.stringify({
      source: {
        config: {},
        id: 'id',
        destinations: [],
      },
    }),
    status: 200,
  };

  xhrMock.send = jest.fn(() => xhrMock.onload());

  const userId = 'jest-user-id';
  const userTraits = {
    'jest-user-trait-key-1': 'jest-user-trait-value-1',
    'jest-user-trait-key-2': 'jest-user-trait-value-2',
  };

  const groupUserId = 'jest-group-id';
  const groupTraits = {
    'jest-group-trait-key-1': 'jest-group-trait-value-1',
    'jest-group-trait-key-2': 'jest-group-trait-value-2',
  };

  beforeEach(async () => {
    jest.resetModules();
    jest.clearAllMocks();

    window.XMLHttpRequest = jest.fn(() => xhrMock);

    loadingSnippet();

    require('../__mocks__/cdnSDK');
    await wait(500);
  });

  it("If SDK script is 'required' (imported), then check that it is loaded and queued API calls are processed", async () => {
    // Only done for this case to test the
    // API calls queuing functionality
    jest.resetModules();
    rudderanalytics.page();
    require('../__mocks__/cdnSDK');
    await wait(500);

    expect(window.rudderanalytics.push).not.toBe(Array.prototype.push);

    // one source config endpoint call and one implicit page call
    // Refer to above 'beforeEach'
    expect(xhrMock.send).toHaveBeenCalledTimes(2);
  });

  it('If APIs are called, then appropriate network requests are made', () => {
    rudderanalytics.page();
    rudderanalytics.track('test-event');
    rudderanalytics.identify('jest-user');
    rudderanalytics.group('jest-group');
    rudderanalytics.alias('new-jest-user', 'jest-user');

    // one source config endpoint call and above API requests
    expect(xhrMock.send).toHaveBeenCalledTimes(6);
  });

  describe("Test group for 'getAnonymousId' API", () => {
    it("If 'getAnonymousId' API is invoked with no prior persisted data, then a UUID value is returned", () => {
      const anonId = rudderanalytics.getAnonymousId();

      const uuidRegEx = /^[a-z0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{12}$/;
      expect(anonId).toMatch(uuidRegEx);
    });

    it("If SDK generates anonymous ID, then it'll be persisted", () => {
      const anonIdRes1 = rudderanalytics.getAnonymousId();

      // SDK remembers the previously generated anonymous ID and returns the same value
      const anonIdRes2 = rudderanalytics.getAnonymousId();

      expect(anonIdRes1).toEqual(anonIdRes2);
    });
  });

  describe("Test group for 'reset' API", () => {
    it("If 'reset' API is invoked without setting the flag, then all persisted data except for anonymous ID is cleared", () => {
      // Make identify and group API calls to let the SDK persist
      // user (ID and traits) and group data (ID and traits)
      rudderanalytics.identify(userId, userTraits);
      rudderanalytics.group(groupUserId, groupTraits);

      const anonId = 'jest-anon-ID';
      rudderanalytics.setAnonymousId(anonId);

      // SDK clears all the persisted data except for anonymous ID
      rudderanalytics.reset();

      // SDK remembers the previously generated anonymous ID and returns the same value
      const anonIdRes = rudderanalytics.getAnonymousId();

      expect(anonId).toEqual(anonIdRes);
      expect(rudderanalytics.getUserId()).toEqual('');
      expect(rudderanalytics.getUserTraits()).toEqual({});
      expect(rudderanalytics.getGroupId()).toEqual('');
      expect(rudderanalytics.getGroupTraits()).toEqual({});
    });

    it("If 'reset' API is invoked with the flag set to 'true', then all the persisted data is cleared", () => {
      // Make identify and group API calls to let the SDK persist
      // user (ID and traits) and group data (ID and traits)
      rudderanalytics.identify(userId, userTraits);
      rudderanalytics.group(groupUserId, groupTraits);

      const anonId = 'jest-anon-ID';
      rudderanalytics.setAnonymousId(anonId);

      // SDK clears all the persisted data
      rudderanalytics.reset(true);

      // SDK remembers the previously generated anonymous ID and returns the same value
      const anonIdRes = rudderanalytics.getAnonymousId();

      expect(anonId).not.toEqual(anonIdRes);
      expect(rudderanalytics.getUserId()).toEqual('');
      expect(rudderanalytics.getUserTraits()).toEqual({});
      expect(rudderanalytics.getGroupId()).toEqual('');
      expect(rudderanalytics.getGroupTraits()).toEqual({});
    });
  });
});
